import { Injectable } from '@angular/core';
import { scrypt } from 'scrypt-js';
import * as aes from 'aes-js';
import { ModeOfOperation } from 'aes-js';

const N = 16384;
const r = 8;
const p = 1;

@Injectable({
  providedIn: 'root',
})
export class CryptoService {
  public textDecoder = new TextDecoder();

  toArray(value: string): Uint8Array {
    return aes.utils.utf8.toBytes(value);
  }

  randomBytes(size: number): Uint8Array {
    const result = new Uint8Array(size);
    for (let i = 0; i < size; i++) {
      result[i] = Math.floor(Math.random() * 255);
    }
    return result;
  }

  scrypt(data: Uint8Array, salt: Uint8Array, dkLen: number = 32): Promise<Uint8Array> {
    return scrypt(data, salt, N, r, p, dkLen);
  }

  hex(value: Uint8Array): string {
    return aes.utils.hex.fromBytes(value);
  }

  fromHex(value: string): Uint8Array {
    return aes.utils.hex.toBytes(value);
  }

  getKey(password: string, salt: Uint8Array): Promise<Uint8Array> {
    const pwdBytes = this.toArray(password);
    return this.scrypt(pwdBytes, salt);
  }

  initCypher(key: Uint8Array): ModeOfOperation.ModeOfOperationCBC {
    return new aes.ModeOfOperation.ctr(key);
  }
}
