<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RegisterRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => 'required|string|min:3',
            'email'=> 'required|string|email|unique:users,email',
            'password' => 'required|string|confirmed|min:8',
            'grade_id' => 'required|integer|exists:grades,id',
            'education_id' => 'required|integer|exists:education,id',
            'school' => 'nullable|required_if:education_id,1|string',
            'city_id' => 'required|integer|exists:cities,id'
        ];
    }
}
