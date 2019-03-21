/// <reference types="node" />
import { CurveLabel } from './curveLabel';
import { KeyType } from './keyType';
import { SignatureScheme } from './signatureScheme';
/**
 * Common representation of private or public key
 */
export declare class Key {
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
    constructor(key: Buffer | string, algorithm?: KeyType, parameters?: KeyParameters);
    /**
     * Computes hash of message using hashing function of signature schema.
     *
     * @param msg input data
     * @param scheme Signing schema to use
     */
    computeHash(msg: Buffer, scheme: SignatureScheme): Buffer;
    /**
     * Tests if signing schema is compatible with key type.
     *
     * @param schema Signing schema to use
     */
    isSchemaSupported(schema: SignatureScheme): boolean;
}
export declare class KeyParameters {
    static deserializeJson(obj: any): KeyParameters;
    curve: CurveLabel;
    constructor(curve: CurveLabel);
    serializeJson(): {
        curve: string;
    };
}
