# Natas
[http://overthewire.org/wargames/natas/](http://overthewire.org/wargames/natas/)

| level | password | notes |
| -- | -- | -- |
| 0 | natas0 |  |
| 1 | gtVrDuiDfck831PqWsLEZy5gyDz1clto  |  |
| 2 | ZluruAthQk7Q2MqmDeTiUij2ZvWy2mBi  | remember, if you see relative urls, maybe there's other things in those directories. |
| 3 | sJIJNW6ucpu6HPZ1ZAchaDtwd7oGrD14 | remember your `robots.txt` files! |
| 4 | Z9tkRkWmpt9Qr7XrR5jWRkgOU901swEZ | you can piss around with HTTP `Referer` in headers |
| 5 | iX6IOfmpN7AYOQGPwtn3fXpbaJVJcHfq | Firefox developer console cookie are under "Storage" tab |
| 6 | aGoY4q2Dc6MgDq4oL4YtoKtyAg9PeHa1 |  |
| 7 | 7z3hEENjQtflzgnT29q7wAvMNfZdh0i9 | try directory traversal all the time |
| 8 | DBfUBfqQG69KvJvJ1iAbMoIpwSNQ9bWe  | Javascript doesn't have _any_ of the necessary functions. `atob` is only in browser, not nodejs. Should've just booted up my vm and done it in php |
| 9 | W0mMhUcRRnG8dcghE4qvk3JA9lGt8nDl  | remember that the passwords are stored @ `/etc/natas_webpass/natasX` |
| 10 | nOpp1igQAkUzaI1GUUjzn1bFVj7xCNzu | grep allows you to specify a list of files to search ... |
| 11 | U82q5TCMMQ9xuFoI3dYX61s7OZD9JKoK | just write the solutions in the language the target was in... |
| 12 | EDXp0pS26wLKHZy1rDBPUZk0RKfLGIR3 | file uploads are nothing but trouble |
| 13 | jmLTY0qiPZBbaKc9341cqPQZBJv7MQbY | jpeg is `ffd8ff`. |
| 14 | Lg96M10TdfaPyVBkJdjymbllQ5L6qdl1 | didn't get the classic `1==1`, so went with a subtler one |
| 15 | AwWj0w5cvxrZiONgZ9J5stNVkmxdk39J | Blind sql injection: We can get a true/false of whether "user exists", but we can extend the check to the password. In Mysql, you need to specify `BINARY` to get case sensitive matches for `LIKE` |
| 16 | WaIHEacj63wnNIBROHeqi3p9t0m5nhmh | if you can run script that modifies the search string, you can make it true/false depending on the contents of another file |
| 17 | 8Ps3H0GWbn5rd9S7GmAdgQNdkhPkq9cw | sometimes the most difficult question is how do  get a true/false? luckily some systems allow stupid stuff, like sql's `SLEEP` command |
| 18 | xvKIqDjy4OPv7wCRgDlmj0pFsCsDjhdP | the in browser cookie modification is frustrating and doesn't allow parallelisation. |
| 19 | 4IwIrekcuZlA9OsjOkoUtwU6lhokCPYs | spotting encoding traits are useful |
| 20 | eofm3Wsshxc5bwtVnEuGIlr7ivb9KABF |  |
| 21 |  |  |
| 22 |  |  |
| 23 |  |  |
