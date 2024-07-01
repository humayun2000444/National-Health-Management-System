to run this project on your pc create a database in MySQL:

Create Database health;
now open the Project folder in the VS code

then rename the .env.example file to .env In .env file change the database connection section

DB_CONNECTION=mysql DB_HOST=127.0.0.1 DB_PORT=3306 DB_DATABASE=your database name DB_USERNAME=your user DB_PASSWORD=your password

now run these commands

php artisan key: generate
npm install
php artisan migrate
composer install
to run the backend : in current terminal

npm run dev

======================

to run front end open a new terminal and run

php artisan serve
