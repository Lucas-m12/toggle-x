import { customAlphabet } from 'nanoid';


export class GenerateClientKey {
  static #nanoid = customAlphabet("abcdefghijklmnopqrstuvwxyz0123456789", 24);
  
  static generate(): string {
    return `togx_pk_${this.#nanoid()}`;
  }
}