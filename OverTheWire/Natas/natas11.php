<?php
// fine, i'll go back to my dark history of writing php...

$cookie = 'ClVLIh4ASCsCBE8lAxMacFMZV2hdVVotEhhUJQNVAmhSM3wONTN8aAw:""';
$afterdecode = base64_decode($cookie);

$knownData = json_encode(array("showpassword"=>"no", "bgcolor"=>"#DDDDDD"));

//I basically just copied this out of the source, but made it so we supply our own key
function xor_encrypt($in, $key) {
    $text = $in;
    $outText = '';

    // Iterate through each character
    for($i=0;$i<strlen($text);$i++) {
    $outText .= $text[$i] ^ $key[$i % strlen($key)];
    }

    return $outText;
}

echo xor_encrypt($afterdecode, $knownData);
echo "\n----\n";
//After running once, we found the key:
$key = "qw8J";
$cookieWeWant = array("showpassword"=>"yes", "bgcolor"=>"#ccBeef");
$cookieData = base64_encode(xor_encrypt(json_encode($cookieWeWant),$key));
echo $cookieData;

echo "\n";

?>
