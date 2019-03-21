/// <reference types="node" />
import * as Long from 'long';
export declare class Writer {
    private writer;
    constructor();
    getBytes(): Buffer;
    writeVarUint(value: Long | number): void;
    writeVarBytes(value: Buffer): void;
    writeString(value: string): void;
    writeBytes(value: Buffer): void;
    writeUint8(val: number): void;
    writeUint16(val: number): void;
    writeUint32(val: number): void;
    writeUint64(val: Long): void;
}
/**
 * TODO: might implement
 */
export declare class LimitedWriter extends Writer {
    limit: number;
    constructor(limit: number);
}
