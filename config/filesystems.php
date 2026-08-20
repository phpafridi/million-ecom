<?php
return [
    'default' => env('FILESYSTEM_DISK', 'local'),
    'disks' => [
        'local' => [
            'driver' => 'local',
            'root'   => storage_path('app/private'),
            'throw'  => false,
            'report' => false,
        ],
        'public' => [
            'driver'     => 'local',
            'root'       => storage_path('app/public'),
            'url'        => rtrim(env('APP_URL', 'http://localhost'), '/') . '/storage',
            'visibility' => 'public',
            'throw'      => false,
            'report'     => false,
        ],
        // Direct uploads disk — stores in public/uploads (no symlink needed!)
        'uploads' => [
            'driver'     => 'local',
            'root'       => public_path('uploads'),
            'url'        => rtrim(env('APP_URL', 'http://localhost'), '/') . '/uploads',
            'visibility' => 'public',
            'throw'      => false,
            'report'     => false,
        ],
    ],
    'links' => [
        public_path('storage') => storage_path('app/public'),
    ],
];
