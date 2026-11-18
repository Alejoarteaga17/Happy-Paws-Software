import { test, expect } from '@playwright/test';
import type { Page } from '@playwright/test';

const credentials = {
  owner: { email: process.env.E2E_OWNER_EMAIL, password: process.env.E2E_OWNER_PASSWORD },
  receptionist: { email: process.env.E2E_RECEPTIONIST_EMAIL, password: process.env.E2E_RECEPTIONIST_PASSWORD },
};

async function login(page: Page, email?: string, password?: string) {
  test.skip(!email || !password, 'Define credenciales E2E sintéticas para ejecutar contra staging.');
  await page.goto('/login');
  await page.getByLabel(/correo/i).fill(email!);
  await page.getByLabel(/contraseña/i).fill(password!);
  await page.getByRole('button', { name: /iniciar sesión/i }).click();
}

test('OWNER only sees the owner portal navigation', async ({ page }) => {
  await login(page, credentials.owner.email, credentials.owner.password);
  await expect(page).toHaveURL(/\/portal/);
  await expect(page.getByRole('link', { name: 'Mi portal' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Agenda' })).toHaveCount(0);
  await expect(page.getByRole('link', { name: 'Vacunaciones' })).toHaveCount(0);
});

test('RECEPTIONIST can access users but not administrative audit', async ({ page }) => {
  await login(page, credentials.receptionist.email, credentials.receptionist.password);
  await expect(page.getByRole('link', { name: 'Usuarios' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Auditoría' })).toHaveCount(0);
});
