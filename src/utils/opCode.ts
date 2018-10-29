export type OpCode = number;

export const PUSH0 = 0x00; // An empty array of bytes is pushed onto the stack.
export const PUSHF = PUSH0;
export const PUSHBYTES1 = 0x01; // 0x01-0x4B The next bytes is data to be pushed onto the stack
export const PUSHBYTES75 = 0x4b;
export const PUSHDATA1 = 0x4c; // The next byte contains the number of bytes to be pushed onto the stack.
export const PUSHDATA2 = 0x4d; // The next two bytes contain the number of bytes to be pushed onto the stack.
export const PUSHDATA4 = 0x4e; // The next four bytes contain the number of bytes to be pushed onto the stack.
export const PUSHM1 = 0x4f; // The number -1 is pushed onto the stack.
export const PUSH1 = 0x51; // The number 1 is pushed onto the stack.
export const PUSHT = PUSH1;
export const PUSH2 = 0x52; // The number 2 is pushed onto the stack.
export const PUSH3 = 0x53; // The number 3 is pushed onto the stack.
export const PUSH4 = 0x54; // The number 4 is pushed onto the stack.
export const PUSH5 = 0x55; // The number 5 is pushed onto the stack.
export const PUSH6 = 0x56; // The number 6 is pushed onto the stack.
export const PUSH7 = 0x57; // The number 7 is pushed onto the stack.
export const PUSH8 = 0x58; // The number 8 is pushed onto the stack.
export const PUSH9 = 0x59; // The number 9 is pushed onto the stack.
export const PUSH10 = 0x5a; // The number 10 is pushed onto the stack.
export const PUSH11 = 0x5b; // The number 11 is pushed onto the stack.
export const PUSH12 = 0x5c; // The number 12 is pushed onto the stack.
export const PUSH13 = 0x5d; // The number 13 is pushed onto the stack.
export const PUSH14 = 0x5e; // The number 14 is pushed onto the stack.
export const PUSH15 = 0x5f; // The number 15 is pushed onto the stack.
export const PUSH16 = 0x60; // The number 16 is pushed onto the stack.
// Flow control
export const NOP = 0x61; // Does nothing.
export const JMP = 0x62;
export const JMPIF = 0x63;
export const JMPIFNOT = 0x64;
export const CALL = 0x65;
export const RET = 0x66;
export const APPCALL = 0x67;
export const SYSCALL = 0x68;
export const TAILCALL = 0x69;
export const DUPFROMALTSTACK = 0x6a;
// Stack
export const TOALTSTACK = 0x6b; // Puts the input onto the top of the alt stack. Removes it from the main stack.
export const FROMALTSTACK = 0x6c; // Puts the input onto the top of the main stack. Removes it from the alt stack.
export const XDROP = 0x6d;
export const XSWAP = 0x72;
export const XTUCK = 0x73;
export const DEPTH = 0x74; // Puts the number of stack items onto the stack.
export const DROP = 0x75; // Removes the top stack item.
export const DUP = 0x76; // Duplicates the top stack item.
export const NIP = 0x77; // Removes the second-to-top stack item.
export const OVER = 0x78; // Copies the second-to-top stack item to the top.
export const PICK = 0x79; // The item n back in the stack is copied to the top.
export const ROLL = 0x7a; // The item n back in the stack is moved to the top.
export const ROT = 0x7b; // The top three items on the stack are rotated to the left.
export const SWAP = 0x7c; // The top two items on the stack are swapped.
export const TUCK = 0x7d; // The item at the top of the stack is copied and inserted before the second-to-top item.
// Splice
export const CAT = 0x7e; // Concatenates two strings.
export const SUBSTR = 0x7f; // Returns a section of a string.
export const LEFT = 0x80; // Keeps only characters left of the specified point in a string.
export const RIGHT = 0x81; // Keeps only characters right of the specified point in a string.
export const SIZE = 0x82; // Returns the length of the input string.
// Bitwise logic
export const INVERT = 0x83; // Flips all of the bits in the input.
export const AND = 0x84; // Boolean and between each bit in the inputs.
export const OR = 0x85; // Boolean or between each bit in the inputs.
export const XOR = 0x86; // Boolean exclusive or between each bit in the inputs.
export const EQUAL = 0x87; // Returns 1 if the inputs are exactly equal, 0 otherwise.
// export const EQUALVERIFY = 0x88; // Same as EQUAL, but runs VERIFY afterward.
// export const RESERVED1 = 0x89; // Transaction is invalid unless occuring in an unexecuted IF branch
// export const RESERVED2 = 0x8A; // Transaction is invalid unless occuring in an unexecuted IF branch

// Arithmetic
// Note: Arithmetic inputs are limited to signed 32-bit integers, but may overflow their output.
export const INC = 0x8b; // 1 is added to the input.
export const DEC = 0x8c; // 1 is subtracted from the input.
export const SIGN = 0x8d;
// export const SAL           = 0x8D; // The input is multiplied by 2.
// export const SAR           = 0x8E; // The input is divided by 2.
export const NEGATE = 0x8f; // The sign of the input is flipped.
export const ABS = 0x90; // The input is made positive.
export const NOT = 0x91; // If the input is 0 or 1, it is flipped. Otherwise the output will be 0.
export const NZ = 0x92; // Returns 0 if the input is 0. 1 otherwise.
export const ADD = 0x93; // a is added to b.
export const SUB = 0x94; // b is subtracted from a.
export const MUL = 0x95; // a is multiplied by b.
export const DIV = 0x96; // a is divided by b.
export const MOD = 0x97; // Returns the remainder after dividing a by b.
export const SHL = 0x98; // Shifts a left b bits, preserving sign.
export const SHR = 0x99; // Shifts a right b bits, preserving sign.
export const BOOLAND = 0x9a; // If both a and b are not 0, the output is 1. Otherwise 0.
export const BOOLOR = 0x9b; // If a or b is not 0, the output is 1. Otherwise 0.
export const NUMEQUAL = 0x9c; // Returns 1 if the numbers are equal, 0 otherwise.
export const NUMNOTEQUAL = 0x9e; // Returns 1 if the numbers are not equal, 0 otherwise.
export const LT = 0x9f; // Returns 1 if a is less than b, 0 otherwise.
export const GT = 0xa0; // Returns 1 if a is greater than b, 0 otherwise.
export const LTE = 0xa1; // Returns 1 if a is less than or equal to b, 0 otherwise.
export const GTE = 0xa2; // Returns 1 if a is greater than or equal to b, 0 otherwise.
export const MIN = 0xa3; // Returns the smaller of a and b.
export const MAX = 0xa4; // Returns the larger of a and b.
export const WITHIN = 0xa5; // Returns 1 if x is within the specified range (left-inclusive), 0 otherwise.
// Crypto
// export const RIPEMD160 = 0xA6; // The input is hashed using RIPEMD-160.
export const SHA1 = 0xa7; // The input is hashed using SHA-1.
export const SHA256 = 0xa8; // The input is hashed using SHA-256.
export const HASH160 = 0xa9;
export const HASH256 = 0xaa;
// tslint:disable-next-line:max-line-length
export const CHECKSIG = 0xac; // The entire transaction's outputs inputs and script (from the most recently-executed CODESEPARATOR to the end) are hashed. The signature used by CHECKSIG must be a valid signature for this hash and public key. If it is 1 is returned 0 otherwise.
export const VERIFY = 0xad;
// tslint:disable-next-line:max-line-length
export const CHECKMULTISIG = 0xae; // For each signature and public key pair CHECKSIG is executed. If more public keys than signatures are listed some key/sig pairs can fail. All signatures need to match a public key. If all signatures are valid 1 is returned 0 otherwise. Due to a bug one extra unused value is removed from the stack.
// Array
// tslint:disable:indent
export const ARRAYSIZE = 0xc0;
export const PACK = 0xc1;
export const UNPACK = 0xc2;
export const PICKITEM = 0xc3;
export const SETITEM = 0xc4;
export const NEWARRAY = 0xc5;
export const NEWSTRUCT = 0xc6;
export const NEWMAP = 0xc7;
export const APPEND = 0xc8;
export const REVERSE = 0xc9;
export const REMOVE = 0xca;
export const HASKEY = 0xcb;
export const KEYS = 0xcc;
export const VALUES = 0xcd;
// Exception
export const THROW = 0xf0;
export const THROWIFNOT = 0xf1;
