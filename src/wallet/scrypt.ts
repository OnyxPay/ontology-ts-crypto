import { createCipheriv, createDecipheriv, ScryptOptions, scryptSync } from 'crypto';

export const DEFAULT_SCRYPT: ScryptOptions = {
  N: 4096,
  r: 8,
  p: 8
};

export const DEFAULT_SCRYPT_KEYLENGTH = 64;

export function decryptWithGcm(
  encrypted: string,
  address: string,
  salt: Buffer,
  keyphrase: string,
  keyLength: number,
  scryptParams: ScryptOptions
) {
  const result = Buffer.from(encrypted, 'base64');
  const ciphertext = result.slice(0, result.length - 16);
  const authTag = result.slice(result.length - 16);
  const derived = scryptSync(keyphrase.normalize('NFC'), salt, keyLength, scryptParams);
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
  keyLength: number,
  scryptParams: ScryptOptions
) {
  const derived = scryptSync(keyphrase.normalize('NFC'), salt, keyLength, scryptParams);
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
