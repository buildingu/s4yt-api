# S4YT

The s4yt is an event for high school students. The game is available, for game purposes, for 48 hours and after that players can win prize money and/or raffle items. The evtn has some important timestamps:

1. Register available
2. Profile page available
3. Game start
4. Game end
5. Winners informed

In detail the event is built around two main axis: game and raffle.

## The game

Businesses, for building-u nomenclature event partners, provide questions (one question each) and players answer them. Event partners are assigned an amount of money, provided by building-u, and is their prerogative to create as many awards as they see fit and assign an amount of money (prize) to each. Businesses should be able to set these values through the admin panel before, during and after the game. During the game the businesses do not have much to do but when the game is finished they should have access to the answers of their question. The objective is for them to read the answers (max 1 per player) and assign players awards.

## The raffle

Sponsors, for building-u nomenclature raffle partners, provide items. During the game, players can assign any number of coins to the item(s) of their preference. This are rewarded by randomization. For registering and being part of the game they have a base number of coins to spend but they can earn more through social media interaction and they can keep track of their total amount in the profile page. Items can have stock bigger than one and that means multiple randomization and winners for that item. In order to make things more fair...If someone already won an item in the previous draft, and they win again, another randomization will be triggered in order to ensure the max number of different players win items. If that still is not possible, due to number of players or bidders in that item, the previous rule will not be considered.

## S4YT-API

This is the backend application of the game and is developed in Laravel. We follow the main gitflow organization paradigm: three branches for production, staging and develop environment. Production is related to what is actually accesible in the web. Staging referers to a test environment designed for internal testing and showcase potential partners as example. We will be adding a documentation, in the near future, for the API and available endpoints.

For local setup please execute the following steps:

1. Clone the repository
2. Install PHP dependencies (```composer install```)
  - If prompted, update composer and repeat step 2 (```composer update```)
  - For incompatible package errors, uncomment extensions in your php.ini file by removing `;` in front of required extensions
3. Install Node dependecnies (```npm i```)
4. Copy .env.example into .env (```cp .env.example .env```)
5. Set application key (```php artisan key:generate```)
6. Create local DB
7. Set local DB credentials in .env file
8. Create tables into DB (```php artisan migrate```)
9. Create OAuth keys in /storage (```php artisan passport:keys --force```)
10. Create Passport ID and SECRET and copy credentials to .env file(```php artisan passport:client --personal```)
11. Copy ADMIN/SUPER_ADMIN credentials from config/app.php to .env file
12. Populate testing data (```php artisan db:seed```)
13. Run web server (```php artisan serve```)

## Archive

This game has an archive version (last year version) available [here](https://s4yt-archive.building-u.com). For frontend purposes please use this account (email: bosco.eli@example.org; password: qwerty123); backend, use this account (email: nmachuca@protonmail.com; password: qwerty123). This version is a minimal approach data wise that we can edit if needed. The difference in the accounts is the fact is that players do not have access to the admin panel meanwhile admins do. Please, the admin panel access is intended for reference purposes. We can recreate it if needed but please be extra careful with the *configurations* module ( **DO NOT CHANGE** records here)
