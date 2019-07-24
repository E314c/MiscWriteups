# Bandit
http://overthewire.org/wargames/bandit/
`ssh -p 2220 -l banditX bandit.labs.overthewire.org`

| level | password | notes |
|---|
| 0	| bandit0 | |
| 1 | boJ9jbbUNNfktd78OOpsqOltutMc3MY1 | |
| 2 | CV1DtqXWVFXTvM2F0k09SHz0YwRINYA9 | `-` is often an alias for stdin/stdout in bash, so need to use escapes, or force interpretation as file using `./-` |
| 3 | UmHadQclWmgdLOKQ3YNgjWxGoRMb5luK | |
| 4 | pIwrPrtPN36QITSp3EQaw936yaFoFgAB | `file` can be used with wildcards to classify multiple files |
| 5 | koReBOKuIDDepwhWk7jZC0RTdopnAYKh | `find` has a `-not` flag to negate params, `-size $$c` specifies size in bytes (default is `b` which is 516 byte blocks) |
| 6 | DXjZPULLxYr17uwoI01bNLQbtFemEgo7 | `find` has `-user` and `-group` params |
| 7 | HKBPTKQnIay4Fw76bEy8PVxKEDQRKTzs |  |
| 8 | cvX2JJa4CFALtqS87jk27qwqGhBM9plV | `uniq` only removes adjacent matched reulsts. Need to `sort` input first |
| 9 | UsvVyFSfZZWbi6wgC7dAFyFuR6jQQUhR | `strings` allow you to extract strings from binary files. |
| 10 | truKLdjsbJ5g7yyJ2X2R0o3a5HQJFuLk |  |
| 11 | IFukwKGsFW8MOq3IRFqrxE1hxTNEbUPR | `tr` can be used to translate between an input character set to an output one (simple cipher technique) |
| 12 | 5Te8Y4drgCRfCx8ugdwuEX8KFC6k2EUu | `xxd` can be used to create and reverse hexdumps. `file` can be used to determine types of compression. `gzip`expects `.gz` file names, even when decompressing, though this can be modified with the `-S` option |
| 13 | 8ZjyCRiBWFYkneahHwxCv3wb2a1ORpYL |  |
| 14 | 4wcYUJFw0k0XLShlDzztnTBHiqxU3b3e |  |
| 15 | BfMYroe26WYalil77FoDi9qh59eK5xNr | `openssl s_client` allows you to open an ssl connection (like telnet, but secured), without then trying to shell or anything. may need the `-ign_eof` flag to hold open connection even if EOF is found in the stream |
| 16 | cluFn7wTiGryunymYOu4RcffSxQluehd |  |
| 17 | `./keys/bandit17.ssh` |  |
| 18 | kfBf3eYk5BPBRzwjqutbbfE887SVc5Yd | `ssh` can be run with a command on the end, that is executed as soon as it authenticates, before local bash profiles are loaded. |
| 19 | IueksS7Ubh8G3DCwVzrTd8rAVOwq3M5x | binaries with an `s` flag in permissions mean they are always run as if they are the owner of that binary, even if invoked by another user (who must still have permissions to execute the binary) |
| 20 | GbKksEFF4yrVs6il55v6gwY5aVje5f0j | with `ssh` you can use the `-L` flag to tunnel from a local port, out of the ssh'd machine. `nc` can be used to connect or to listen on any given port/ host. If listening, you can interactively reply to connection that occur. |
| 21 | gE269g2h3mw3pwgrj0Ha9Uoqen1c9DGr |  |
| 22 | Yk7owGAcWjwMVRwrTesJEwB7WVOiILLI |  |
| 23 | jc1udXuA1tiHqjIsL8yaapX5XIAI6i0n |  |
| 24 | UoMYTrfrBFHyQXmg6gzctqAwOmw1IohZ | see `./scripts/pinbrute2.sh`. The most expensive part of a connection is bringup/teardown, so best to try all in one connection. `grep -v` allows you to search for lines _NOT_ matching a pattern |
| 25 | uNG9O58gUE7snukf3bvZ0rxhtnjzSGzG | `more` is similar to `less`. It happens to have an inbuilt `vim` shell, but will exit if it can display the whole text of original file on screen (like `less`). If you make the screen small enough, `more` will stay open and you can use `v` to access the vim instance. Then you can use `:e` to open another file. |
| 26 | `./keys/bandit26.ssh` and 5czgV9L3Xx8JPOyRbXh6lQbmIOWvPT6Z |  |
