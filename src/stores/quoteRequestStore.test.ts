import { describe, it, expect, beforeEach } from 'vitest';
import { useQuoteRequestStore } from './quoteRequestStore';

// Helper to reset store before each test
const store = useQuoteRequestStore;

describe('quoteRequestStore validateStep', () => {
  beforeEach(() => {
    store.getState().reset();
  });

  it('step 1 fails with empty form', () => {
    const isValid = store.getState().validateStep(1);
    expect(isValid).toBe(false);
    expect(store.getState().validation.errors.establishmentName).toBeDefined();
  });

  it('step 1 passes with minimal required fields', () => {
    store.getState().updateFormData({
      society: { id: '1', isNew: false, details: {} },
      establishment: {
        name: 'Test',
        address: '1 rue',
        activity: 'Restauration',
        surface: '20'
      }
    });
    const isValid = store.getState().validateStep(1);
    expect(isValid).toBe(true);
  });

  it('step 3 requires calendar fields when main service needs calendar', () => {
    store.getState().updateFormData({ mainService: 'phone-consultation' });
    expect(store.getState().validateStep(3)).toBe(false);
    expect(store.getState().validation.errors.consultationDate).toBeDefined();

    store.getState().updateFormData({
      consultation: {
        type: 'phone',
        duration: '30',
        urgency: 'standard',
        selectedDate: new Date('2024-01-01'),
        selectedTimeSlot: '09:00',
        isCalendarMode: false
      }
    });
    expect(store.getState().validateStep(3)).toBe(true);
  });
});
