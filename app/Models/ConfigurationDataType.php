<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ConfigurationDataType extends Model
{
    use HasFactory;

    const INTEGER = 'integer';
    const DATE = 'date';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'data_type',
        'slug'
    ];

    /**
     * Indicates if the model should be timestamped.
     *
     * @var bool
     */
    public $timestamps = false;

    public static function getIdBySlug(string $slug) : int
    {

        return ((self::where('slug', $slug)->first())->id);
    }
}
