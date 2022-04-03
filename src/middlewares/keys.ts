import * as bcu from 'bigint-crypto-utils';
import { RsaPrivateKey } from './rsaprivatekey';
import { RsaPublicKey } from './rsapublickey';
// const bcu = require('bigint-crypto-utils');
// const RsaPrivateKey = require('./rsaprivatekey');
// const RsaPublicKey = require('./rsaprivatekey');
// import { RsaPrivateKey } from "./rsaprivatekey";
// import { RsaPublicKey } from "./rsapublickey";

// export async function generateRandomKeys (bitlength: number = 3072, simpleVariant: boolean = false): Promise<KeyPair> {
//     let p, q, n, g, lambda, mu
//     // if p and q are bitLength/2 long ->  2**(bitLength - 2) <= n < 2**(bitLength)
//     do {
//       p = await bcu.prime(Math.floor(bitlength / 2) + 1)
//       q = await bcu.prime(Math.floor(bitlength / 2))
//       n = p * q
//     } while (q === p || bcu.bitLength(n) !== bitlength)
// }

//blind message          
export async function blinding (m: bigint){

    //we choose predefined prime - public exponent
    //65537=2**16+1
    const e = 65537n;
    const bitlength: number = 3072;

    //we prove with 5 & 7- this part very problematic!!
    //these numbers have to be a random numbers
    // let n: bigint =5n;
    // let r: bigint =7n;
    let r, n, extraN, extraPhi;

    do 
    {
        r = await bcu.prime(bitlength / 2 + 1);
        n = await bcu.prime(bitlength / 2);
        extraN = r * n;
        extraPhi = (r - 1n) * (n - 1n);
    } 
    while (bcu.bitLength(extraN) !== bitlength || (extraPhi % e === 0n));


    //do the great common divisor
    const coprimes: bigint= bcu.gcd(r,n);

    //we check if two numbers are coprimes
    if(coprimes!==1n){
        console.log("error");
    } else {
        console.log("working");
    }

    //we extract the product (m * r**e) * mod n
    const eNum = Number(e);
    const rNum = Number(r);
    const rPowToE: number = Math.pow(rNum,eNum);
    const rPowToEBig: bigint = BigInt(rPowToE);
    const finalResult: bigint= m*rPowToEBig; 

    //we need check e & n
    return bcu.modPow(finalResult,e,n);
}

export async function unblinding (m: bigint){

    //we choose predefined prime - public exponent
    //65537=2**16+1
    const e = 65537n;
    const bitlength: number = 3072;

    //we prove with 5 & 7- this part very problematic!!
    //these numbers have to be a random numbers
    // let n: bigint =5n;
    // let r: bigint =7n;
    let r, n, extraN, extraPhi;

    do 
    {
        r = await bcu.prime(bitlength / 2 + 1);
        n = await bcu.prime(bitlength / 2);
        extraN = r * n;
        extraPhi = (r - 1n) * (n - 1n);
    } 
    while (bcu.bitLength(extraN) !== bitlength || (extraPhi % e === 0n));


    //do the great common divisor
    const coprimes: bigint= bcu.gcd(r,n);

    //we check if two numbers are coprimes
    if(coprimes!==1n){
        console.log("error");
    } else {
        console.log("working");
    }

    //we extract the product mxr**e
    const eNum = Number(e);
    const rNum = Number(r);
    const rPowToE: number = Math.pow(rNum,eNum);
    const rPowToEBig: bigint = BigInt(rPowToE);
    const finalResult: bigint= m*rPowToEBig; 

    //we need check e & n
    return bcu.modPow(finalResult,e,n);
}

export async function generateKeys (bitlength: number = 3072){

    //be careful with this BiggestInt because the version of the tsconfig.json changes
    const e = 65537n;
    let p, q, n, phi;
    do 
    {
        p = await bcu.prime(bitlength / 2 + 1);
        q = await bcu.prime(bitlength / 2);
        n = p * q;
        phi = (p - 1n) * (q - 1n);
    } 
    while (bcu.bitLength(n) !== bitlength || (phi % e === 0n));
    const publicKey = new RsaPublicKey(e, n);
    const d = bcu.modInv(e, phi);
    const privateKey = new RsaPrivateKey(d, n);
    return { publicKey, privateKey} ;
}

//basic silly encrypt function - Not use!
export const encrypt = function (exemple: string){
    const reverse = exemple.split('').reverse().join('');
    return 'encrypted' + reverse;
}

//basic silly decrypt function - Not use!
export const decrypt = (exemple: string) => {
    const script = exemple.substring(10);
    return script.split('').reverse().join('');
}