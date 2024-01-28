<?php

namespace App\Services;

use App\Models\EventPartner;
use App\Models\RafflePartner;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Log;
use Spatie\MediaLibrary\MediaCollections\Exceptions\FileDoesNotExist;
use Spatie\MediaLibrary\MediaCollections\Exceptions\FileIsTooBig;

class MediaService
{
    /**
     * Method add media relationship to the object referred. Only to use in single media file collection.
     * @param Model $model
     * @param string $path
     * @param string $filename
     * @param string $collection
     * @param bool $is_update
     * @return bool
     */
    public static function addMedia(Model $model, string $path, string $filename, string $collection, bool $is_update = false) : bool
    {
        $flag = true;
        if($is_update) {
            $model->clearMediaCollection($collection);
        }

        try {
            $model
                ->addMediaFromDisk('livewire-tmp/'. $path)
                ->usingFileName($filename)
                ->toMediaCollection($collection);
            Log::debug('addMedia', array('model' => get_class($model), 'id' => $model->id, 'collection' => $collection, 'update' => $is_update));
        }catch (FileDoesNotExist|FileIsTooBig $e) {
            $flag = false;
            Log::debug('addMediaException', array('exception' => $e->getMessage(), 'model' => get_class($model), 'id' => $model->id, 'collection' => $collection, 'update' => $is_update));
        }
        return $flag;
    }

    /**
     * Methods add or updates media collections for the inform model object.
     * Files array should be the collection of related collections.
     * @param Model $model
     * @param array $files
     * @param array $data
     * @param bool $is_update
     * @return array
     */
    public static function processMedia(Model $model, array $files,  array $data, bool $is_update = false) : array
    {
        $process = [];
        foreach ($files as $file) {
            $media = null;
            if(isset($data[$file]['path']) && strlen($data[$file]['filename']) > 0) {
                $media = MediaService::addMedia($model, $data[$file]['path'], $data[$file]['filename'], $file, $is_update );
            }
            $process[$file] = $media;
        }
        return $process;
    }

}
