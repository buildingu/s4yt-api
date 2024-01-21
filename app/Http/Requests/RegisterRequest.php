<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;

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
            'name' => 'required|string|min:2',
            'email'=> 'required|string|email:rfc,dns|unique:users,email',
            'password' => ['required','string','confirmed', Password::min(8)->mixedCase()->numbers()->symbols()],
            'grade_id' => 'required|integer|exists:grades,id',
            'education_id' => 'required|integer|exists:education,id',
            'school' => 'nullable|required_if:education_id,1|string',
            'country_id' => 'required|integer|exists:cities,id',
            'region_id' => 'nullable|integer|exists:cities,id',
            'city_id' => 'nullable|integer|exists:cities,id',
            'version_id' => 'nullable|uuid|exists:versions,id',
            'referral_code' => 'nullable|string|exists:players,referral_code'
        ];
    }
}
