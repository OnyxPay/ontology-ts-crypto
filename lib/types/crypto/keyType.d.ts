import { SignatureScheme } from './signatureScheme';
/**
 * Type of key. ECDSA is the default one to use.
 */
export declare class KeyType {
    static values: KeyType[];
    static ECDSA: KeyType;
    static EDDSA: KeyType;
    /**
     * Finds Key type corresponding to specified hex representation.
     *
     * @param hex Byte hex value
     */
    static fromHex(hex: number): KeyType;
    /**
     * Finds Key type corresponding to specified label representation.
     *
     * @param label Label
     */
    static fromLabel(label: string): KeyType;
    label: string;
    hex: number;
    defaultSchema: SignatureScheme;
    constructor(label: string, hex: number, defaultSchema: SignatureScheme);
}
