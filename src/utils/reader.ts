import * as ByteBuffer from 'bytebuffer';
import * as Long from 'long';

export type Whence = 'start' | 'relative';

export class Reader {
  reader: ByteBuffer;

  constructor(b: Buffer) {
    this.reader = ByteBuffer.wrap(b, 'utf-8', true);
  }

  readByte(): number {
    return this.reader.readUint8();
  }

  readBytes(count: number): Buffer {
    return new Buffer(this.reader.readBytes(count).toBuffer());
  }

  readUInt16(): number {
    return this.reader.readUint16();
  }

  readUInt32(): number {
    return this.reader.readUint32();
  }

  readUInt64(): Long {
    return this.reader.readUint64();
  }

  readInt16(): number {
    return this.reader.readInt16();
  }

  readInt32(): number {
    return this.reader.readInt32();
  }

  readInt64(): Long {
    return this.reader.readInt64();
  }

  position(): number {
    return this.reader.offset;
  }

  length(): number {
    return this.reader.limit;
  }

  seek(offset: number, whence: Whence): number {
    if (whence === 'start') {
      const oldOffset = this.reader.offset;
      this.reader.offset = offset;
      return oldOffset;
    } else if (whence === 'relative') {
      const oldOffset = this.reader.offset;
      this.reader.offset = oldOffset + offset;
      return oldOffset;
    } else {
      throw new Error('Unsupported Whence');
    }
  }

  readVarBytes(max?: number): Buffer {
    const n = this.readVarUInt(max !== undefined ? Long.fromNumber(max) : undefined).toNumber();
    return this.readBytes(n);
  }

  readVarInt(max?: Long): Long {
    const fb = this.readByte();
    let value: Long;

    switch (fb) {
      case 0xfd:
        value = Long.fromNumber(this.readUInt16());
        break;
      case 0xfe:
        value = Long.fromNumber(this.readUInt32());
        break;
      case 0xff:
        value = this.readUInt64();
        break;
      default:
        value = Long.fromNumber(fb);
    }
    if (max !== undefined && value.gt(max)) {
      return Long.ZERO;
    }
    return value;
  }

  readVarUInt(max?: Long): Long {
    const fb = this.readByte();
    let value: Long;

    switch (fb) {
      case 0xfd:
        value = Long.fromNumber(this.readInt16());
        break;
      case 0xfe:
        value = Long.fromNumber(this.readInt32());
        break;
      case 0xff:
        value = this.readInt64();
        break;

      default:
        value = Long.fromNumber(fb);
    }
    if (max !== undefined && value.gt(max)) {
      return Long.ZERO;
    }
    return value;
  }

  readVarString(maxlen?: number): string {
    const bs = this.readVarBytes(maxlen);
    return bs.toString('utf-8');
  }
}
