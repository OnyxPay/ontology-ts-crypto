/// <reference types="node" />
import * as ByteBuffer from 'bytebuffer';
import * as Long from 'long';
export declare type Whence = 'start' | 'relative';
export declare class Reader {
    reader: ByteBuffer;
    constructor(b: Buffer);
    readByte(): number;
    readBytes(count: number): Buffer;
    readUInt16(): number;
    readUInt32(): number;
    readUInt64(): Long;
    readInt16(): number;
    readInt32(): number;
    readInt64(): Long;
    position(): number;
    length(): number;
    seek(offset: number, whence: Whence): number;
    readVarBytes(max?: number): Buffer;
    readVarInt(max?: Long): Long;
    readVarUInt(max?: Long): Long;
    readVarString(maxlen?: number): string;
}
