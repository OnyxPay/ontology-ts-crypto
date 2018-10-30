/*
 * Copyright (C) 2018 The ontology Authors
 * This file is part of The ontology library.
 *
 * The ontology is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * The ontology is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with The ontology.  If not, see <http://www.gnu.org/licenses/>.
 */

import { toSeedHex, validateMnemonic } from 'bip39-lite';
import { randomBytes } from 'crypto';
import { HDKey } from 'hdkey-secp256r1';
import { Address } from '../crypto/address';
import { KeyParameters } from '../crypto/key';
import { KeyType } from '../crypto/keyType';
import { PrivateKey } from '../crypto/privateKey';
import { PublicKey } from '../crypto/publicKey';
import { decryptWithGcm, DEFAULT_SCRYPT, encryptWithGcm, ScryptOptionsEx } from './scrypt';

// tslint:disable:quotemark
// tslint:disable:object-literal-key-quotes

export const ONT_BIP44_PATH = "m/44'/1024'/0'/0/0";

export class Account {
  /**
   * Import account
   * @param label Account's label
   * @param encryptedKey Encrypted private key
   * @param password User's password to decrypt private key
   * @param address Account's address
   * @param saltBase64 Salt to decrypt
   * @param params Params used to decrypt
   */
  static import(
    label: string,
    privateKey: PrivateKey,
    password: string,
    address: Address,
    salt: Buffer = randomBytes(16),
    scrypt: ScryptOptionsEx = DEFAULT_SCRYPT
  ): Account {
    const account = new Account();

    if (!label) {
      label = randomBytes(4).toString('hex');
    }
    account.label = label;
    account.lock = false;
    account.isDefault = false;
    account.salt = salt.toString('base64');
    account.scrypt = scrypt;

    account.encryptedKey = encryptWithGcm(privateKey.key, address.toBase58(), salt, password, scrypt);
    account.publicKey = privateKey.getPublicKey();

    account.address = Address.fromPubKey(account.publicKey);

    if (!account.address.equals(address)) {
      throw new Error('Computed address does not match the provided address.');
    }

    return account;
  }

  /**
   * Import account with mnemonic
   * @param label Account's label
   * @param mnemonic User's mnemonic
   * @param password user's password to encrypt the private key
   * @param params Params used to encrypt the private key.
   */
  static importMnemonic(
    label: string,
    mnemonic: string,
    password: string,
    scrypt: ScryptOptionsEx = DEFAULT_SCRYPT
  ): Account {
    mnemonic = mnemonic.trim();
    if (!validateMnemonic(mnemonic)) {
      throw new Error('Invalid mnemonics');
    }
    const seed = toSeedHex(mnemonic);
    const hdkey = HDKey.fromMasterSeed(Buffer.from(seed, 'hex'));
    const pri = hdkey.derive(ONT_BIP44_PATH);
    const key = Buffer.from(pri.privateKey!).toString('hex');
    const privateKey = new PrivateKey(key);
    const account = Account.create(label, privateKey, password, scrypt);
    return account;
  }

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
  static create(
    label: string,
    privateKey: PrivateKey,
    password: string,
    scrypt: ScryptOptionsEx = DEFAULT_SCRYPT
  ): Account {
    const account = new Account();
    const salt = randomBytes(16);
    const publicKey = privateKey.getPublicKey();
    const address = Address.fromPubKey(publicKey);

    account.label = label;
    account.lock = false;
    account.isDefault = false;
    account.publicKey = publicKey;
    account.address = address;
    account.encryptedKey = encryptWithGcm(privateKey.key, address.toBase58(), salt, password, scrypt);
    account.salt = salt.toString('base64');
    account.scrypt = scrypt;

    return account;
  }

  /**
   * Deserializes JSON object.
   *
   * Object should be real object, not stringified.
   *
   * @param obj JSON object or string
   */
  static deserializeJson(obj: any, scrypt: ScryptOptionsEx = DEFAULT_SCRYPT): Account {
    if (typeof obj === 'string') {
      obj = JSON.parse(obj);
    }

    const pk = new PublicKey(
      new Buffer(obj.publicKey, 'hex'),
      KeyType.fromLabel(obj.algorithm),
      KeyParameters.deserializeJson(obj.parameters)
    );

    const account = new Account();
    account.address = Address.fromBase58(obj.address);
    account.label = obj.label;
    account.lock = obj.lock;
    account.isDefault = obj.isDefault;
    account.publicKey = pk;
    account.hash = obj.hash;
    account.salt = obj.salt;
    account.encryptedKey = obj.key;
    account.extra = obj.extra;
    account.scrypt = scrypt;
    return account;
  }

  address: Address;
  label: string;
  lock: boolean;
  encryptedKey: string;
  extra: null;

  // to be compatible with cli wallet
  'enc-alg': string = 'aes-256-gcm';
  hash: string = 'sha256';
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
  serializeJson(stringify: boolean = false): any {
    const obj = {
      address: this.address.toBase58(),
      label: this.label,
      lock: this.lock,
      key: this.encryptedKey,
      'enc-alg': this['enc-alg'],
      hash: this.hash,
      salt: this.salt,
      isDefault: this.isDefault,
      publicKey: this.publicKey.serialize().toString('hex'),
      algorithm: this.publicKey.algorithm.label,
      parameters: this.publicKey.parameters.serializeJson()
    };

    if (stringify) {
      return JSON.stringify(obj);
    } else {
      return obj;
    }
  }

  decryptKey(password: string): PrivateKey | Promise<PrivateKey> {
    const salt = Buffer.from(this.salt, 'base64');
    const sk = decryptWithGcm(this.encryptedKey, this.address.toBase58(), salt, password, this.scrypt);
    return new PrivateKey(sk, this.publicKey.algorithm, this.publicKey.parameters);
  }
}
