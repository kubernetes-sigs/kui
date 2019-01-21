#!/bin/bash

# install jq if it does not exist
if [ ! -f  /usr/bin/jq ]; then
  apk update && apk add jq
fi

# determine number of flips
N=`echo "$@" | jq '."n"'`

# total count of heads and tails
HEADS=0
TAILS=0

for i in `seq 1 $N`; do
  echo -n "flipping coin..."
  if [ $(( RANDOM % 2 )) == 0 ]; then
    echo "HEADS"; HEADS=$(( HEADS + 1 ))
  else
    echo "TAILS"; TAILS=$(( TAILS + 1 ))
  fi
done

echo "{\"trials\": $N, \"heads\": $HEADS, \"tails\": $TAILS}"
