import { UserRegisteredEvent } from '@/domain/user/events/user-registered';
import { describe, expect, it, vi } from 'vitest';
import { SendVerificationEmailUseCase } from '../send-verification-email';
import { OnUserRegisteredSendEmailVerification } from './on-user-registered-send-email';

describe('OnUserRegisteredSendEmailVerification', () => {
  it('should call SendVerificationEmailUseCase with correct params', async () => {
    const sendEmailUseCase: SendVerificationEmailUseCase = {
      execute: vi.fn().mockResolvedValue(undefined),
    };

    const handler = new OnUserRegisteredSendEmailVerification(sendEmailUseCase);

    const event = new UserRegisteredEvent({
      userId: 'user-123',
      email: 'lucas@example.com',
      tenantId: 'tenant-1',
    });

    await handler.handle(event);

    expect(sendEmailUseCase.execute).toHaveBeenCalledWith({
      tenantId: 'tenant-1',
      email: 'lucas@example.com',
      baseUrl: expect.any(String), // vem de env ou default
    });
  });
});
