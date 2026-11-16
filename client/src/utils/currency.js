export const formatINR = (amount) => {
  if (typeof amount !== 'number') {
    const parsed = parseFloat(amount);
    if (isNaN(parsed)) return '₹0';
    amount = parsed;
  }
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
};

