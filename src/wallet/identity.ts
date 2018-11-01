import { randomBytes } from 'crypto';
import { Address } from '../crypto/address';
import { KeyParameters } from '../crypto/key';
import { KeyType } from '../crypto/keyType';
import { PrivateKey } from '../crypto/privateKey';
import { PublicKey } from '../crypto/publicKey';
import { decryptWithGcm, DEFAULT_SCRYPT, encryptWithGcm, ScryptOptionsEx } from './scrypt';

// tslint:disable:quotemark
// tslint:disable:object-literal-key-quotes

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

export class Identity {
  /**
   * Import identity
   * @param label Name of identity
   * @param encryptedPrivateKey Encrypted private key
   * @param password User's password to decrypt
   * @param address Address to decrypt
   * @param saltBase64 Salt to decrypt
   * @param params Optional params to decrypt
   */
  static importIdentity(
    label: string,
    privateKey: PrivateKey,
    password: string,
    salt: Buffer = randomBytes(16),
    scrypt: ScryptOptionsEx = DEFAULT_SCRYPT
  ) {
    const identity = new Identity();

    if (!label) {
      label = randomBytes(4).toString('hex');
    }

    // ontid
    const publicKey = privateKey.getPublicKey();
    const address = Address.fromPubKey(publicKey);

    const controlData = {
      id: '1', // start from 1
      encryptedKey: encryptWithGcm(privateKey.key, address.toBase58(), salt, password, scrypt),
      address,
      salt: salt.toString('base64'),
      hash: 'sha256',
      publicKey,
      scrypt
    };

    identity.label = label;
    identity.lock = false;
    identity.isDefault = false;
    identity.ontid = Address.fromPubKey(publicKey).toOntId();
    identity.controls = [controlData];
    identity.scrypt = scrypt;

    return identity;
  }

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
  static create(label: string, privateKey: PrivateKey, password: string, scrypt: ScryptOptionsEx = DEFAULT_SCRYPT) {
    const identity = new Identity();

    // ontid
    const salt = randomBytes(16);
    const publicKey = privateKey.getPublicKey();
    const address = Address.fromPubKey(publicKey);

    const controlData = {
      id: '1', // start from 1
      encryptedKey: encryptWithGcm(privateKey.key, address.toBase58(), salt, password, scrypt),
      address,
      salt: salt.toString('base64'),
      hash: 'sha256',
      publicKey
    };

    identity.label = label;
    identity.lock = false;
    identity.isDefault = false;
    identity.ontid = Address.fromPubKey(publicKey).toOntId();
    identity.controls = [controlData];
    identity.scrypt = scrypt;

    return identity;
  }

  static deserializeControlsJson(obj: any[]): ControlData[] {
    return obj.map((control) => {
      const pk = new PublicKey(
        new Buffer(control.publicKey, 'hex'),
        KeyType.fromLabel(control.algorithm),
        KeyParameters.deserializeJson(control.parameters)
      );

      return {
        id: control.id,
        encryptedKey: control.key,
        address: Address.fromBase58(control.address),
        salt: control.salt,
        hash: control.hash,
        publicKey: pk
      };
    });
  }

  /**
   * Deserializes JSON object.
   *
   * Object should be real object, not stringified.
   *
   * @param obj JSON object or string
   */
  static deserializeJson(obj: any, scrypt: ScryptOptionsEx = DEFAULT_SCRYPT) {
    if (typeof obj === 'string') {
      obj = JSON.parse(obj);
    }

    const identity = new Identity();
    identity.label = obj.label;
    identity.lock = obj.lock;
    identity.isDefault = obj.isDefault;
    identity.extra = obj.extra;
    identity.controls = Identity.deserializeControlsJson(obj.controls);
    identity.scrypt = scrypt;
    return identity;
  }

  ontid: string;
  label: string;
  lock: boolean;
  isDefault: boolean;
  controls: ControlData[] = [];
  extra: null;
  scrypt: ScryptOptionsEx;

  serializeControlsJson(stringify: boolean = false): any {
    const obj = this.controls.map((control) => ({
      key: control.encryptedKey,
      id: control.id,
      address: control.address.toBase58(),
      salt: control.salt,
      'enc-alg': (control as any)['enc-alg'],
      hash: control.hash,
      publicKey: control.publicKey.serialize().toString('hex'),
      algorithm: control.publicKey.algorithm.label,
      parameters: control.publicKey.parameters.serializeJson()
    }));

    if (stringify) {
      return JSON.stringify(obj);
    } else {
      return obj;
    }
  }

  /**
   * Serializes to JSON object.
   *
   * Returned object will not be stringified.
   *
   */
  serializeJson(stringify: boolean = false): any {
    const obj = {
      ontid: this.ontid,
      label: this.label,
      lock: this.lock,
      isDefault: this.isDefault,
      extra: this.extra,
      controls: this.serializeControlsJson(false)
    };

    if (stringify) {
      return JSON.stringify(obj);
    } else {
      return obj;
    }
  }

  decryptKey(id: string, password: string): PrivateKey | Promise<PrivateKey> {
    const control = this.controls.find((c) => c.id === id);
    if (control === undefined) {
      throw new Error('ControlData not found.');
    }

    const salt = Buffer.from(control.salt, 'base64');
    const sk = decryptWithGcm(control.encryptedKey, control.address.toBase58(), salt, password, this.scrypt);
    return new PrivateKey(sk, control.publicKey.algorithm, control.publicKey.parameters);
  }
}
