<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\InstagramService;
use Illuminate\Http\Request;

class InstagramController extends Controller
{
    public function getPosts()
    {
        $posts = (new InstagramService())->getPosts();
        return $this->sendResponse(
            [
                'posts' => $posts
            ],
            "List of Instagram posts"
        );
    }

}
