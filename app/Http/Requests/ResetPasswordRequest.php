<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ResetPasswordRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return Request()->has('token') ? [
            'email'=> 'required|email|email|exists:users,email',
            'token'=> 'required|string',
            'password' => 'required|string',
            'password_confirmation' => 'required|string',
        ] : [
            'email'=> 'required|email|email|exists:users,email',
        ];
    }
}
