#!/bin/bash

docker build -t cb_sockets ./
docker run -p 5050:5050 cb_sockets