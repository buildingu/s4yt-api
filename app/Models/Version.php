<?php

namespace App\Models;

use App\Traits\UsesUuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Version extends Model
{
    use HasFactory, UsesUuid;

    /**
     * The attributes that aren't mass assignable.
     *
     * @var array
     */
    protected $guarded = [];

    public static function currentVersionId()
    {
        return (self::where('active', true)->first())->id;
    }

    public function users() : BelongsToMany
    {
        return $this->belongsToMany(User::class, 'user_version');
    }
}
