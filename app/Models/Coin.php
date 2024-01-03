<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Coin extends Model
{
    use HasFactory;

    const SOURCE_REGISTER = 1;
    const SOURCE_QUEST = 2;
    const SOURCE_INSTAGRAM = 3;
    const SOURCE_REFERRAL = 4;
}
