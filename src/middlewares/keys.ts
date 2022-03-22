// import * as bcu from 'bigint-crypto-utils';
const bcu = require('bigint-crypto-utils');
const RsaPrivateKey = require('./rsaprivatekey');
const RsaPublicKey = require('./rsaprivatekey');
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
    const privKey = new RsaPrivateKey(d, n);
    return 
    {
    };
}

//another unused functions
export const encrypt = function (exemple: string){
    const reverse = exemple.split('').reverse().join('');
    return 'encrypted' + reverse;
}

//another const
export const decrypt = (exemple: string) => {
    const script = exemple.substring(10);
    return script.split('').reverse().join('');
}