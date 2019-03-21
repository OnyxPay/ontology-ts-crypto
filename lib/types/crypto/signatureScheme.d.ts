/**
 * Schema used during signing and verification of signature.
 */
export declare class SignatureScheme {
    static values: SignatureScheme[];
    static ECDSAwithSHA224: SignatureScheme;
    static ECDSAwithSHA256: SignatureScheme;
    static ECDSAwithSHA384: SignatureScheme;
    static ECDSAwithSHA512: SignatureScheme;
    static ECDSAwithSHA3_224: SignatureScheme;
    static ECDSAwithSHA3_256: SignatureScheme;
    static ECDSAwithSHA3_384: SignatureScheme;
    static ECDSAwithSHA3_512: SignatureScheme;
    static ECDSAwithRIPEMD160: SignatureScheme;
    static EDDSAwithSHA512: SignatureScheme;
    /**
     * Finds Signature schema corresponding to specified hex representation.
     *
     * @param hex Byte hex value
     */
    static fromHex(hex: number): SignatureScheme;
    /**
     * Finds Signature schema corresponding to specified label representation.
     *
     * @param label Label
     */
    static fromLabel(label: string): SignatureScheme;
    /**
     * Finds Signature schema corresponding to specified label representation in JWS.
     *
     * @param label Label
     */
    static fromLabelJWS(label: string): SignatureScheme;
    label: string;
    hex: number;
    labelJWS: string;
    constructor(label: string, hex: number, labelJWS: string);
}
