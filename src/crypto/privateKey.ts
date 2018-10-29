import { randomBytes } from 'crypto';
import * as elliptic from 'elliptic';
import { Reader } from '../utils/reader';
import { CurveLabel } from './curveLabel';
import { Key, KeyParameters } from './key';
import { KeyType } from './keyType';
import { PublicKey } from './publicKey';
import { Signable } from './signable';
import { Signature } from './signature';
import { SignatureScheme } from './signatureScheme';

export class PrivateKey extends Key {
  /**
   * Generates random Private key using supplied Key type and parameters.
   *
   * If no Key type or parameters is supplied, default SDK key type with default parameters will be used.
   *
   * @param keyType The key type
   * @param parameters The parameters for the key type
   */
  static random(keyType?: KeyType, parameters?: KeyParameters): PrivateKey {
    if (keyType === undefined) {
      keyType = KeyType.ECDSA;
    }

    if (parameters === undefined) {
      parameters = new KeyParameters(CurveLabel.SECP256R1);
    }

    return new PrivateKey(randomBytes(32), keyType, parameters);
  }
  static deserialize(b: Buffer): PrivateKey {
    const r = new Reader(b);

    if (b.length === 32) {
      // ECDSA
      const algorithm = KeyType.ECDSA;
      const curve = CurveLabel.SECP256R1;
      const sk = r.readBytes(32);
      return new PrivateKey(sk, algorithm, new KeyParameters(curve));
    } else {
      const algorithmHex = r.readByte();
      const curveHex = r.readByte();
      const sk = r.readBytes(32);

      return new PrivateKey(sk, KeyType.fromHex(algorithmHex), new KeyParameters(CurveLabel.fromHex(curveHex)));
    }
  }

  /**
   * Derives Public key out of Private key.
   */
  getPublicKey(): PublicKey {
    switch (this.algorithm) {
      case KeyType.ECDSA:
        return this.getEcDSAPublicKey();
      case KeyType.EDDSA:
        return this.getEdDSAPublicKey();
      default:
        throw new Error('Unsupported signature schema.');
    }
  }

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
  async sign(msg: Buffer | Signable, schema?: SignatureScheme): Promise<Signature> {
    if (schema === undefined) {
      schema = this.algorithm.defaultSchema;
    }

    if (!this.isSchemaSupported(schema)) {
      throw new Error('Signature schema does not match key type.');
    }

    // retrieves content to sign if not provided directly
    if (!(msg instanceof Buffer)) {
      msg = msg.getSignContent();
    }

    const hash = this.computeHash(msg, schema);

    const signed = this.computeSignature(hash, schema);
    return new Signature(schema, signed);
  }

  /**
   * Computes signature of message hash using specified signature schema.
   *
   * @param hash Message hash
   * @param schema Signature schema to use
   */
  private computeSignature(hash: Buffer, schema: SignatureScheme): Buffer {
    switch (schema) {
      case SignatureScheme.ECDSAwithSHA224:
      case SignatureScheme.ECDSAwithSHA256:
      case SignatureScheme.ECDSAwithSHA384:
      case SignatureScheme.ECDSAwithSHA512:
      case SignatureScheme.ECDSAwithSHA3_224:
      case SignatureScheme.ECDSAwithSHA3_256:
      case SignatureScheme.ECDSAwithSHA3_384:
      case SignatureScheme.ECDSAwithSHA3_512:
      case SignatureScheme.ECDSAwithRIPEMD160:
        return this.computeEcDSASignature(hash);
      case SignatureScheme.EDDSAwithSHA512:
        return this.computeEdDSASignature(hash);
      default:
        throw new Error('Unsupported signature schema.');
    }
  }

  /**
   * Computes EcDSA signature of message hash. Curve name is derrived from private key.
   *
   * @param hash Message hash
   */
  private computeEcDSASignature(hash: Buffer): Buffer {
    const ec = new elliptic.ec(this.parameters.curve.preset);
    const signed = ec.sign(hash, this.key, { canonical: true, pers: undefined });
    return Buffer.concat([signed.r.toArrayLike(Buffer, 'be', 32), signed.s.toArrayLike(Buffer, 'be', 32)]);
  }

  /**
   * Computes EdDSA signature of message hash. Curve name is derrived from private key.
   *
   * @param hash Message hash
   */
  private computeEdDSASignature(hash: Buffer): Buffer {
    const eddsa = new elliptic.eddsa(this.parameters.curve.preset);
    const signed = eddsa.sign(hash, this.key, null);
    return Buffer.concat([signed.R.toArrayLike(Buffer, 'be', 32), signed.S.toArrayLike(Buffer, 'be', 32)]);
  }

  /**
   * Derives Public key out of Private key using EcDSA algorithm.
   */
  private getEcDSAPublicKey(): PublicKey {
    const ec = new elliptic.ec(this.parameters.curve.preset);
    const keyPair = ec.keyFromPrivate(this.key, 'hex');
    const pk = keyPair.getPublic(true, 'hex');

    return new PublicKey(pk, this.algorithm, this.parameters);
  }

  /**
   * Derives Public key out of Private key using EdDSA algorithm.
   */
  private getEdDSAPublicKey(): PublicKey {
    const eddsa = new elliptic.eddsa(this.parameters.curve.preset);
    const keyPair = eddsa.keyFromSecret(this.key, 'hex');
    const pk = keyPair.getPublic(true, 'hex');

    return new PublicKey(pk, this.algorithm, this.parameters);
  }
}
