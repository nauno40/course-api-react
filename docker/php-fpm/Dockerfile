FROM phpdockerio/php80-fpm:latest
ADD . /app/
WORKDIR "/app"

RUN apt-get update; \
    apt-get -y --no-install-recommends install \
        php8.0-http \ 
        php8.0-mysql \ 
        php8.0-xdebug; \
    apt-get clean; \
    rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/* /usr/share/doc/*;

RUN curl -fsSL https://deb.nodesource.com/setup_16.x | bash - && apt-get install -y nodejs
