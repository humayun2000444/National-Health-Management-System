to run this project on your pc create a database in MySQL:

Create Database health;
now open the Project folder in the VS code

then rename the .env.example file to .env In .env file change the database connection section

DB_CONNECTION=mysql 
DB_HOST=127.0.0.1 
DB_PORT=3306 
DB_DATABASE=your database name 
DB_USERNAME=your user 
DB_PASSWORD=your password

now run these commands

1. composer install
2. npm install
3. php artisan migrate
4. php artisan db:seed --class=AdminSeeder
5. php artisan key: generate
to run the backend : in current terminal

npm run dev

======================

to run front end open a new terminal and run

php artisan serve
