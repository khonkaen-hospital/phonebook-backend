#!/bin/bash

ssh dixon@192.168.0.128 <<'ENDSSH'
cd /home/dixon/phonebook
docker-compose pull
docker-compose up -d
ENDSSH
