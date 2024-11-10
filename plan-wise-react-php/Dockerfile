FROM node:16 AS react-build

WORKDIR /app/frontend

COPY frontend/package.json frontend/package-lock.json ./ 
RUN npm install

COPY frontend ./ 
RUN npm run build

FROM php:8.1-fpm AS laravel-app

RUN apt-get update && apt-get install -y libpng-dev libjpeg-dev libfreetype6-dev zip git libpq-dev && \
    docker-php-ext-configure gd --with-freetype --with-jpeg && \
    docker-php-ext-install gd pdo pdo_pgsql && \
    curl -sS https://getcomposer.org/installer | php && mv composer.phar /usr/local/bin/composer

WORKDIR /app

COPY backend/ /app

COPY --from=react-build /app/frontend/build /app/public

EXPOSE 8000

CMD ["php-fpm"]
