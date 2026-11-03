import { z } from 'zod';

// ---------------------------------------------------------------------
// Schema
// ---------------------------------------------------------------------
export const exploreFormSchema = z.object({
  fullName: z
    .string()
    .min(2, 'Full name must be at least 2 characters')
    .max(50, 'Full name must not exceed 50 characters')
    .regex(/^[a-zA-Z\s.'-]+$/, 'Name cannot contain numbers'),
  countryCode: z.string().min(1, 'Country code is required'),
  phone: z
    .string()
    .min(1, 'Phone number is required')
    .refine((val) => {
      const trimmed = val.trim();
      if (!trimmed) return false;
      if (!/^[\d\s\-()+]+$/.test(trimmed)) return false;
      const digits = trimmed.replace(/\D/g, '');
      return digits.length >= 7 && digits.length <= 15;
    }, 'Please enter a valid phone number (7-15 digits)'),
  gender: z.string().min(1, 'Please select your gender'),
  email: z.string().email('Please enter a valid email address').optional().or(z.literal('')),
  dob: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Please select a valid date of birth (YYYY-MM-DD)')
    .optional()
    .or(z.literal('')),
  raw_country: z.string().max(50).optional().or(z.literal('')),
  raw_state: z.string().max(50).optional().or(z.literal('')),
  raw_city: z.string().max(50).optional().or(z.literal('')),
  temp_lead_source: z.string().optional().or(z.literal('')),

  careChoice: z.string().optional().or(z.literal('')),
  selectedOption: z.string().optional().or(z.literal('')),
  unclear_health_description: z.string().optional().or(z.literal('')),
  extra_notes: z.string().optional().or(z.literal('')),
});

export type ExploreFormData = z.infer<typeof exploreFormSchema>;

export const STEP1_FIELDS = [
  'fullName',
  'countryCode',
  'phone',
  'gender',
  'email',
  'dob',
  'raw_country',
  'raw_state',
  'raw_city',
  'temp_lead_source',
] as const;

// ---------------------------------------------------------------------
// Option lists
// ---------------------------------------------------------------------
export const genderOptions = ['Female', 'Male', 'Prefer not to say'] as const;

export const femaleOptions = [
  'I am a teenager and want to understand my body and periods',
  'I want to improve my overall health, lifestyle, and cycle',
  'I just want a doctor and guidance for my health',
  'I have PCOS, irregular periods, or hormone issues',
  'I am married and want to prepare my body before pregnancy',
  'I am getting married soon and want to prepare my body for a healthy pregnancy',
  'We are trying to conceive',
  'We have been trying for a while but no success',
  'We are planning pregnancy and want to prepare together',
];

export const maleOptions = [
  'I want to improve my overall health, energy, and lifestyle',
  'I feel low energy, stressed, or not physically at my best',
  'I just want a personal doctor for guidance',
  'I have sexual health or testosterone concerns',
  'I have fertility issues or poor sperm reports',
  'I am getting married soon and want to prepare my health for good performance and future fatherhood',
  'We are planning for a baby',
  'We are trying to conceive',
  'We have been trying for a while but no success',
  'We are planning pregnancy and want to prepare together',
];

export const coupleOptions = [
  'We are planning pregnancy and want to prepare together',
  'We are trying to conceive',
  'We have been trying for a while but no success',
];

export const careChoices = ["Women's health", "Men's health", 'Care for us as a couple'] as const;

export const leadSourceOptions = [
  'Instagram',
  'Facebook',
  'Google Search',
  'Friend / Family Referral',
  'Doctor / Healthcare Professional',
  'LinkedIn',
  'YouTube',
  'Other',
];

export const countryCodeOptions = [
  { code: '+91', country: 'IN', label: '+91 (India)' },
  { code: '+1', country: 'US', label: '+1 (US/CA)' },
  { code: '+44', country: 'UK', label: '+44 (UK)' },
  { code: '+971', country: 'AE', label: '+971 (UAE)' },
  { code: '+65', country: 'SG', label: '+65 (Singapore)' },
  { code: '+61', country: 'AU', label: '+61 (Australia)' },
  { code: '+49', country: 'DE', label: '+49 (Germany)' },
];

// ---------------------------------------------------------------------
// Plan mapping
// ---------------------------------------------------------------------
export interface PlanMeta {
  planName: string;
  planCode: string;
  route: string;
}

const plan = (name: string, code = name, route = `/${code.toLowerCase()}`): PlanMeta => ({
  planName: name,
  planCode: code,
  route,
});

export const HEALTH_OPTION_PLAN_MAP: Record<string, PlanMeta> = {
  // Female
  'I am a teenager and want to understand my body and periods': plan('LUNA'),
  'I want to improve my overall health, lifestyle, and cycle': plan('LYRA'),
  'I just want a doctor and guidance for my health': plan('LYRA'),
  'I have PCOS, irregular periods, or hormone issues': plan('CALA'),
  'I am married and want to prepare my body before pregnancy': plan('EVE'),
  'I am getting married soon and want to prepare my body for a healthy pregnancy': plan('EVE'),
  'We are trying to conceive': plan('VITA'),
  'We have been trying for a while but no success': plan('VITA'),
  'We are planning pregnancy and want to prepare together': plan('EVE + GENESIS', 'EVE-GENESIS', '/eve-genesis'),
  // Male
  'I want to improve my overall health, energy, and lifestyle': plan('CORE'),
  'I feel low energy, stressed, or not physically at my best': plan('CORE'),
  'I just want a personal doctor for guidance': plan('CORE'),
  'I have sexual health or testosterone concerns': plan('ATLAS'),
  'I have fertility issues or poor sperm reports': plan('ATLAS'),
  'I am getting married soon and want to prepare my health for good performance and future fatherhood': plan('GENESIS'),
  'We are planning for a baby': plan('VITA'),
  'We are trying for a baby': plan('VITA'),
};

/** Which option list (and heading) to show on step 2. */
export function getHealthOptions(gender: string, careChoice: string) {
  if (gender === 'Female') return { options: femaleOptions, heading: 'Female Health Options' };
  if (gender === 'Male') return { options: maleOptions, heading: 'Male Health Options' };
  if (gender === 'Prefer not to say') {
    if (careChoice === "Women's health") return { options: femaleOptions, heading: "Women's Health Options" };
    if (careChoice === "Men's health") return { options: maleOptions, heading: "Men's Health Options" };
    if (careChoice === 'Care for us as a couple') return { options: coupleOptions, heading: 'Couple Care Options' };
  }
  return null;
}
