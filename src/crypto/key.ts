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

import { createHash } from 'crypto';
import { sha3_224, sha3_256, sha3_384, sha3_512 } from 'js-sha3';
import { DEFAULT_ALGORITHM } from './consts';
import { CurveLabel } from './curveLabel';
import { KeyType } from './keyType';
import { SignatureScheme } from './signatureScheme';

/**
 * Common representation of private or public key
 */
export class Key {
  /**
   * Algorithm used for key generation.
   */
  algorithm: KeyType;

  /**
   * Parameters of the algorithm.
   */
  parameters: KeyParameters;

  /**
   * Key data.
   */
  key: Buffer;

  /**
   * Creates Key.
   *
   * If no algorithm or parameters are specified, default values will be used.
   * This is strongly discurraged, because it will forbid using other Key types.
   * Therefore use it only for testing.
   *
   * @param key Hex encoded key value
   * @param algorithm Key type
   * @param parameters Parameters of the key type
   */
  constructor(key: Buffer | string, algorithm?: KeyType, parameters?: KeyParameters) {
    if (typeof key === 'string') {
      key = new Buffer(key, 'hex');
    }

    this.key = key;

    if (algorithm === undefined) {
      algorithm = KeyType.fromLabel(DEFAULT_ALGORITHM.algorithm);
    }

    if (parameters === undefined) {
      parameters = new KeyParameters(CurveLabel.fromLabel(DEFAULT_ALGORITHM.parameters.curve));
    }

    this.algorithm = algorithm;
    this.parameters = parameters;
  }

  /**
   * Computes hash of message using hashing function of signature schema.
   *
   * @param msg input data
   * @param scheme Signing schema to use
   */
  computeHash(msg: Buffer, scheme: SignatureScheme): Buffer {
    if (scheme === SignatureScheme.ECDSAwithSHA224) {
      const hash = createHash('sha224');
      hash.update(msg);
      return hash.digest();
    } else if (scheme === SignatureScheme.ECDSAwithSHA256) {
      const hash = createHash('sha256');
      hash.update(msg);
      return hash.digest();
    } else if (scheme === SignatureScheme.ECDSAwithSHA384) {
      const hash = createHash('sha384');
      hash.update(msg);
      return hash.digest();
    } else if (scheme === SignatureScheme.ECDSAwithSHA3_512 || scheme === SignatureScheme.EDDSAwithSHA512) {
      const hash = createHash('sha512');
      hash.update(msg);
      return hash.digest();
    } else if (scheme === SignatureScheme.ECDSAwithRIPEMD160) {
      const hash = createHash('ripemd160');
      hash.update(msg);
      return hash.digest();
    } else if (scheme === SignatureScheme.ECDSAwithSHA3_224) {
      return new Buffer(sha3_224.arrayBuffer(msg));
    } else if (scheme === SignatureScheme.ECDSAwithSHA3_256) {
      return new Buffer(sha3_256.arrayBuffer(msg));
    } else if (scheme === SignatureScheme.ECDSAwithSHA3_384) {
      return new Buffer(sha3_384.arrayBuffer(msg));
    } else if (scheme === SignatureScheme.ECDSAwithSHA3_512) {
      return new Buffer(sha3_512.arrayBuffer(msg));
    } else {
      throw new Error('Unsupported hash algorithm.');
    }
  }

  /**
   * Tests if signing schema is compatible with key type.
   *
   * @param schema Signing schema to use
   */
  isSchemaSupported(schema: SignatureScheme): boolean {
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
        return this.algorithm === KeyType.ECDSA;
      case SignatureScheme.EDDSAwithSHA512:
        return this.algorithm === KeyType.EDDSA;
      default:
        throw new Error('Unsupported signature schema.');
    }
  }
}

export class KeyParameters {
  static deserializeJson(obj: any) {
    return new KeyParameters(CurveLabel.fromLabel(obj.curve));
  }

  curve: CurveLabel;

  constructor(curve: CurveLabel) {
    this.curve = curve;
  }

  serializeJson() {
    return {
      curve: this.curve.label
    };
  }
}
