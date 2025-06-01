// src/core/events/global-event-bus.ts
import { InMemoryEventBus } from './in-memory-event-bus';

export const globalEventBus = new InMemoryEventBus();
