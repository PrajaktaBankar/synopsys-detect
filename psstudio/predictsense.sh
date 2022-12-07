#!/bin/sh
echo "Listing the docker images"
M_INFO=$(dmidecode -s system-serial-number && cat /proc/cpuinfo | grep Serial | cut -d ':' -f 2 &&  uname -m && uname)
#echo "$M_INFO"
export MACHINE_INFO="$M_INFO"
echo "Running docker-compose file"
docker-compose up -d --build
#docker images
