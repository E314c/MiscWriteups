
## Natas 16

```php
if($key != "") {
    if(preg_match('/[;|&`\'"]/',$key)) {
        print "Input contains an illegal character!";
    } else {
        passthru("grep -i \"$key\" dictionary.txt");
    }
}
```

well it looks like `$()` bash commands aren't messed with, but trying override the dictionary.txt with content from elsewhere doesn't work: `$(cp /etc/natas_webpass/natas17 ./dictionary.txt)`. Though it does return the whole dictionary (because the STDOUT of that expression is blank, so we grep for `""` in `dictionary.txt`)

But maybe we should apply what we just learned: What if we can use the grep to tell us if the password contains certain letters?
imagine the line `grep -i "$(echo '')^B$" dictionary.txt`: Because the inner script (`echo ''`) returns nothing, we grep for `^B$`, which exists.
But if the inner script returned something, then it would be prepended on the grep and cause the outer one to fail:
`grep -i "$(echo 'MyCode')^B$" dictionary.txt` => `grep -i "MyCode^B$" dictionary.txt` => no results

well we can `grep` the password file for NATAS17 and get true/falses: `grep -i "$(grep '^a.+$' /etc/natas_webpass/natas17 )^B$" dictionary.txt`
If the password starts with an `a`, then the grep will succeed and the password will be prepended to the outer grep:
`grep -i "$(grep '^a.+$' /etc/natas_webpass/natas17 )^B$" dictionary.txt` => `grep -i "a*****^B$" dictionary.txt`, which won't match anything.
if the password doesn't start with an `a`, the inner grep prints nothing to STDOUT, so we get
`grep -i "$(grep '^a.+$' /etc/natas_webpass/natas17 )^B$" dictionary.txt` => `grep -i "^B$" dictionary.txt` => returns `B`

Lets just whip up another brute force script!

## Natas 17

```php
    $query = "SELECT * from users where username=\"".$_REQUEST["username"]."\"";
    if(array_key_exists("debug", $_GET)) {
        echo "Executing query: $query<br>";
    }

    $res = mysql_query($query, $link);
    if($res) {
    if(mysql_num_rows($res) > 0) {
        //echo "This user exists.<br>";
    } else {
        //echo "This user doesn't exist.<br>";
    }
    } else {
        //echo "Error in query.<br>";
    } 
```
Man, I would've understood a bit faster if the source code in FF showed up syntax highlighted for PHP. I was wondering for ages why I didn't get _any_ output.

This challenge is __very__ similar to Natas15, but the main issue is how do we get some sort of true/false from the system?
Luckily for us, SQL has a `SLEEP` command _for some reason_. This means we can tell our SQL command to sleep for some seconds _if_ the condition was true:
`SELECT * from users where username="natas18" AND IF(TRUE , SLEEP(5), 0);`
We choose to only sleep on `true` as we expect to be wrong most of the time.
converting to our password checking:
`SELECT * from users where username="natas18" AND IF(password LIKE "_" , SLEEP(5), 0);` will tell us if the password is a single character.

looks like it's time to copy Natas15 script and add a tweak on the true/false determination!

## Natas 18
```php
$maxid = 640; // 640 should be enough for everyone

function isValidAdminLogin() { /* {{{ */
    if($_REQUEST["username"] == "admin") {
    /* This method of authentication appears to be unsafe and has been disabled for now. */
        //return 1;
    }

    return 0;
}
/* }}} */
function isValidID($id) { /* {{{ */
    return is_numeric($id);
}
/* }}} */
function createID($user) { /* {{{ */
    global $maxid;
    return rand(1, $maxid);
}
/* }}} */
function debug($msg) { /* {{{ */
    if(array_key_exists("debug", $_GET)) {
        print "DEBUG: $msg<br>";
    }
}
/* }}} */
function my_session_start() { /* {{{ */
    if(array_key_exists("PHPSESSID", $_COOKIE) and isValidID($_COOKIE["PHPSESSID"])) {
        if(!session_start()) {
            debug("Session start failed");
            return false;
        } else {
            debug("Session start ok");
            if(!array_key_exists("admin", $_SESSION)) {
                debug("Session was old: admin flag set");
                $_SESSION["admin"] = 0; // backwards compatible, secure
            }
            return true;
        }
    }

    return false;
}
/* }}} */
function print_credentials() { /* {{{ */
    if($_SESSION and array_key_exists("admin", $_SESSION) and $_SESSION["admin"] == 1) {
        print "You are an admin. The credentials for the next level are:<br>";
        print "<pre>Username: natas19\n";
        print "Password: <censored></pre>";
    } else {
        print "You are logged in as a regular user. Login as an admin to retrieve credentials for natas19.";
    }
}
/* }}} */

$showform = true;
if(my_session_start()) {
    print_credentials();
    $showform = false;
} else {
    if(array_key_exists("username", $_REQUEST) && array_key_exists("password", $_REQUEST)) {
    session_id(createID($_REQUEST["username"]));
    session_start();
    $_SESSION["admin"] = isValidAdminLogin();
    debug("New session started");
    $showform = false;
    print_credentials();
    }
}  
```

First glance tells us there's only 640 sessionsIds available, and so maybe we should just bruteforce the session to find someone already logged in as an Admin.
This is backed up by the face that no one new can become admin, as `isValidAdminLogin()` always returns `0`


## Natas 19
```
This page uses mostly the same code as the previous level, but session IDs are no longer sequential... 
```
Erm?
So we attempt a login and check the sessionId:
`PHPSESSID=3432302d61646d696e`
hmmm.
and again (using the user `admin` for these btw.)
`3138322d61646d696e`
`3633392d61646d696e`
`3338352d61646d696e`
seems like it's `******2d61646d696e`
lets try another name: `alice`
`382d616c696365`
`3333392d616c696365`
`3237302d616c696365`
I don't know what happened on the first one, but this time we have `******2d616c696365` repeating

between both of them, it's:
`******2d61646d696e`
`******2d616c696365`
____________________
`******2d616*6*6*6*`

one more for good luck?
`bob`:
`3535352d626f62`
`3332382d626f62`
`3333332d626f62`
________________
`******2d626f62`

Now the only simliarity for _all 3_ usernames is:
`******2d6*6*6*?`

that last one was important: it's a different length and completely different characters to the previous attemts, where `alice` and `admin` are the same length and start with the same character.

From the data, we can guess:
- The first 6 characters are the idenifier (or maybe there's less, given the alice result?)
- there's always a `2d6`, which probably represents a delimiter, because ...
- the last part seems to be an encoding of the username

if you know your [ascii](https://www.asciitable.com/), you may recognise that `61` in hex is the character code for `a`, so from the last parts of each id: 
`61 64 6d 69 6e` => `a d m i n`
`61 6c 69 63 65` => `a l i c e`
`62 6f 62` => `b o b`
therefore:
`2d` => `-`
`30` => `0`
`31` => `1` (etc)

so it appears the session id is in the format `${id}-${username}`

so let's get to brute forcing again:

__NOTE__: I had to run this script a few times. It's possible the server only creates the admin sessions once every so often, because I searched the entire id space a couple of times, then on the 3rd try the script returned a matched HTML for for an id.