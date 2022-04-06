import * as bcu from 'bigint-crypto-utils';
import { RsaPrivateKey } from './rsaprivatekey';
import { RsaPublicKey } from './rsapublickey';

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
export async function blinding (m: bigint, publicKey: RsaPublicKey): Promise<bigint> {
    let coprimes;
    // k=myRsaPrivateKey.k
    // let k;
    do 
    {
        //mask coef - random number between 0 and n
        publicKey.k = bcu.randBetween(publicKey.n,0n);
        //do the great common divisor
        coprimes= bcu.gcd(publicKey.k, publicKey.n);
    } 
    while (coprimes!==1n);

    //we extract the product (m · k^e)
    // const kPow: bigint=myRsaPrivateKey.k**publicKey.e % publicKey.n;
    // const finalResult: bigint= m*kPow % publicKey.n;
    const blindedMsg = publicKey.encrypt(publicKey.k) * m % publicKey.n;

    //other params: pow=1 & Bob's n 
    return blindedMsg;
}

export async function unblinding (m: bigint, publicKey: RsaPublicKey): Promise<bigint> {
    // k=myRsaPrivateKey.k
    // let k=60n;

    //we calculate modular inverse for r·mod(n)
    if (publicKey.k === undefined) {
        throw new Error("You have to blind before unblind");
    }
    const rInv:bigint= bcu.modInv(publicKey.k, publicKey.n);

    //we extract the product (s' · r^-1)
    const finalResult: bigint= m*rInv % publicKey.n; 

    //other params: pow=1 & Bob's n 
    // return bcu.modPow(finalResult,1n,publicKey.n);
    return finalResult;
}

export async function elgamal (m: bigint){}

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