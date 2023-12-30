<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;

class Controller extends BaseController
{
    use AuthorizesRequests, ValidatesRequests;

    /**
     * Success response method.
     *
     * @param $response_data
     * @param $message
     * @param int $code
     * @return JsonResponse
     */
    public function sendResponse($response_data, $message, int $code = Response::HTTP_OK) : JsonResponse
    {
        $response = [
            'success' => true,
            'data'    => $response_data,
            'message' => $message,
        ];
        return response()->json($response, $code);
    }

    /**
     * Error response method.
     *
     * @param string $error_message
     * @param array $error_details
     * @param int $code
     * @return JsonResponse
     */
    public function sendError(string $error_message, array $error_details = [], int $code = Response::HTTP_NOT_FOUND): JsonResponse
    {
        $response = [
            'success' => false,
            'message' => $error_message,
        ];

        if(!empty($error_details)){
            $response['details'] = $error_details;
        }
        return response()->json($response, $code);
    }
}
