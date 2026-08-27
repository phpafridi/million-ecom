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
        $filename = 'backup_' . $db . '_' . now()->format('Ymd_His') . '.sql';
        $dir      = storage_path('app/backups');
        if (!is_dir($dir)) mkdir($dir, 0755, true);
        $path     = $dir . '/' . $filename;

        $backup = DatabaseBackup::create([
            'filename'   => $filename,
            'path'       => $path,
            'status'     => 'running',
            'created_by' => auth()->id(),
            'notes'      => $request->notes,
        ]);

        try {
            $passOption = $pass ? "-p\"$pass\"" : '';
            $cmd = "mysqldump -h {$host} -u {$user} {$passOption} {$db} > \"{$path}\" 2>&1";
            exec($cmd, $output, $code);

            if ($code !== 0 || !file_exists($path)) {
                $backup->update(['status' => 'failed', 'notes' => implode("\n", $output)]);
                return back()->with('error', 'Backup failed. Check server permissions.');
            }

            $size = filesize($path);
            $backup->update(['status' => 'completed', 'size' => $size]);
            ActivityLog::log('backup.created', "Database backup created: {$filename}", 'info');
            return back()->with('success', "Backup created: {$filename} (" . round($size/1024,1) . " KB)");
        } catch (\Throwable $e) {
            $backup->update(['status' => 'failed', 'notes' => $e->getMessage()]);
            ActivityLog::log('backup.failed', $e->getMessage(), 'danger');
            return back()->with('error', 'Backup failed: ' . $e->getMessage());
        }
    }

    public function download(int $id)
    {
        $backup = DatabaseBackup::findOrFail($id);
        if (!file_exists($backup->path))
            return back()->with('error', 'Backup file not found on disk.');
        ActivityLog::log('backup.downloaded', "Downloaded backup: {$backup->filename}", 'info');
        return response()->download($backup->path, $backup->filename);
    }

    public function destroy(int $id)
    {
        $backup = DatabaseBackup::findOrFail($id);
        if (file_exists($backup->path)) @unlink($backup->path);
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
