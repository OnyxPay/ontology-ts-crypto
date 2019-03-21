/**
 * Elliptic curve used.
 */
export declare class CurveLabel {
    static values: CurveLabel[];
    static SECP224R1: CurveLabel;
    static SECP256R1: CurveLabel;
    static SECP384R1: CurveLabel;
    static SECP521R1: CurveLabel;
    static ED25519: CurveLabel;
    /**
     * Finds Curvecorresponding to specified hex representation.
     *
     * @param hex Byte hex value
     */
    static fromHex(hex: number): CurveLabel;
    /**
     * Finds Curve corresponding to specified label representation.
     *
     * @param label Label
     */
    static fromLabel(label: string): CurveLabel;
    label: string;
    hex: number;
    preset: string;
    constructor(label: string, hex: number, preset: string);
}
