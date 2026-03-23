<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Default Broadcaster
    |--------------------------------------------------------------------------
    |
    | Définit le driver de broadcast par défaut.
    | Ici : Reverb (temps réel natif Laravel)
    |
    */

    'default' => env('BROADCAST_CONNECTION', 'reverb'),

    /*
    |--------------------------------------------------------------------------
    | Broadcast Connections
    |--------------------------------------------------------------------------
    |
    | Configuration des drivers de broadcast.
    |
    */

    'connections' => [

        'reverb' => [
            'driver' => 'reverb',

            // Identité de l’application Reverb
            'key' => env('REVERB_APP_KEY'),
            'secret' => env('REVERB_APP_SECRET'),
            'app_id' => env('REVERB_APP_ID'),

            // Options réseau
            'options' => [
                'host' => env('REVERB_HOST', '127.0.0.1'),
                'port' => env('REVERB_PORT', 6001),
                'scheme' => env('REVERB_SCHEME', 'http'),
                'useTLS' => env('REVERB_SCHEME', 'http') === 'https',
            ],
        ],

        // Fallback utile en debug
        'log' => [
            'driver' => 'log',
        ],
    ],

];
