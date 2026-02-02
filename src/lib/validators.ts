/**
 * Validates a Brazilian CPF number using the official digit verification algorithm.
 * @param cpf - The CPF string (can include formatting like dots and dashes)
 * @returns true if the CPF is valid, false otherwise
 */
export function isValidCPF(cpf: string): boolean {
  // Remove non-numeric characters
  const cleaned = cpf.replace(/\D/g, '');
  
  // CPF must have exactly 11 digits
  if (cleaned.length !== 11) {
    return false;
  }
  
  // Check for known invalid patterns (all same digits)
  const invalidPatterns = [
    '00000000000',
    '11111111111',
    '22222222222',
    '33333333333',
    '44444444444',
    '55555555555',
    '66666666666',
    '77777777777',
    '88888888888',
    '99999999999',
  ];
  
  if (invalidPatterns.includes(cleaned)) {
    return false;
  }
  
  // Calculate first verification digit
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleaned.charAt(i)) * (10 - i);
  }
  let remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) {
    remainder = 0;
  }
  if (remainder !== parseInt(cleaned.charAt(9))) {
    return false;
  }
  
  // Calculate second verification digit
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleaned.charAt(i)) * (11 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) {
    remainder = 0;
  }
  if (remainder !== parseInt(cleaned.charAt(10))) {
    return false;
  }
  
  return true;
}

/**
 * Validates a Brazilian CNPJ number using the official digit verification algorithm.
 * @param cnpj - The CNPJ string (can include formatting like dots, slashes and dashes)
 * @returns true if the CNPJ is valid, false otherwise
 */
export function isValidCNPJ(cnpj: string): boolean {
  // Remove non-numeric characters
  const cleaned = cnpj.replace(/\D/g, '');
  
  // CNPJ must have exactly 14 digits
  if (cleaned.length !== 14) {
    return false;
  }
  
  // Check for known invalid patterns (all same digits)
  const invalidPatterns = [
    '00000000000000',
    '11111111111111',
    '22222222222222',
    '33333333333333',
    '44444444444444',
    '55555555555555',
    '66666666666666',
    '77777777777777',
    '88888888888888',
    '99999999999999',
  ];
  
  if (invalidPatterns.includes(cleaned)) {
    return false;
  }
  
  // Calculate first verification digit
  const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    sum += parseInt(cleaned.charAt(i)) * weights1[i];
  }
  let remainder = sum % 11;
  const digit1 = remainder < 2 ? 0 : 11 - remainder;
  
  if (digit1 !== parseInt(cleaned.charAt(12))) {
    return false;
  }
  
  // Calculate second verification digit
  const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  sum = 0;
  for (let i = 0; i < 13; i++) {
    sum += parseInt(cleaned.charAt(i)) * weights2[i];
  }
  remainder = sum % 11;
  const digit2 = remainder < 2 ? 0 : 11 - remainder;
  
  if (digit2 !== parseInt(cleaned.charAt(13))) {
    return false;
  }
  
  return true;
}

/**
 * Validates a Brazilian phone number.
 * @param phone - The phone string (can include formatting)
 * @returns true if the phone is valid, false otherwise
 */
export function isValidPhone(phone: string): boolean {
  const cleaned = phone.replace(/\D/g, '');
  // Valid: 10 digits (landline) or 11 digits (mobile with 9)
  return cleaned.length === 10 || cleaned.length === 11;
}

/**
 * Formats a CPF string to the standard format XXX.XXX.XXX-XX
 * @param cpf - The CPF string
 * @returns Formatted CPF
 */
export function formatCPF(value: string): string {
  const numbers = value.replace(/\D/g, '');
  return numbers
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})/, '$1-$2')
    .replace(/(-\d{2})\d+?$/, '$1');
}

/**
 * Formats a phone string to the standard format (XX) XXXXX-XXXX
 * @param phone - The phone string
 * @returns Formatted phone
 */
export function formatPhone(value: string): string {
  const numbers = value.replace(/\D/g, '');
  return numbers
    .replace(/(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d)/, '$1-$2')
    .replace(/(-\d{4})\d+?$/, '$1');
}

/**
 * Formats a CNPJ string to the standard format XX.XXX.XXX/XXXX-XX
 * @param cnpj - The CNPJ string
 * @returns Formatted CNPJ
 */
export function formatCNPJ(value: string): string {
  const numbers = value.replace(/\D/g, '');
  return numbers
    .replace(/(\d{2})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1/$2')
    .replace(/(\d{4})(\d{1,2})/, '$1-$2')
    .replace(/(-\d{2})\d+?$/, '$1');
}