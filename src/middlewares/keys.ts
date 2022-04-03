import * as bcu from 'bigint-crypto-utils';
import { RsaPrivateKey } from './rsaprivatekey';
import { RsaPublicKey } from './rsapublickey';

//define this variables because we cannot use top imports
let myRsaPublicKey: RsaPublicKey;
let myRsaPrivateKey: RsaPrivateKey;

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
    let coprimes;
    // k=myRsaPrivateKey.k
    // let k;
    do 
    {
        //mask coef - random number between 0 and n
        myRsaPrivateKey.k = bcu.randBetween(myRsaPublicKey.n,0n);
        //do the great common divisor
        coprimes= bcu.gcd(myRsaPrivateKey.k, myRsaPublicKey.n);
    } 
    while (coprimes!==1n);

    //we extract the product (m · k^e)
    const kPow: bigint=myRsaPrivateKey.k**myRsaPublicKey.e;
    const finalResult: bigint= m*kPow;

    //other params: pow=1 & Bob's n 
    return bcu.modPow(finalResult,1n,myRsaPublicKey.n);
}

export async function unblinding (m: bigint){
    // k=myRsaPrivateKey.k
    // let k=60n;

    //we calculate modular inverse for r·mod(n)
    const rInv:bigint= bcu.modInv(myRsaPrivateKey.k, myRsaPublicKey.n);

    //we extract the product (s' · r^-1)
    const finalResult: bigint= m*rInv; 

    //other params: pow=1 & Bob's n 
    return bcu.modPow(finalResult,1n,myRsaPublicKey.n);
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