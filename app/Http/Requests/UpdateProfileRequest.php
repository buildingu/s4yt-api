<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProfileRequest extends FormRequest
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
        return [
            'name' => 'required|string|min:2',
            'grade_id' => 'required|integer|exists:grades,id',
            'education_id' => 'required|integer|exists:education,id',
            'school' => 'nullable|required_if:education_id,1|string',
            'country_id' => 'required|integer|exists:cities,id',
            'region_id' => 'nullable|integer|exists:cities,id',
            'city_id' => 'nullable|integer|exists:cities,id',
        ];
    }
}
