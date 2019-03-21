/// <reference types="node" />
import { Address } from '../crypto/address';
import { PrivateKey } from '../crypto/privateKey';
import { PublicKey } from '../crypto/publicKey';
import { ScryptOptionsEx } from './scrypt';
export interface ControlData {
    /**
     * Id of control data
     */
    id: string;
    /**
     * Encrypted private key
     */
    encryptedKey: string;
    /**
     * Address of control data
     */
    address: Address;
    'enc-alg': string;
    /**
     * Salt of control data
     */
    salt: string;
    /**
     * hash type
     */
    hash: string;
    /**
     * The public key
     */
    publicKey: PublicKey;
}
export declare class Identity {
    /**
     * Import identity
     * @param label Name of identity
     * @param encryptedPrivateKey Encrypted private key
     * @param password User's password to decrypt
     * @param address Address to decrypt
     * @param saltBase64 Salt to decrypt
     * @param params Optional params to decrypt
     */
    static importIdentity(label: string, privateKey: PrivateKey, password: string, salt?: Buffer, scrypt?: ScryptOptionsEx): Identity;
    /**
     * Creates Identity object encrypting specified private key.
     *
     * The identity is not registered on the blockchain. Caller needs to register it.
     *
     * @param label Custom label
     * @param privateKey Private key associated with the identity
     * @param password Password use to encrypt the private key
     * @param scrypt Optional scrypt params
     */
    static create(label: string, privateKey: PrivateKey, password: string, scrypt?: ScryptOptionsEx): Identity;
    static deserializeControlsJson(obj: any[]): ControlData[];
    /**
     * Deserializes JSON object.
     *
     * Object should be real object, not stringified.
     *
     * @param obj JSON object or string
     */
    static deserializeJson(obj: any, scrypt?: ScryptOptionsEx): Identity;
    ontid: string;
    label: string;
    lock: boolean;
    isDefault: boolean;
    controls: ControlData[];
    extra: null;
    scrypt: ScryptOptionsEx;
    serializeControlsJson(stringify?: boolean): any;
    /**
     * Serializes to JSON object.
     *
     * Returned object will not be stringified.
     *
     */
    serializeJson(stringify?: boolean): any;
    decryptKey(id: string, password: string): PrivateKey | Promise<PrivateKey>;
}
