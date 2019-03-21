/// <reference types="node" />
import { PublicKey } from '../crypto/publicKey';
import { Writer } from '../utils/writer';
export declare class Address {
    static deserialize(b: Buffer): Address;
    static fromVmCode(code: Buffer): Address;
    static fromPubKey(key: PublicKey): Address;
    static fromBase58(encoded: string): Address;
    private value;
    constructor(value?: Buffer | string);
    equals(other: Address): boolean;
    serialize(w: Writer): void;
    toArray(): Buffer;
    toBase58(): string;
    toOntId(): string;
}
