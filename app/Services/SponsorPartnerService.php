<?php

namespace App\Services;

use App\Models\SponsorPartner;

class SponsorPartnerService
{
    public function getAllSponsors()
    {
        return SponsorPartner::query()->orderByDesc('created_at')->paginate(10);
    }

    public function createSponsor(array $data)
    {
        $image = $data['image'];
        if ($image){
            $imageName = $this->saveImage($image);
        }

        return SponsorPartner::create([
            'short_description' => $data['short_description'],
            'description' => $data['description'],
            'status' => $data['status'],
            'image' => $imageName,
        ]);
    }

    public function getSponsorById($id)
    {
        return SponsorPartner::query()->findOrFail($id);
    }

    public function updateSponsor($sponsor, array $data)
    {
        $sponsor->update([
            'short_description' => $data['short_description'],
            'description' => $data['description'],
            'status' => $data['status'],
        ]);

         if(array_key_exists('image', $data) && $data['image'] === null) {
             $image = $data['image'];
             $this->removeExistingImage($sponsor);
             $imageName = $this->saveImage($image);
             $sponsor->update([
                 'image' => $imageName,
             ]);
         }
    }

    public function deleteSponsor($sponsor)
    {
        $this->removeExistingImage($sponsor);
        $sponsor->delete();
    }

    private function removeExistingImage($sponsor)
    {
        $path = 'app/public/sponsors';
        if (file_exists(storage_path($path . '/' . $sponsor->image))) {
            unlink(storage_path($path . '/' . $sponsor->image));
        }
    }

    /**
     * @param $image
     * @return string
     */
    public function saveImage($image): string
    {
            $imageName = time() . '.' . $image->getClientOriginalExtension();
            $path = 'app/public/sponsors';
            $image->move(storage_path($path), $imageName);
            return $imageName;

    }
}
