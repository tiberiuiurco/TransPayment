#!/bin/sh

# Abort on any error (including if wait-for-it fails).
set -e

# Wait for the backend to be up, if we know where it is.
if [ -n "$COMPANY_HOST" ]; then
  ./wait-for-it.sh "$COMPANY_HOST:${COMPANY_MICROSERVICE_PORT:-5001}"
fi


# Run the main container command.
exec "$@"
