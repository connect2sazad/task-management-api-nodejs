#!/bin/bash

if [ ! -f .env ]; then

    echo ".env file not found!"
    echo "Generating .env file from .env.example!"

    cp .env.example .env

    JWT_SECRET=$(openssl rand -hex 32)

    sed -i '/^JWT_SECRET_KEY[[:space:]]*=/d' .env
    printf '\nJWT_SECRET_KEY=%s\n' "$JWT_SECRET" >> .env

    echo ".env created successfully."

fi

docker compose up -d --build