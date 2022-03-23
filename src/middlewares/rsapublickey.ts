import * as bcu from 'bigint-crypto-utils';
// const bcu = require('bigint-crypto-utils');

//modelo Aliado = Enemigo
class RsaPublicKey {

    //variables
    e: bigint;
    n: bigint;
    n2: bigint;

    //constuctor
    constructor(e: bigint, n: bigint){
        this.e=e;
        this.n=n;
        this.n2=this.n**2n;
    }

    encrypt(m: bigint){
        return bcu.modPow(m, this.e, this.n);
    }

    verify(s: bigint){
        return bcu.modPow(s, this.e, this.n);
    }
}

//now, we export the class
export { RsaPublicKey } ;