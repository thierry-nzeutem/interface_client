import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import QuoteRequestPage from './QuoteRequestPage';

// Mock stores and child components
const mockSetCurrentStep = vi.fn();
const mockValidateStep = vi.fn().mockReturnValue(true);

vi.mock('../stores/quoteRequestStore', () => ({
  useQuoteRequestStore: () => ({
    currentStep: 1,
    formData: { mainService: '', society: { id: null, isNew: false, details: {} }, establishment: { name: '', address: '', activity: '', surface: '' } },
    validation: { errors: {}, isValid: true },
    drafts: [],
    isLoading: false,
    setCurrentStep: mockSetCurrentStep,
    validateStep: mockValidateStep,
    saveDraft: vi.fn(),
    loadDraft: vi.fn(),
    submitRequest: vi.fn(),
    reset: vi.fn()
  })
}));

vi.mock('../components/quote-request/Step1Society', () => ({ default: () => <div>Step1</div> }));
vi.mock('../components/quote-request/Step2MainService', () => ({ default: () => <div>Step2</div> }));
vi.mock('../components/quote-request/Step3SubServicesOrCalendar', () => ({ default: () => <div>Step3</div> }));
vi.mock('../components/quote-request/Step4Criteria', () => ({ default: () => <div>Step4</div> }));
vi.mock('../components/quote-request/Step5Summary', () => ({ default: () => <div>Step5</div> }));
vi.mock('../stores/mockDataStore', () => ({ useMockDataStore: () => ({ addNotification: vi.fn(), addActivity: vi.fn() }) }));
vi.mock('../components/ui/Toast', () => ({ useToastStore: () => ({ addToast: vi.fn() }) }));

beforeEach(() => {
  mockSetCurrentStep.mockClear();
  mockValidateStep.mockClear();
});

describe('QuoteRequestPage', () => {
  it('sets step from URL parameter', () => {
    render(
      <MemoryRouter initialEntries={[ '/quote-request/step/2' ]}>
        <Routes>
          <Route path="/quote-request/step/:stepNumber" element={<QuoteRequestPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(mockSetCurrentStep).toHaveBeenCalledWith(2);
  });

  it('goes to next step when clicking Next', () => {
    render(
      <MemoryRouter initialEntries={[ '/quote-request/step/1' ]}>
        <Routes>
          <Route path="/quote-request" element={<QuoteRequestPage />} />
          <Route path="/quote-request/step/:stepNumber" element={<QuoteRequestPage />} />
        </Routes>
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText('Suivant'));
    expect(mockValidateStep).toHaveBeenCalled();
    expect(mockSetCurrentStep).toHaveBeenCalledWith(2);
  });
});
