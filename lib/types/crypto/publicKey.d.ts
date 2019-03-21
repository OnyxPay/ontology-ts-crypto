/// <reference types="node" />
import { Key } from './key';
import { Signable } from './signable';
import { Signature } from './signature';
import { SignatureScheme } from './signatureScheme';
export declare class PublicKey extends Key {
    /**
     * Deserializes PublicKey
     *
     * @param b Buffer
     *
     */
    static deserialize(b: Buffer): PublicKey;
    static compare(a: PublicKey, b: PublicKey): number;
    serialize(): Buffer;
    /**
     * Verifies if the signature was created with private key corresponding to supplied public key
     * and was not tampered with using signature schema.
     *
     * @param msg Buffer input data or Signable object
     * @param signature Signature object
     */
    verify(msg: Buffer | Signable, signature: Signature): Promise<boolean>;
    /**
     * For internal use.
     * @param hash Message hash
     * @param signature Hex encoded signature
     * @param schema Signature scheme to use
     */
    verifySignature(hash: Buffer, signature: Buffer, schema: SignatureScheme): boolean;
    /**
     * Verifies EcDSA signature of message hash. Curve name is derrived from private key.
     *
     * @param hash Message hash
     * @param signature Hex encoded signature
     */
    verifyEcDSASignature(hash: Buffer, signature: Buffer): boolean;
    /**
     * Verifies EdDSA signature of message hash. Curve name is derrived from private key.
     *
     * @param hash Message hash
     * @param signature Hex encoded signature
     */
    verifyEdDSASignature(hash: Buffer, signature: Buffer): boolean;
}
