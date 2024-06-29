#!/bin/bash

# Define the number of concurrent requests
CONCURRENT_REQUESTS=4

# Define the URL to send the requests to
URL="http://localhost:3000/user/booking"

# Define the data payloads (JSON format) to send with each request
PAYLOADS=(
  '{"user_id": 2, "show_id": 8}'
  '{"user_id": 3, "show_id": 8}'
  '{"user_id": 11, "show_id": 8}'
  '{"user_id": 6, "show_id": 8}'
)

# Function to send a POST request and save the response
send_request() {
  local payload="$1"
  local RESPONSE=$(curl -s -w "%{http_code}" -X POST -H "Content-Type: application/json" -d "$payload" "$URL")
  local HTTP_STATUS=${RESPONSE:${#RESPONSE}-3}

  if [ "$HTTP_STATUS" -eq 200 ]; then
    echo "Response for payload $payload: $HTTP_STATUS"
  else
    echo "Request for payload $payload failed with HTTP status $HTTP_STATUS"
  fi
}

export -f send_request

# Loop through each payload and send requests concurrently using xargs
for payload in "${PAYLOADS[@]}"; do
  echo "Sending request with payload: $payload"
  send_request "$payload" &
done

# Wait for all background processes to finish
wait

echo "All requests completed."
