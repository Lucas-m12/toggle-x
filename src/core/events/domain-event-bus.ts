/* eslint-disable @typescript-eslint/no-explicit-any */
import { DomainEvent } from './domain-event';

export interface DomainEventBus {
  publish<T extends DomainEvent>(event: T): Promise<void>;
  subscribe<T extends DomainEvent>(
    eventType: new (...args: any[]) => T,
    handler: (event: T) => Promise<void>,
  ): void;
}
