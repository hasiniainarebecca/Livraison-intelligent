<?php

namespace App\Events;

use App\Models\DeliveryLocation;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class LocationUpdated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public readonly int $orderId,
        public readonly DeliveryLocation $location
    ) {}

    public function broadcastOn(): Channel
    {
        // Canal privé : seul le client de cette commande peut s'y abonner
        return new Channel("delivery.{$this->orderId}");
    }

    public function broadcastAs(): string
    {
        return 'location.updated';
    }

    public function broadcastWith(): array
    {
        return [
            'order_id'  => $this->orderId,
            'latitude'  => $this->location->latitude,
            'longitude' => $this->location->longitude,
            'speed'     => $this->location->speed,
            'heading'   => $this->location->heading,
            'timestamp' => $this->location->recorded_at,
        ];
    }
}
