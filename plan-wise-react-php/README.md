# Plan Wise

A brief description about your project.

## Setup

The following steps will show you how to setup the project on your local machine for development and testing purposes.

### Prerequisites

- Node.js
- Docker
- PHP (>= 8.x)
- Composer
- MySQL / PostgreSQL

### Installation Steps

1. Clone the repository.
2. Run the `create-table.sql` script in your MySQL or PostgreSQL database to create the necessary tables. This script is located in the root directory of the project.
3. In your root folder (where you see both `frontend` and `backend` folders), create a `.env` file with the following format:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=your_database_name
DB_USERNAME=your_database_user
DB_PASSWORD=your_database_password
APP_KEY=base64:your_app_key
```
Note: If using PostgreSQL, change the `DB_CONNECTION` to `pgsql` and adjust the respective parameters accordingly.

4. Install PHP dependencies by running the following command in the `backend` folder:

```bash
composer install
```

5. Install Node.js dependencies for the frontend by running the following command in the `frontend` folder:

```bash
npm install
```

6. Set up the application key for Laravel (this generates the `APP_KEY` in the `.env` file):

```bash
php artisan key:generate
```

7. (Optional) If you're using Laravel migrations to create database tables, run:

```bash
php artisan migrate
```

8. Build the Docker image by running the following command in the root directory:

```bash
docker build -t my-app .
```

9. Run the Docker container:

```bash
docker run -p 5000:5000 -p 8000:8000 my-app
```

The application should now be running at `http://localhost:8000` for the backend API and `http://localhost:5000` for the frontend.

## Project Structure

- **`backend`**: This directory contains the Laravel backend. The entry point is `public/index.php`.
- **`frontend`**: This directory contains a typical React app.
- **`Dockerfile`**: This file is used to build a Docker image for the app.

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests to us.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

