import { UserRegisteredEvent } from '@/domain/user/events/user-registered';
import { OnUserRegisteredSendEmailVerification } from './app/user/events/on-user-registered-send-email';
import { globalEventBus } from './core/events/global-event-bus';
import { makeSendVerificationEmailUseCase } from './infra/factories/use-cases/user/make-send-email';

export function registerEventHandlers() {
  globalEventBus.subscribe(UserRegisteredEvent, async (event) => {
    const handler = new OnUserRegisteredSendEmailVerification(
      makeSendVerificationEmailUseCase(),
    );
    await handler.handle(event);
  });
}
