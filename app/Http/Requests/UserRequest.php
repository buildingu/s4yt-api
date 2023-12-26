<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UserRequest extends FormRequest
{
    private $route;

    public function __construct(){
        parent::__construct();

        $this->route = Request()->route()->getName();
    }

    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return $this->route === 'user.store' || $this->user()->id === $this->input('id') ? true : false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        $rules = [
            'name' => 'required|string|min:3',
            'email' => $this->route === 'user.store' ? 'required|string|email|unique:users,email' : 'required|string|email',
            'player.education_id' => 'required|integer',
            'player.grade_id' => 'required|integer',
            'player.country_iso' => 'required|string',
            'player.state_iso' => 'required|string',
            'player.city_id' => 'required|integer',
            'referral' => 'sometimes|integer'
        ];

        if($this->route !== 'user.store'){
            $rules['id'] = 'required|uuid';
        }

        $rules['password'] = $this->route === 'user.store' ? 'required|confirmed|min:8|max:24' : 'sometimes|confirmed|min:8|max:24';

        return $rules;
    }

    protected function passedValidation()
    {
        $password = $this->input('password');

        if($password){
            $this->merge([
                'password' => bcrypt($password)
            ]);
        }
    }
}
