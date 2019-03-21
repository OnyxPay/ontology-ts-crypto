/// <reference types="node" />
import { Address } from '../crypto/address';
import { PrivateKey } from '../crypto/privateKey';
import { PublicKey } from '../crypto/publicKey';
import { ScryptOptionsEx } from './scrypt';
export declare const ONT_BIP44_PATH = "m/44'/1024'/0'/0/0";
export declare class Account {
    /**
     * Import account
     * @param label Account's label
     * @param encryptedKey Encrypted private key
     * @param password User's password to decrypt private key
     * @param address Account's address
     * @param saltBase64 Salt to decrypt
     * @param params Params used to decrypt
     */
    static import(label: string, privateKey: PrivateKey, password: string, salt?: Buffer, scrypt?: ScryptOptionsEx): Account;
    /**
     * Import account with mnemonic
     * @param label Account's label
     * @param mnemonic User's mnemonic
     * @param password user's password to encrypt the private key
     * @param params Params used to encrypt the private key.
     */
    static importMnemonic(label: string, mnemonic: string, password: string, scrypt?: ScryptOptionsEx): Account;
    /**
     * Creates Account object encrypting specified private key.
     *
     * The account does not need to be registered on blockchain.
     *
     * @param privateKey Private key associated with the account
     * @param password Password use to encrypt the private key
     * @param label Custom label
     * @param params Optional scrypt params
     */
    static create(label: string, privateKey: PrivateKey, password: string, scrypt?: ScryptOptionsEx): Account;
    /**
     * Deserializes JSON object.
     *
     * Object should be real object, not stringified.
     *
     * @param obj JSON object or string
     */
    static deserializeJson(obj: any, scrypt?: ScryptOptionsEx): Account;
    address: Address;
    label: string;
    lock: boolean;
    encryptedKey: string;
    extra: null;
    'enc-alg': string;
    hash: string;
    salt: string;
    publicKey: PublicKey;
    isDefault: boolean;
    scrypt: ScryptOptionsEx;
    /**
     * Serializes to JSON object.
     *
     * Returned object will not be stringified.
     *
     */
    serializeJson(stringify?: boolean): any;
    decryptKey(password: string): PrivateKey | Promise<PrivateKey>;
}
