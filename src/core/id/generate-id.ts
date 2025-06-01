import { ulid } from 'ulid';

export class GenerateId {
  static generate(): string {
    return ulid();
  }
}