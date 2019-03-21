/// <reference types="node" />
import { Key, KeyParameters } from './key';
import { KeyType } from './keyType';
import { PublicKey } from './publicKey';
import { Signable } from './signable';
import { Signature } from './signature';
import { SignatureScheme } from './signatureScheme';
export declare class PrivateKey extends Key {
    /**
     * Generates random Private key using supplied Key type and parameters.
     *
     * If no Key type or parameters is supplied, default SDK key type with default parameters will be used.
     *
     * @param keyType The key type
     * @param parameters The parameters for the key type
     */
    static random(keyType?: KeyType, parameters?: KeyParameters): PrivateKey;
    static deserialize(b: Buffer): PrivateKey;
    /**
     * Derives Public key out of Private key.
     */
    getPublicKey(): PublicKey;
    /**
     * Signs the data with supplied private key using signature schema.
     *
     * If the signature schema is not provided, the default schema for this key type is used.
     *
     * This method is not suitable, if external keys (Ledger, TPM, ...) support is required.
     *
     * @param msg Hex encoded input data or Signable object
     * @param schema Signing schema to use
     * @param publicKeyId Id of public key
     */
    sign(msg: Buffer | Signable, schema?: SignatureScheme): Promise<Signature>;
    /**
     * Computes signature of message hash using specified signature schema.
     *
     * @param hash Message hash
     * @param schema Signature schema to use
     */
    private computeSignature;
    /**
     * Computes EcDSA signature of message hash. Curve name is derrived from private key.
     *
     * @param hash Message hash
     */
    private computeEcDSASignature;
    /**
     * Computes EdDSA signature of message hash. Curve name is derrived from private key.
     *
     * @param hash Message hash
     */
    private computeEdDSASignature;
    /**
     * Derives Public key out of Private key using EcDSA algorithm.
     */
    private getEcDSAPublicKey;
    /**
     * Derives Public key out of Private key using EdDSA algorithm.
     */
    private getEdDSAPublicKey;
}
