@component('mail::message')
# Hey {{ $name }}:

We are glad that you registered for this year's $4YT. The game is just a few short weeks away and we are busy making the final touches. <br>
You may have noticed that you recently received some emails from us asking you to verify your email. Hopefully you did that! But if not feel free to locate that email and validate at your convenience.
If you have any trouble finding that email, you can click the button below:

@component('mail::button', ['url' => config('app.front_url') . '/register/verify-email' ])
Verify my email
@endcomponent

We invite you to log in and check our new profile page. In there we will ask of you to check your personal info and update your password to comply with our latest security standards. <br>
You can also invite some friends through a referral link to receive additional Dubl-U-nes (our in game tokens).
For every friend you refer, who registers using your unique link, we will reward you with 5 Dubl-U-nes!

@component('mail::button', ['url' => 'https://building-u.com/event/' ])
Read more
@endcomponent

We also invite you to be part of our Discord to keep you updated with the latest news of the game. <br>

@component('mail::button', ['url' => 'https://discord.com/invite/rCSCTxDQhU' ])
Join the $4YT Discord
@endcomponent

Last, but not least, here is a friendly link to the game login page so that you can conveniently check your profile <br>

@component('mail::button', ['url' => config('app.front_url') . '/login' ])
Go to the $4YT
@endcomponent


Thanks again for registering and see you at the game!,<br>
{{ config('app.name') }}
@endcomponent
