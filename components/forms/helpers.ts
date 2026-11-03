import type { GenderType } from '@/lib/joyzenApi';

/** Builds "+91XXXXXXXXXX" and removes a duplicated country code / leading zero. */
export function buildFullPhone(countryCode: string, phone: string): string {
  let digits = phone.replace(/[\s\-().]/g, '');
  const dial = countryCode.replace('+', '');

  if (digits.startsWith(`+${dial}`)) {
    digits = digits.slice(dial.length + 1);
  } else if (digits.startsWith(dial) && digits.length > 10) {
    digits = digits.slice(dial.length);
  } else if (digits.startsWith('0')) {
    digits = digits.slice(1);
  }
  digits = digits.replace(/^\+/, '');
  return `${countryCode}${digits}`;
}

export function mapGender(gender: string): GenderType {
  if (gender === 'Female') return 'FEMALE';
  if (gender === 'Male') return 'MALE';
  return 'OTHER';
}
