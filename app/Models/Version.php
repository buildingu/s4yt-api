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
     * The attributes that are mass assignable.
     *
     * @var string[]
     */
    protected $fillable = [
        'year',
    ];

    public static function currentVersionId()
    {
        return (self::where('active', true)->first())->id;
    }

    public function users() : BelongsToMany
    {
        return $this->belongsToMany(User::class, 'user_version');
    }
}
