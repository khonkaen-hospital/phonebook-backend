#!/bin/bash

docker build -t docker.pkg.github.com/khonkaen-hospital/phonebook-backend/phonebook-api .
docker push docker.pkg.github.com/khonkaen-hospital/phonebook-backend/phonebook-api
