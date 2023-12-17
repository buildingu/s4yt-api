<?php

namespace App\Services;

use App\Models\Instagram;

class InstagramService
{
    public function create(array $data): Instagram
    {
        return Instagram::query()->create([
            'title' => $data['title'],
            'url' => $data['url']
        ]);
    }
}
