import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useAuthStore } from './authStore';

const store = useAuthStore;

// Reset store before each test
beforeEach(() => {
  store.setState({ isAuthenticated: false, user: null });
});

describe('authStore', () => {
  it('logs in the user', async () => {
    vi.useFakeTimers();
    const loginPromise = store.getState().login('test@example.com', '1234');
    vi.runAllTimers();
    await loginPromise;
    expect(store.getState().isAuthenticated).toBe(true);
    expect(store.getState().user?.email).toBe('test@example.com');
    vi.useRealTimers();
  });

  it('logs out the user', () => {
    store.setState({ isAuthenticated: true, user: { id: '1', email: 'a', name: 'a', companies: [] } });
    store.getState().logout();
    expect(store.getState().isAuthenticated).toBe(false);
    expect(store.getState().user).toBeNull();
  });
});
