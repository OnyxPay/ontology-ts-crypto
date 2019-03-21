/// <reference types="node" />
import * as Long from 'long';
import { PublicKey } from '../crypto/publicKey';
import { Writer } from '../utils/writer';
import * as O from './opCode';
export declare class ProgramBuilder {
    w: Writer;
    constructor();
    pushPubKey(key: PublicKey): void;
    writeOpCode(opCode: O.OpCode): void;
    writeByte(val: number): void;
    writeBytes(b: Buffer): void;
    writeVarUInt(val: Long): void;
    pushBytes(data: Buffer): void;
    pushNum(num: number | Long): void;
    pushBool(param: boolean): void;
    getProgram(): Buffer;
}
export declare function programFromPubKey(key: PublicKey): Buffer;
export declare function programFromMultiPubKeys(m: number, keys: PublicKey[]): Buffer;
export declare function programFromParams(sigs: Buffer[]): Buffer;
