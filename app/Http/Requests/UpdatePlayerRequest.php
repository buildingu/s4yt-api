<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePlayerRequest extends FormRequest
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
            "name" => "required|string",
            "email" => "required|string|email",
            "education" => "required|numeric|exists:education,id",
            "instagram" => "sometimes|string",
            "grade" => "required|numeric|exists:grades,id",
            "country_iso" => "required|string",
            "state" => "required|string",
            "city" => "required|string",
            //"role" => "required|string|exists:roles,name"
        ];
    }

    protected function passedValidation()
    {
        $fields = ['education','instagram','grade','country_iso','state','city','country'];
        $data = $this->only($fields);

        foreach($fields as $field){
            $this->request->remove($field);
        }

        $this->merge([
            'player'=>[
                'education_id'=>$data['education'],
                'instagram'=>$data['instagram'],
                'grade_id'=>$data['grade'],
                'country_iso'=>$data['country_iso'],
                'state_iso'=>$data['state'],
                'city_id'=>$data['city']
            ]
        ]);
    }
}
