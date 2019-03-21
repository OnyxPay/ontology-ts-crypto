/// <reference types="node" />
interface ScryptOptions {
    N?: number;
    r?: number;
    p?: number;
    maxmem?: number;
}
export interface ScryptOptionsEx extends ScryptOptions {
    keyLength: number;
}
export declare const DEFAULT_SCRYPT: ScryptOptionsEx;
export declare const DEFAULT_SCRYPT_KEYLENGTH = 64;
export declare function decryptWithGcm(encrypted: string, address: string, salt: Buffer, keyphrase: string, scryptParams: ScryptOptionsEx): string;
/**
 * Encrypt with aes-gcm-256
 * This is the default encryption algorithm for private key
 * @param privateKey Private key to encpryt with
 * @param address Adderss to encrypt with
 * @param salt Salt to encrypt with
 * @param keyphrase User's password
 * @param scryptParams Optional params to encrypt
 */
export declare function encryptWithGcm(privateKey: Buffer, address: string, salt: Buffer, keyphrase: string, scryptParams: ScryptOptionsEx): string;
