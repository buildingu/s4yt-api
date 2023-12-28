<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;

class UserVersion extends Pivot
{
    /**
     * Indicates if the model should be timestamped.
     *
     * @var bool
     */
    public $timestamps = false;
}
