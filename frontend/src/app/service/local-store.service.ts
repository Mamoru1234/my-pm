import { Injectable } from '@angular/core';
import { CryptoService } from './crypto.service';

export const LOCAL_STORAGE_CRYPTO_KEY = 'LOCAL_STORAGE_CRYPTO_KEY';
export const LOCAL_STORAGE_SALT = 'LOCAL_STORAGE_SALT';
export const LOCAL_STORAGE_CHECK = 'LOCAL_STORAGE_CHECK';
export const PIN_LENGTH = 4;
export const PIN_PATTERN = /\d{4}/;

@Injectable({
  providedIn: 'root',
})
export class LocalStoreService {
  private key?: Uint8Array;
  constructor(
    private readonly cryptoService: CryptoService,
  ) {
  }
  static hasStore(): boolean {
    const salt = localStorage.getItem(LOCAL_STORAGE_SALT);
    const check = localStorage.getItem(LOCAL_STORAGE_CHECK);
    return !!salt && !!check;
  }

  async init(pin: string): Promise<void> {
    this.key = undefined;
    this.validatePin(pin);
    const salt = localStorage.getItem(LOCAL_STORAGE_SALT);
    if (!salt) {
      throw new Error('Cannot init absent store');
    }
    this.key = await this.cryptoService.getKey(pin, this.cryptoService.fromHex(salt));
    const cypher = this.cryptoService.initCypher(this.key);
    const checkSum = localStorage.getItem(LOCAL_STORAGE_CHECK);
    if (!checkSum) {
      throw new Error('No checksum for store');
    }
    const check = this.cryptoService.textDecoder.decode(cypher.decrypt(this.cryptoService.fromHex(checkSum)));
    const pinCheck = check.split('.')[0];
    if (pinCheck !== pin) {
      throw new Error('Wrong pin');
    }
  }

  async create(pin: string): Promise<void> {
    this.validatePin(pin);
    const salt = this.cryptoService.hex(this.cryptoService.randomBytes(32));
    localStorage.setItem(LOCAL_STORAGE_SALT, salt);
    const key = await this.cryptoService.getKey(pin, this.cryptoService.fromHex(salt))
    const check = `${pin}.${this.cryptoService.hex(this.cryptoService.randomBytes(5))}`;
    const cypher = this.cryptoService.initCypher(key);
    const checkSum = cypher.encrypt(this.cryptoService.toArray(check));
    localStorage.setItem(LOCAL_STORAGE_CHECK, this.cryptoService.hex(checkSum));
    localStorage.removeItem(LOCAL_STORAGE_CRYPTO_KEY);
  }

  validatePin(pin: string): void {
    if (pin.length !== PIN_LENGTH) {
      throw new Error('Wrong pin length only 4 digits allowed');
    }
    if (!PIN_PATTERN.test(pin)) {
      throw new Error('Pin can be only digits');
    }
  }

  loadData(): any {
    if (!this.key) {
      throw new Error('Init first');
    }
    const encrypted = localStorage.getItem(LOCAL_STORAGE_CRYPTO_KEY);
    if (!encrypted) {
      throw new Error('Nothing stored');
    }
    const encryptedBytes = this.cryptoService.fromHex(encrypted);
    const cypher = this.cryptoService.initCypher(this.key);
    const data = this.cryptoService.textDecoder.decode(cypher.decrypt(encryptedBytes));
    return JSON.parse(data);
  }

  saveData(data: any): void {
    if (!this.key) {
      throw new Error('Init first');
    }
    const cypher = this.cryptoService.initCypher(this.key);
    const textPayload = JSON.stringify(data);
    const payloadBytes = this.cryptoService.toArray(textPayload);
    const encrypted = cypher.encrypt(payloadBytes);
    localStorage.setItem(LOCAL_STORAGE_CRYPTO_KEY, this.cryptoService.hex(encrypted));
  }

  destroy(): void {
    localStorage.removeItem(LOCAL_STORAGE_CRYPTO_KEY);
    localStorage.removeItem(LOCAL_STORAGE_CHECK);
    localStorage.removeItem(LOCAL_STORAGE_SALT);
  }
}
