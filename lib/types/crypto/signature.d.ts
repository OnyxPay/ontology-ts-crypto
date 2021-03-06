/// <reference types="node" />
import { SignatureScheme } from './signatureScheme';
/**
 * Signature generated by signing data with Private Key.
 */
export declare class Signature {
    /**
     * Deserializes Signature
     * @param data
     */
    static deserialize(data: Buffer): Signature;
    algorithm: SignatureScheme;
    value: Buffer;
    constructor(algorithm: SignatureScheme, value: Buffer);
    /**
     * Serializes signature to Hex representation.
     * For transfer to java backend and verify it.
     */
    serialize(): Buffer;
}
