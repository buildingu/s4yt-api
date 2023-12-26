<?php

namespace App\Services;

use App\Models\RaffleItem;
use Illuminate\Support\Str;

class RaffleItemService
{
    public function getPaginate()
    {
        return RaffleItem::with('parent')->orderByDesc('created_at')->paginate(10);
    }

    public function getAll()
    {
        return RaffleItem::with('parent')->orderByDesc('created_at')->get();
    }

    public function show(int $id)
    {
        return RaffleItem::with('parent')->findOrFail($id);
    }

    public function store(array $data)
    {
        $image = $data['image'];
        if ($image){
            $imageName = $this->saveImage($image);
        }

        RaffleItem::query()->create([
            'name' => $data['name'],
            'slug' => Str::slug($data['slug']),
            'description' => $data['description'],
            'stock' => $data['stock'],
            'active' => $data['active'],
            'raffle_partner_id' => $data['raffle_partner_id'],
            'image' =>  $imageName,
        ]);
    }

    public function update(int $id, array $data)
    {
        $item = $this->show($id);

        $item->update([
            'name' => $data['name'],
            'slug' => $data['slug'],
            'description' => $data['description'],
            'stock' => $data['stock'],
            'active' => $data['active'],
            'raffle_partner_id' => $data['raffle_partner_id'],
        ]);

        if(array_key_exists('image', $data) && $data['image'] === null) {
            $image = $data['image'];
            $this->removeExistingImage($item);
            $imageName = $this->saveImage($image);
            $item->update([
                'image' => $imageName,
            ]);
        }
    }

    public function destroy(int $id)
    {
        $item = $this->show($id);

        if ($item->image){
            $this->removeExistingImage($item);
        }
        $item->delete();
    }

    private function removeExistingImage($item)
    {
        $path = 'app/public/items';
        if (file_exists(storage_path($path . '/' . $item->image))) {
            unlink(storage_path($path . '/' . $item->image));
        }
    }

    /**
     * @param $image
     * @return string
     */
    public function saveImage($image): string
    {
        $imageName = time() . '.' . $image->getClientOriginalExtension();
        $path = 'app/public/items';
        $image->move(storage_path($path), $imageName);
        return $imageName;

    }
}
