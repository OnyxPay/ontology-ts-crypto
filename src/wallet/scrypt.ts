import { createCipheriv, createDecipheriv, ScryptOptions } from 'crypto';
import * as asyncScrypt from 'scrypt-async';

export interface ScryptOptionsEx extends ScryptOptions {
  keyLength: number;
}

export const DEFAULT_SCRYPT: ScryptOptionsEx = {
  N: 4096,
  r: 8,
  p: 8,
  keyLength: 64
};

export const DEFAULT_SCRYPT_KEYLENGTH = 64;

export function decryptWithGcm(
  encrypted: string,
  address: string,
  salt: Buffer,
  keyphrase: string,
  scryptParams: ScryptOptionsEx
) {
  const { keyLength, ...scryptOptions } = scryptParams;

  const result = Buffer.from(encrypted, 'base64');
  const ciphertext = result.slice(0, result.length - 16);
  const authTag = result.slice(result.length - 16);
  const derived = scryptSync(keyphrase.normalize('NFC'), salt, keyLength, scryptOptions);
  const derived1 = derived.slice(0, 12);
  const derived2 = derived.slice(32);
  const key = derived2;
  const iv = derived1;
  const aad = new Buffer(address);

  const decipher = createDecipheriv('aes-256-gcm', key, iv);
  decipher.setAAD(aad);
  decipher.setAuthTag(authTag);
  let decrypted = decipher.update(ciphertext).toString('hex');

  try {
    decrypted += decipher.final().toString('hex');
  } catch (err) {
    throw new Error('Password incorrect');
  }
  return decrypted;
}

/**
 * Encrypt with aes-gcm-256
 * This is the default encryption algorithm for private key
 * @param privateKey Private key to encpryt with
 * @param address Adderss to encrypt with
 * @param salt Salt to encrypt with
 * @param keyphrase User's password
 * @param scryptParams Optional params to encrypt
 */
export function encryptWithGcm(
  privateKey: Buffer,
  address: string,
  salt: Buffer,
  keyphrase: string,
  scryptParams: ScryptOptionsEx
) {
  const { keyLength, ...scryptOptions } = scryptParams;

  const derived = scryptSync(keyphrase.normalize('NFC'), salt, keyLength, scryptOptions);
  const derived1 = derived.slice(0, 12);
  const derived2 = derived.slice(32);
  const key = derived2;
  const iv = derived1;
  const aad = new Buffer(address);
  const cipher = createCipheriv('aes-256-gcm', key, iv);
  cipher.setAAD(aad);
  let ciphertext = cipher.update(privateKey);
  // ciphertext += cipher.final();
  const final = cipher.final();
  const authTag = cipher.getAuthTag();
  ciphertext = Buffer.concat([ciphertext, final]);

  const result = Buffer.concat([ciphertext, authTag]);
  return result.toString('base64');
}

/**
 * Synchronious call to scrypt-async-js.
 *
 * @param keyphrase Keyphrase to use
 * @param addressHash Hex encoded address
 * @param params Scrypt params
 */
function scryptSync(keyphrase: string, salt: Buffer, keyLength: number, params: ScryptOptions) {
  let derived: number[] = [];

  const s = Array.from(salt.subarray(0));
  asyncScrypt(
    keyphrase.normalize('NFC'),
    s,
    {
      N: params.N,
      r: params.r!,
      p: params.p!,
      dkLen: keyLength
    },
    (result: string | number[]) => {
      derived = result as number[];
    }
  );
  return new Buffer(derived);
}
