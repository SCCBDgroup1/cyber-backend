// import * as bcu from 'bigint-crypto-utils';
const bcu = require('bigint-crypto-utils');

//RsaPrivateKey model
class RsaPrivateKey {

    //variables
    d: bigint;
    n: bigint;

    //constuctor
    constructor(d: bigint, n: bigint){
        this.d=d;
        this.n=n;
    }

    //functions
    decrypt(c: bigint){
        return bcu.modPow(c, this.d, this.n);
    }

    sign(m: bigint){
        return bcu.modPow(m, this.d, this.n);
    }
}

//now, we export the class
export { RsaPrivateKey } ;