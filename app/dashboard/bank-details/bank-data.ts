export const BANK_OPTIONS: { value: string; label: string }[] = [
  { value: 'First Bank of Nigeria', label: 'First Bank of Nigeria' },
  { value: 'GTBank', label: 'Guaranty Trust Bank' },
  { value: 'Access Bank', label: 'Access Bank' },
  { value: 'Zenith Bank', label: 'Zenith Bank' },
  { value: 'UBA', label: 'United Bank for Africa' },
  { value: 'Ecobank', label: 'Ecobank Nigeria' },
  { value: 'Fidelity Bank', label: 'Fidelity Bank' },
  { value: 'Union Bank', label: 'Union Bank' },
  { value: 'Stanbic IBTC', label: 'Stanbic IBTC Bank' },
];

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(amount);
};
