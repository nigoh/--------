/**
 * PII (Personally Identifiable Information) Masking Utility
 * 
 * Automatically masks sensitive information before logging
 */

// Regex patterns for common PII
const EMAIL_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
const PHONE_REGEX = /(\+?[\d\s\-\(\)]{10,})/g;
const CREDIT_CARD_REGEX = /\b(?:\d{4}[-\s]?){3}\d{4}\b/g;
const SSN_REGEX = /\b\d{3}-?\d{2}-?\d{4}\b/g;
const IP_ADDRESS_REGEX = /\b(?:[0-9]{1,3}\.){3}[0-9]{1,3}\b/g;
const JAPANESE_PHONE_REGEX = /0\d{1,4}-?\d{1,4}-?\d{1,4}/g;
const JAPANESE_POSTAL_REGEX = /\d{3}-?\d{4}/g;

// Common password field names
const PASSWORD_FIELDS = [
  'password',
  'passwd',
  'pwd',
  'pass',
  'passphrase',
  'secret',
  'token',
  'key',
  'apikey',
  'api_key',
  'access_token',
  'refresh_token',
  'auth_token',
  'パスワード',
  'パス',
  '暗証番号'
];

// Common sensitive field names
const SENSITIVE_FIELDS = [
  'creditcard',
  'credit_card',
  'cardnumber',
  'card_number',
  'ssn',
  'socialsecurity',
  'social_security',
  'personalid',
  'personal_id',
  'mynumber',
  'マイナンバー',
  '個人番号',
  'クレジットカード',
  'カード番号'
];

/**
 * Mask PII in a string
 */
export function maskPII(text: string): string {
  if (typeof text !== 'string') {
    return text;
  }

  let maskedText = text;

  // Mask email addresses
  maskedText = maskedText.replace(EMAIL_REGEX, (match) => {
    const [localPart, domain] = match.split('@');
    const maskedLocal = localPart.length > 2 
      ? localPart.charAt(0) + '*'.repeat(localPart.length - 2) + localPart.charAt(localPart.length - 1)
      : '*'.repeat(localPart.length);
    return `${maskedLocal}@${domain}`;
  });

  // Mask phone numbers
  maskedText = maskedText.replace(PHONE_REGEX, (match) => {
    return '*'.repeat(Math.max(match.length - 4, 4)) + match.slice(-4);
  });

  // Mask Japanese phone numbers
  maskedText = maskedText.replace(JAPANESE_PHONE_REGEX, (match) => {
    return '*'.repeat(Math.max(match.length - 4, 4)) + match.slice(-4);
  });

  // Mask credit card numbers
  maskedText = maskedText.replace(CREDIT_CARD_REGEX, (match) => {
    const cleaned = match.replace(/[-\s]/g, '');
    return '*'.repeat(12) + cleaned.slice(-4);
  });

  // Mask SSN
  maskedText = maskedText.replace(SSN_REGEX, '***-**-****');

  // Mask IP addresses (keep first octet)
  maskedText = maskedText.replace(IP_ADDRESS_REGEX, (match) => {
    const parts = match.split('.');
    return `${parts[0]}.***.***.***`;
  });

  // Mask Japanese postal codes
  maskedText = maskedText.replace(JAPANESE_POSTAL_REGEX, '***-****');

  return maskedText;
}

/**
 * Mask PII in object keys and values
 */
export function maskPIIInObject(obj: Record<string, unknown>): Record<string, unknown> {
  const masked: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(obj)) {
    const lowerKey = key.toLowerCase();

    // Check if key name suggests sensitive data
    const isPasswordField = PASSWORD_FIELDS.some(field => lowerKey.includes(field));
    const isSensitiveField = SENSITIVE_FIELDS.some(field => lowerKey.includes(field));

    if (isPasswordField) {
      masked[key] = '***';
    } else if (isSensitiveField) {
      masked[key] = typeof value === 'string' ? maskPII(value) : '***';
    } else if (typeof value === 'string') {
      masked[key] = maskPII(value);
    } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      masked[key] = maskPIIInObject(value as Record<string, unknown>);
    } else if (Array.isArray(value)) {
      masked[key] = value.map(item => 
        typeof item === 'string' ? maskPII(item) :
        typeof item === 'object' && item !== null ? maskPIIInObject(item as Record<string, unknown>) :
        item
      );
    } else {
      masked[key] = value;
    }
  }

  return masked;
}

/**
 * Check if a string contains potential PII
 */
export function containsPII(text: string): boolean {
  if (typeof text !== 'string') {
    return false;
  }

  return EMAIL_REGEX.test(text) ||
         PHONE_REGEX.test(text) ||
         CREDIT_CARD_REGEX.test(text) ||
         SSN_REGEX.test(text) ||
         IP_ADDRESS_REGEX.test(text) ||
         JAPANESE_PHONE_REGEX.test(text) ||
         JAPANESE_POSTAL_REGEX.test(text);
}

/**
 * Mask sensitive data based on field name patterns
 */
export function maskByFieldName(fieldName: string, value: unknown): unknown {
  const lowerFieldName = fieldName.toLowerCase();

  const isPasswordField = PASSWORD_FIELDS.some(field => lowerFieldName.includes(field));
  const isSensitiveField = SENSITIVE_FIELDS.some(field => lowerFieldName.includes(field));

  if (isPasswordField) {
    return '***';
  }

  if (isSensitiveField && typeof value === 'string') {
    return maskPII(value);
  }

  if (typeof value === 'string') {
    return maskPII(value);
  }

  if (typeof value === 'object' && value !== null) {
    return maskPIIInObject(value as Record<string, unknown>);
  }

  return value;
}