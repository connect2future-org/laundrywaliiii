export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(String(email).toLowerCase());
};

export const isValidPhone = (phone) => {
  // Indian 10-digit mobile number validation
  const clean = String(phone).replace(/\D/g, '');
  return clean.length === 10 && /^[6-9]\d{9}$/.test(clean);
};

export const isValidPincode = (pincode) => {
  const clean = String(pincode).trim();
  return /^[1-9][0-9]{5}$/.test(clean);
};

export const validateRequired = (value) => {
  if (value === undefined || value === null) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  return true;
};

