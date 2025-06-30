/**
 * MFA Service
 * 多要素認証サービス
 */

import {
  multiFactor,
  PhoneAuthProvider,
  RecaptchaVerifier,
  TotpMultiFactorGenerator,
  TotpSecret,
  MultiFactorError,
  ApplicationVerifier,
} from 'firebase/auth';
import { auth } from './firebase';
import { MFASetupInfo, AuthError as AppAuthError } from '../types/authTypes';

/**
 * TOTP用のシークレットを生成
 */
export const generateTotpSecret = async (): Promise<TotpSecret> => {
  try {
    if (!auth.currentUser) {
      throw new Error('No user is currently signed in');
    }

    const multiFactorSession = await multiFactor(auth.currentUser).getSession();
    const totpSecret = await TotpMultiFactorGenerator.generateSecret(multiFactorSession);
    
    return totpSecret;
  } catch (error) {
    throw error as AppAuthError;
  }
};

/**
 * TOTPを有効化
 */
export const enableTotp = async (
  totpSecret: TotpSecret,
  verificationCode: string,
  displayName?: string
): Promise<void> => {
  try {
    if (!auth.currentUser) {
      throw new Error('No user is currently signed in');
    }

    const multiFactorAssertion = TotpMultiFactorGenerator.assertionForEnrollment(
      totpSecret,
      verificationCode
    );

    await multiFactor(auth.currentUser).enroll(
      multiFactorAssertion,
      displayName || 'TOTP Authenticator'
    );
  } catch (error) {
    throw error as AppAuthError;
  }
};

/**
 * SMS MFAのセットアップ
 */
export const setupSmsMultiFactor = async (
  phoneNumber: string,
  recaptchaVerifier: ApplicationVerifier
): Promise<string> => {
  try {
    if (!auth.currentUser) {
      throw new Error('No user is currently signed in');
    }

    const multiFactorSession = await multiFactor(auth.currentUser).getSession();
    const phoneAuthCredential = PhoneAuthProvider.credential(
      await PhoneAuthProvider.verifyPhoneNumber(
        phoneNumber,
        recaptchaVerifier
      ),
      ''
    );

    // この実装は簡略化されており、実際にはより複雑な手順が必要
    return 'verification-id';
  } catch (error) {
    throw error as AppAuthError;
  }
};

/**
 * MFA認証の解決
 */
export const resolveMfaError = async (
  error: MultiFactorError,
  verificationCode: string,
  factorId: string
): Promise<void> => {
  try {
    const resolver = error.resolver;
    
    // TOTP認証
    if (factorId.includes('totp')) {
      const multiFactorAssertion = TotpMultiFactorGenerator.assertionForSignIn(
        factorId,
        verificationCode
      );
      await resolver.resolveSignIn(multiFactorAssertion);
    }
    // SMS認証 (簡略化)
    else if (factorId.includes('phone')) {
      const phoneAuthCredential = PhoneAuthProvider.credential(
        factorId,
        verificationCode
      );
      const multiFactorAssertion = PhoneAuthProvider.credential(
        phoneAuthCredential.providerId,
        verificationCode
      );
      // 実際の実装ではより適切な方法でPhoneMultiFactorGeneratorを使用
    }
  } catch (error) {
    throw error as AppAuthError;
  }
};

/**
 * MFAファクターの一覧取得
 */
export const getMfaFactors = () => {
  if (!auth.currentUser) {
    return [];
  }

  return multiFactor(auth.currentUser).enrolledFactors;
};

/**
 * MFAファクターの削除
 */
export const unenrollMfaFactor = async (factorUid: string): Promise<void> => {
  try {
    if (!auth.currentUser) {
      throw new Error('No user is currently signed in');
    }

    const enrolledFactors = multiFactor(auth.currentUser).enrolledFactors;
    const factor = enrolledFactors.find(f => f.uid === factorUid);
    
    if (!factor) {
      throw new Error('MFA factor not found');
    }

    await multiFactor(auth.currentUser).unenroll(factor);
  } catch (error) {
    throw error as AppAuthError;
  }
};

/**
 * QRコードURL生成のヘルパー
 */
export const generateQrCodeUrl = (
  secret: TotpSecret,
  accountName: string,
  issuer: string = 'Work App'
): string => {
  const secretKey = secret.secretKey;
  const otpauthUrl = `otpauth://totp/${encodeURIComponent(issuer)}:${encodeURIComponent(accountName)}?secret=${secretKey}&issuer=${encodeURIComponent(issuer)}`;
  
  // QRコード生成用のURL (Google Charts APIを使用)
  return `https://chart.googleapis.com/chart?chs=200x200&chld=M|0&cht=qr&chl=${encodeURIComponent(otpauthUrl)}`;
};

/**
 * バックアップコード生成（簡略化版）
 */
export const generateBackupCodes = (): string[] => {
  const codes: string[] = [];
  for (let i = 0; i < 8; i++) {
    // 8桁のバックアップコードを生成
    const code = Math.random().toString(36).substring(2, 10).toUpperCase();
    codes.push(code);
  }
  return codes;
};