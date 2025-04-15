#!/bin/bash

while true; do
  curl --location --request POST 'http://localhost:3001/thirdweb/writeToEVMViaSDK' \
       --header ''
  sleep 20
done
