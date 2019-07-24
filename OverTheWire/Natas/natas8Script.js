//Because I'm die hard javascript fanboy
// and I cba to install php / boot up my linux VM
const secret = '3d3d516343746d4d6d6c315669563362';

//There's no concept of binary or hex2bin
const hex2bin2str = (hexString)=>{
    let ret = '';
    for(i=hexString.length; i>1; i=i-2){
        const hex = hexString.slice(i-2,i)
        ret = String.fromCharCode(Number.parseInt(hex,16)) + ret;
    }
    return ret;
};

// there's no string reverse
const strReverse = (string)=>{
        return string.split('').reduce((n,c)=>{
            return c+n;
        },'')
};
//node js doesn't have `btoa`, but you can do it using buffer transforms:
const b64Encoded = strReverse(hex2bin2str(secret));

const pass = Buffer.from(b64Encoded, 'base64').toString();

console.log('pass is: ', pass);
