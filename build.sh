#!/bin/bash

docker build -t docker.pkg.github.com/khonkaen-hospital/phonebook-backend/phonebook .
docker push docker.pkg.github.com/khonkaen-hospital/phonebook-backend/phonebook
