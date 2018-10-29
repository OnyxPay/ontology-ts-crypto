import { createHash } from 'crypto';

export function sha256(data: Buffer) {
  const sh = createHash('sha256');
  sh.update(data);
  return sh.digest();
}

export function md160(data: Buffer) {
  const sh = createHash('ripemd160');
  sh.update(data);
  return sh.digest();
}
