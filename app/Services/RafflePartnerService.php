<?php

namespace App\Services;

use App\Models\RafflePartner;

class RafflePartnerService
{
    public function getPaginate()
    {
        return RafflePartner::query()->orderByDesc('created_at')->paginate(10);
    }

    public function getAll()
    {
        return RafflePartner::query()->orderByDesc('created_at')->get();
    }

    public function store(array $data)
    {
        RafflePartner::query()->create([
            'name' => $data['name'],
            'short_description' => $data['short_description'],
            'items_confirmed' => $data['items_confirmed'],
            'status' => $data['status'],
        ]);
    }

    public function show($id)
    {
        return RafflePartner::query()->findOrFail($id);
    }

    public function update(int $id, array $data)
    {
        $this->show($id)->update([
            'name' => $data['name'],
            'short_description' => $data['short_description'],
            'items_confirmed' => $data['items_confirmed'],
            'status' => $data['status'],
        ]);
    }

    public function destroy(int $id)
    {
        $this->show($id)->delete();
    }
}
