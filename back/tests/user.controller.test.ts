import { describe, expect, it, jest } from '@jest/globals';
import { AuditService } from '../src/services/audit.service';
import { UserService } from '../src/services/user.service';
import { updateUserRole } from '../src/controllers/user.controller';

jest.mock('../src/services/audit.service', () => ({ AuditService: { record: jest.fn() } }));
jest.mock('../src/services/user.service', () => ({ UserService: { updateRole: jest.fn() } }));

const mockedUpdateRole = jest.mocked(UserService.updateRole);

describe('updateUserRole controller', () => {
  it('prevents RECEPTIONIST from changing any user role', async () => {
    const response = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };

    await updateUserRole(
      { params: { id: 'user-2' }, body: { role: 'VET' }, user: { role: 'RECEPTIONIST', id: 'user-1' } } as never,
      response as never,
    );

    expect(response.status).toHaveBeenCalledWith(403);
    expect(mockedUpdateRole).not.toHaveBeenCalled();
    expect(AuditService.record).not.toHaveBeenCalled();
  });
});
