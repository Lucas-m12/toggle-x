/* eslint-disable @typescript-eslint/no-explicit-any */
import { DomainEvent } from './domain-event';
import { DomainEventBus } from './domain-event-bus';

export class InMemoryEventBus implements DomainEventBus {
  private handlers = new Map<string, ((event: any) => Promise<void>)[]>();

  subscribe<T extends DomainEvent>(
    eventType: new (...args: any[]) => T,
    handler: (event: T) => Promise<void>,
  ) {
    const name = eventType.name;
    const handlers = this.handlers.get(name) ?? [];
    handlers.push(handler as any);
    this.handlers.set(name, handlers);
  }

  async publish<T extends DomainEvent>(event: T): Promise<void> {
    const name = event.constructor.name;
    const handlers = this.handlers.get(name) ?? [];
    for (const handler of handlers) {
      await handler(event);
    }
  }
}
