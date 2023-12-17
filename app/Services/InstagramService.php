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

    public function update($id,$data)
    {
        Instagram::query()->findOrFail($id)->update([
            'title' => $data['title'],
            'url' => $data['url']
        ]);
    }

    public function destroy($id): void
    {
        Instagram::query()->findOrFail($id)->delete();
    }

    public function getPosts()
    {
        return Instagram::query()->orderByDesc('created_at')->get();
    }
}
