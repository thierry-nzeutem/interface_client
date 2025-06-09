import React, { useState, useEffect } from 'react';
import { Check, X, Loader2, Building } from 'lucide-react';
import { useLanguageStore } from '../../stores/languageStore';

export const formatSiret = (input: string) => {
  // Remove all non-digits
  const digits = input.replace(/\D/g, '');
  // Limit to 14 digits
  const limited = digits.slice(0, 14);
  // Format with spaces: XXX XXX XXX XXXXX
  return limited.replace(/(\d{3})(\d{3})(\d{3})(\d{0,5})/, (match, p1, p2, p3, p4) => {
    let formatted = p1;
    if (p2) formatted += ' ' + p2;
    if (p3) formatted += ' ' + p3;
    if (p4) formatted += ' ' + p4;
    return formatted;
  });
};

interface SiretInputProps {
  value: string;
  onChange: (value: string) => void;
  onValidation?: (isValid: boolean, data?: any) => void;
}

const SiretInput: React.FC<SiretInputProps> = ({ value, onChange, onValidation }) => {
  const [validationState, setValidationState] = useState<'idle' | 'checking' | 'valid' | 'invalid'>('idle');
  const [companyData, setCompanyData] = useState<any>(null);
  const { t } = useLanguageStore();

  useEffect(() => {
    if (value.length === 14) {
      validateSiret(value);
    } else {
      setValidationState('idle');
      setCompanyData(null);
      onValidation?.(false);
    }
  }, [value]);

  const validateSiret = async (siret: string) => {
    setValidationState('checking');
    
    // Simulate API call to INSEE SIRENE API
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock validation logic with more realistic scenarios
      const isValid = siret.match(/^\d{14}$/) && siret !== '00000000000000';
      
      if (isValid) {
        // Simulate different company types based on SIRET
        const mockCompanies = {
          '12345678901234': {
            denomination: 'Restaurant Le Gourmet SARL',
            adresse: '123 Rue de la Paix, 75015 Paris',
            activite: 'Restauration traditionnelle',
            effectifs: '10-19 salariés',
            dateCreation: '2018-03-15'
          },
          '56789012345678': {
            denomination: 'Hôtel des Voyageurs SAS',
            adresse: '45 Avenue de la République, 69001 Lyon',
            activite: 'Hôtels et hébergement similaire',
            effectifs: '20-49 salariés',
            dateCreation: '2015-09-22'
          },
          '98765432109876': {
            denomination: 'Café Central EURL',
            adresse: '8 Place du Marché, 13001 Marseille',
            activite: 'Débits de boissons',
            effectifs: '1-9 salariés',
            dateCreation: '2020-01-10'
          }
        };

        const mockData = mockCompanies[siret] || {
          denomination: 'Société Exemple SAS',
          adresse: '1 Rue de l\'Exemple, 75001 Paris',
          activite: 'Activité commerciale',
          effectifs: '10-19 salariés',
          dateCreation: '2019-06-01'
        };

        setCompanyData(mockData);
        setValidationState('valid');
        onValidation?.(true, mockData);
      } else {
        setValidationState('invalid');
        onValidation?.(false);
      }
    } catch (error) {
      setValidationState('invalid');
      onValidation?.(false);
    }
  };

  const getValidationIcon = () => {
    switch (validationState) {
      case 'checking':
        return <Loader2 className="h-5 w-5 text-yellow-500 animate-spin" />;
      case 'valid':
        return <Check className="h-5 w-5 text-green-500" />;
      case 'invalid':
        return <X className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  const getValidationMessage = () => {
    switch (validationState) {
      case 'checking':
        return <span className="text-yellow-600">Vérification en cours...</span>;
      case 'valid':
        return <span className="text-green-600">SIRET valide ✓</span>;
      case 'invalid':
        return <span className="text-red-600">SIRET invalide ou introuvable</span>;
      default:
        return <span className="text-gray-500">14 chiffres : 9 chiffres SIREN + 5 chiffres établissement</span>;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatSiret(e.target.value);
    const digitsOnly = formatted.replace(/\s/g, '');
    onChange(digitsOnly);
  };

  return (
    <div className="space-y-3">
      <div className="relative">
        <input
          type="text"
          value={formatSiret(value)}
          onChange={handleInputChange}
          placeholder="123 456 789 01234"
          className={`w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 font-mono text-lg ${
            validationState === 'valid' ? 'border-green-500 bg-green-50' :
            validationState === 'invalid' ? 'border-red-500 bg-red-50' :
            validationState === 'checking' ? 'border-yellow-500 bg-yellow-50' :
            'border-gray-300'
          }`}
          maxLength={17} // 14 digits + 3 spaces
        />
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          {getValidationIcon()}
        </div>
      </div>
      
      <div className="text-sm">
        {getValidationMessage()}
      </div>
      
      {companyData && validationState === 'valid' && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-start space-x-3">
            <div className="bg-green-500 text-white rounded-lg p-2">
              <Building className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-green-900 mb-2">{companyData.denomination}</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="font-medium text-green-800">Adresse :</span>
                  <p className="text-green-700">{companyData.adresse}</p>
                </div>
                <div>
                  <span className="font-medium text-green-800">Activité :</span>
                  <p className="text-green-700">{companyData.activite}</p>
                </div>
                <div>
                  <span className="font-medium text-green-800">Effectifs :</span>
                  <p className="text-green-700">{companyData.effectifs}</p>
                </div>
                <div>
                  <span className="font-medium text-green-800">Création :</span>
                  <p className="text-green-700">{new Date(companyData.dateCreation).toLocaleDateString('fr-FR')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Exemples de SIRET valides pour test */}
      {validationState === 'idle' && value.length === 0 && (
        <div className="text-xs text-gray-500 space-y-1">
          <p>Exemples pour test :</p>
          <div className="flex flex-wrap gap-2">
            {['12345678901234', '56789012345678', '98765432109876'].map(siret => (
              <button
                key={siret}
                onClick={() => onChange(siret)}
                className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-xs font-mono transition-colors"
              >
                {formatSiret(siret)}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SiretInput;