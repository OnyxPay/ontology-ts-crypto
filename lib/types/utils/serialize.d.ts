/// <reference types="node" />
import * as bigInt from 'big-integer';
export declare function bigIntToBytes(data: bigInt.BigInteger): Buffer;
export declare function bigIntFromBytes(ba: Buffer): bigInt.BigInteger;
