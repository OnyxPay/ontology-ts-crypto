import * as elliptic from 'elliptic';
import { Reader } from '../utils/reader';
import { Writer } from '../utils/writer';
import { CurveLabel } from './curveLabel';
import { Key, KeyParameters } from './key';
import { KeyType } from './keyType';
import { Signable } from './signable';
import { Signature } from './signature';
import { SignatureScheme } from './signatureScheme';

export class PublicKey extends Key {
  /**
   * Deserializes PublicKey
   *
   * @param b Buffer
   *
   */
  static deserialize(b: Buffer): PublicKey {
    const r = new Reader(b);

    if (b.length === 33) {
      // ECDSA
      const algorithm = KeyType.ECDSA;
      const curve = CurveLabel.SECP256R1;
      const pk = r.readBytes(33);
      return new PublicKey(pk, algorithm, new KeyParameters(curve));
    } else {
      const algorithmHex = r.readByte();
      const curveHex = r.readByte();
      const pk = r.readBytes(r.length() - 2);

      return new PublicKey(pk, KeyType.fromHex(algorithmHex), new KeyParameters(CurveLabel.fromHex(curveHex)));
    }
  }

  static compare(a: PublicKey, b: PublicKey) {
    if (a.algorithm !== b.algorithm) {
      return a.algorithm.hex - b.algorithm.hex;
    }

    switch (a.algorithm) {
      case KeyType.ECDSA:
        const ec = new elliptic.ec(a.parameters.curve.preset);
        const paKey = ec.keyFromPublic(a.key, 'hex');
        const pbKey = ec.keyFromPublic(b.key, 'hex');
        const pa = paKey.getPublic();
        const pb = pbKey.getPublic();
        if (pa.getX() !== pb.getX()) {
          return pa.getX() - pb.getX();
        } else {
          return pa.getY() - pb.getY();
        }
      case KeyType.EDDSA:
        return Number(a.key.toString('hex')) - Number(b.key.toString('hex'));
      default:
        return 0;
    }
  }

  serialize(): Buffer {
    const w = new Writer();

    switch (this.algorithm) {
      case KeyType.ECDSA:
        w.writeBytes(this.key);
        break;
      case KeyType.EDDSA:
        w.writeUint8(this.algorithm.hex);
        w.writeUint8(this.parameters.curve.hex);
        w.writeBytes(this.key);
        break;
    }
    return w.getBytes();
  }

  /**
   * Verifies if the signature was created with private key corresponding to supplied public key
   * and was not tampered with using signature schema.
   *
   * @param msg Buffer input data or Signable object
   * @param signature Signature object
   */
  async verify(msg: Buffer | Signable, signature: Signature): Promise<boolean> {
    if (!this.isSchemaSupported(signature.algorithm)) {
      throw new Error('Signature schema does not match key type.');
    }

    // retrieves content to sign if not provided directly
    if (!(msg instanceof Buffer)) {
      msg = msg.getSignContent();
    }

    const hash = this.computeHash(msg, signature.algorithm);

    return this.verifySignature(hash, signature.value, signature.algorithm);
  }

  /**
   * For internal use.
   * @param hash Message hash
   * @param signature Hex encoded signature
   * @param schema Signature scheme to use
   */
  verifySignature(hash: Buffer, signature: Buffer, schema: SignatureScheme): boolean {
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
        return this.verifyEcDSASignature(hash, signature);
      case SignatureScheme.EDDSAwithSHA512:
        return this.verifyEdDSASignature(hash, signature);
      default:
        throw new Error('Unsupported signature schema.');
    }
  }

  /**
   * Verifies EcDSA signature of message hash. Curve name is derrived from private key.
   *
   * @param hash Message hash
   * @param signature Hex encoded signature
   */
  verifyEcDSASignature(hash: Buffer, signature: Buffer): boolean {
    const r: any = signature.slice(0, 32);
    const s: any = signature.slice(32, 64);

    const ec = new elliptic.ec(this.parameters.curve.preset);
    return ec.verify(hash, { r, s }, this.key, 'hex');
  }

  /**
   * Verifies EdDSA signature of message hash. Curve name is derrived from private key.
   *
   * @param hash Message hash
   * @param signature Hex encoded signature
   */
  verifyEdDSASignature(hash: Buffer, signature: Buffer): boolean {
    const r = signature.slice(0, 64);
    const s = signature.slice(64, 64);

    const eddsa = new elliptic.eddsa(this.parameters.curve.preset);
    return eddsa.verify(hash, { r, s }, this.key, 'hex');
  }
}
