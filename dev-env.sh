#!/bin/bash

# CF
if [ $1 == "cf" ]; then
  if [ $2 == "dev" ]; then
    export API_BASE_URL="https://api.dev-cf.halan.io";
  else
    export API_BASE_URL="https://api.test-cf.halan.io";
  fi
  echo "running $1 on $2 env"
  npm run start-login & npm run start-cf
fi

# LTS & LTS Docs
if [[ $1 == "lts" || $1 == "lts-docs" ]]; then
  if [ $2 == "dev" ]; then
    export API_BASE_URL="https://api.dev.halan.io";
  else
    export API_BASE_URL="https://api.test.halan.io";
  fi
  echo "running $1 on $2 env"
  
  if [ $1 == "lts" ]; then
    npm run start-login & npm run start-mohassel
  fi
  
  if [ $1 == "lts-docs" ]; then
    npm run start-login & npm run start-documents
  fi
  
fi
