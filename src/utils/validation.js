// Validation rules for Indian Corporate Compliance

export const validateGSTIN = (gstin) => {
  if (!gstin) return 'GSTIN is required';
  const regex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
  if (!regex.test(gstin.toUpperCase())) {
    return 'Invalid GSTIN format (e.g., 27ABCDE1234F1Z5)';
  }
  return null;
};

export const validatePAN = (pan) => {
  if (!pan) return 'PAN is required';
  const regex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
  if (!regex.test(pan.toUpperCase())) {
    return 'Invalid PAN format (e.g., ABCDE1234F)';
  }
  return null;
};

export const validateIFSC = (ifsc) => {
  if (!ifsc) return 'IFSC Code is required';
  const regex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
  if (!regex.test(ifsc.toUpperCase())) {
    return 'Invalid IFSC Code (e.g., HDFC0001234)';
  }
  return null;
};

export const validateMobile = (mobile) => {
  if (!mobile) return 'Mobile number is required';
  const regex = /^[6-9]\d{9}$/;
  if (!regex.test(mobile)) {
    return 'Invalid 10-digit mobile number';
  }
  return null;
};

export const validateEmail = (email) => {
  if (!email) return 'Email is required';
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regex.test(email)) {
    return 'Invalid email address';
  }
  return null;
};
