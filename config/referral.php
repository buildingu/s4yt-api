<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Referral Length
    |--------------------------------------------------------------------------
    |
    | This value sets the number of characters to use in the generation of referrals.
    | Take into consideration that the higher this value is, the longer will be the
    | process of generation as well comparisons for unique constraint.
    |
    */
    'length' =>  env('REFERRAL_LENGTH', 10),
];
