/**
 * PII (Personally Identifiable Information) Masking Utility
 * 
 * 個人情報を自動でマスクする
 */

// PII パターンの正規表現 (処理順序重要 - より具体的なパターンを先に)
const PII_PATTERNS = {
  creditCard: /\b\d{4}[-.\s]?\d{4}[-.\s]?\d{4}[-.\s]?\d{4}\b/g,
  socialSecurityNumber: /\b\d{3}-\d{2}-\d{4}\b/g,
  email: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
  phone: /(\+81|0)\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{4}/g,
  japanesePhone: /(0[789]0[-.\s]?\d{4}[-.\s]?\d{4}|0\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{4})/g,
  ipAddress: /\b(?:[0-9]{1,3}\.){3}[0-9]{1,3}\b/g,
  password: /password['":\s]*['"]\w+['"]/gi,
  token: /token['":\s]*['"]\w+['"]/gi,
  apiKey: /(?:api[-_]?key|apikey)['":\s]*['"]\w+['"]/gi,
};

// 機密なキー名のパターン
const SENSITIVE_KEYS = [
  'password', 'passwd', 'pwd',
  'token', 'auth', 'authorization',
  'secret', 'key', 'api_key', 'apikey',
  'credit_card', 'creditcard', 'card_number',
  'ssn', 'social_security',
  'email', 'mail', 'e_mail',
  'phone', 'telephone', 'mobile',
  'address', 'location', 'geo',
  'birth', 'birthday', 'born'
  // 'name' is often not sensitive in business contexts
];

/**
 * 文字列から PII をマスク
 */
export function maskPIIInString(text: string): string {
  if (typeof text !== 'string') return text;

  let maskedText = text;

  // 各パターンでマスク
  Object.entries(PII_PATTERNS).forEach(([type, pattern]) => {
    maskedText = maskedText.replace(pattern, (match) => {
      if (type === 'email') {
        const [local, domain] = match.split('@');
        return `${local.charAt(0)}***@${domain}`;
      } else if (type === 'creditCard') {
        // Mask all but last 4 digits, preserve format
        const originalFormat = match;
        const separators = originalFormat.match(/[-.\s]/g) || [];
        const digits = originalFormat.replace(/\D/g, '');
        const lastFour = digits.slice(-4);
        
        if (separators.length > 0) {
          return '****-****-****-' + lastFour;
        } else {
          return '*'.repeat(digits.length - 4) + lastFour;
        }
      } else if (type === 'phone' || type === 'japanesePhone') {
        return match.replace(/\d/g, '*');
      } else {
        return '*'.repeat(Math.min(match.length, 8));
      }
    });
  });

  return maskedText;
}

/**
 * オブジェクトから PII をマスク
 */
export function maskPIIInObject(obj: any): any {
  if (obj === null || obj === undefined) return obj;
  
  if (typeof obj === 'string') {
    return maskPIIInString(obj);
  }
  
  if (typeof obj === 'number' || typeof obj === 'boolean') {
    return obj;
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => maskPIIInObject(item));
  }
  
  if (typeof obj === 'object') {
    const masked: any = {};
    
    Object.keys(obj).forEach(key => {
      const lowerKey = key.toLowerCase();
      const isSensitiveKey = SENSITIVE_KEYS.some(sensitive => 
        lowerKey.includes(sensitive.toLowerCase())
      );
      
      if (isSensitiveKey) {
        masked[key] = '***MASKED***';
      } else {
        masked[key] = maskPIIInObject(obj[key]);
      }
    });
    
    return masked;
  }
  
  return obj;
}

/**
 * ログエントリの PII をマスク
 */
export function maskPII(data: any): any {
  try {
    return maskPIIInObject(data);
  } catch (error) {
    console.warn('PII masking failed:', error);
    return data;
  }
}

/**
 * URL から機密パラメータを除去
 */
export function maskSensitiveUrlParams(url: string): string {
  try {
    const urlObj = new URL(url);
    const sensitiveParams = ['token', 'key', 'password', 'auth', 'secret'];
    
    sensitiveParams.forEach(param => {
      if (urlObj.searchParams.has(param)) {
        urlObj.searchParams.set(param, '***MASKED***');
      }
    });
    
    return urlObj.toString();
  } catch {
    return url;
  }
}

/**
 * ユーザーエージェントから機密情報を除去
 */
export function maskUserAgent(userAgent: string): string {
  // バージョン番号は残しつつ、詳細な情報は除去
  return userAgent.replace(/\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g, 'IP_MASKED');
}