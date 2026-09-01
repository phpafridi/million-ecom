<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\{DatabaseBackup, ActivityLog};
use Illuminate\Support\Facades\{DB, Storage};
use Illuminate\Http\Request;
use Inertia\Inertia;

class BackupController extends Controller
{
    public function index()
    {
        $backups = DatabaseBackup::latest()->get()->map(fn($b) => [
            'id'         => $b->id,
            'filename'   => $b->filename,
            'size'       => $b->size_formatted,
            'status'     => $b->status,
            'created_by' => $b->creator?->name ?? 'System',
            'notes'      => $b->notes,
            'created_at' => $b->created_at->format('d M Y, h:i A'),
            'download_url'=> route('admin.backup.download', $b->id),
        ]);

        return Inertia::render('Admin/Backup/Index', [
            'backups'       => $backups,
            'disk_free'     => $this->diskFree(),
            'db_size'       => $this->dbSize(),
        ]);
    }

    public function create(Request $request)
    {
        $db       = config('database.connections.mysql.database');
        $user     = config('database.connections.mysql.username');
        $pass     = config('database.connections.mysql.password');
        $host     = config('database.connections.mysql.host');
        $port     = config('database.connections.mysql.port', 3306);
        $filename = 'backup_' . $db . '_' . now()->format('Ymd_His') . '.sql';
        $dir      = storage_path('app/backups');
        if (!is_dir($dir)) mkdir($dir, 0755, true);
        $fullPath = $dir . '/' . $filename;
        // Store the path relative to storage/app — an absolute path baked
        // into the database breaks the moment this app is ever moved,
        // restored, or migrated to a different server/directory, since the
        // old absolute path won't exist there. Reconstructing the full path
        // fresh from storage_path() each time (download/destroy below) keeps
        // backups portable across environments.
        $relativePath = 'backups/' . $filename;

        $backup = DatabaseBackup::create([
            'filename'   => $filename,
            'path'       => $relativePath,
            'status'     => 'running',
            'created_by' => auth()->id(),
            'notes'      => $request->notes,
        ]);

        // Write credentials to a temporary MySQL option file instead of
        // putting the password directly in the shell command string — a
        // plain -p"$pass" argument is visible to any other process on the
        // server for the duration mysqldump runs (e.g. via `ps aux`), which
        // is a real credential-exposure risk on a shared/multi-tenant VPS.
        $cnfPath = tempnam(sys_get_temp_dir(), 'mysql_backup_');
        file_put_contents($cnfPath, "[client]\nuser={$user}\npassword={$pass}\nhost={$host}\nport={$port}\n");
        chmod($cnfPath, 0600);

        try {
            $cmd = "mysqldump --defaults-extra-file={$cnfPath} {$db} > \"{$fullPath}\" 2>&1";
            exec($cmd, $output, $code);
            @unlink($cnfPath);

            if ($code !== 0 || !file_exists($fullPath) || filesize($fullPath) === 0) {
                $backup->update(['status' => 'failed', 'notes' => implode("\n", $output)]);
                return back()->with('error', 'Backup failed. Check server permissions.');
            }

            $size = filesize($fullPath);
            $backup->update(['status' => 'completed', 'size' => $size]);
            ActivityLog::log('backup.created', "Database backup created: {$filename}", 'info');

            // Keep only the most recent 10 completed backups — without this,
            // backups accumulate forever and can eventually fill the disk.
            DatabaseBackup::where('status', 'completed')
                ->orderByDesc('created_at')
                ->skip(10)->take(1000)->get()
                ->each(function ($old) {
                    $oldFull = $this->resolvePath($old->path);
                    if (file_exists($oldFull)) @unlink($oldFull);
                    $old->delete();
                });

            return back()->with('success', "Backup created: {$filename} (" . round($size/1024,1) . " KB)");
        } catch (\Throwable $e) {
            @unlink($cnfPath);
            $backup->update(['status' => 'failed', 'notes' => $e->getMessage()]);
            ActivityLog::log('backup.failed', $e->getMessage(), 'danger');
            return back()->with('error', 'Backup failed: ' . $e->getMessage());
        }
    }

    // Backups created before this fix have an absolute path stored (old
    // format); new ones store a path relative to storage/app (portable
    // across server moves). Handle both so existing backups don't suddenly
    // become undownloadable/undeletable after this update.
    private function resolvePath(string $path): string
    {
        return str_starts_with($path, '/') || preg_match('#^[A-Za-z]:[\\\\/]#', $path)
            ? $path
            : storage_path('app/' . $path);
    }

    public function download(int $id)
    {
        $backup   = DatabaseBackup::findOrFail($id);
        $fullPath = $this->resolvePath($backup->path);
        if (!file_exists($fullPath))
            return back()->with('error', 'Backup file not found on disk.');
        ActivityLog::log('backup.downloaded', "Downloaded backup: {$backup->filename}", 'info');
        return response()->download($fullPath, $backup->filename);
    }

    public function destroy(int $id)
    {
        $backup   = DatabaseBackup::findOrFail($id);
        $fullPath = $this->resolvePath($backup->path);
        if (file_exists($fullPath)) @unlink($fullPath);
        $backup->delete();
        ActivityLog::log('backup.deleted', "Deleted backup: {$backup->filename}", 'warning');
        return back()->with('success', 'Backup deleted.');
    }

    private function diskFree(): string
    {
        $free = @disk_free_space(storage_path());
        if (!$free) return 'N/A';
        return round($free / 1073741824, 1) . ' GB';
    }

    private function dbSize(): string
    {
        try {
            $db = config('database.connections.mysql.database');
            $size = DB::select("SELECT ROUND(SUM(data_length + index_length) / 1024, 1) AS size
                FROM information_schema.tables WHERE table_schema = ?", [$db])[0]->size ?? 0;
            return $size . ' KB';
        } catch (\Throwable $e) { return 'N/A'; }
    }
}
