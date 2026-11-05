import axios, { AxiosError } from 'axios';

// ---------------------------------------------------------------------------
// Base Configuration
// ---------------------------------------------------------------------------
export const JOYZEN_API_BASE_URL =
  process.env.NEXT_PUBLIC_JOYZEN_API_URL || 'https://api.joyzen.in/api/v1';

export const JOYZEN_APP_URL =
  process.env.NEXT_PUBLIC_JOYZEN_APP_URL ?? 'http://localhost:3000/';

export const joyzenClient = axios.create({
  baseURL: JOYZEN_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// ---------------------------------------------------------------------------
// TypeScript Interfaces
// ---------------------------------------------------------------------------
export type GenderType = 'MALE' | 'FEMALE' | 'OTHER';

export interface CreateLeadPayload {
  name: string;
  phone: string;
  gender: GenderType;
  email?: string;
  dob?: string;
  plan_code?: string;
  temp_lead_source?: string;
  raw_country?: string;
  raw_state?: string;
  raw_city?: string;
  clear_health_description?: string;
  unclear_health_description?: string;
  extra_notes?: string;
  interested_for?: 'reproductive_care' | 'general_care' | string;
  interested_category?: string;
  is_needs_clarity?: boolean;
}

export interface CreateFollowupPayload {
  leadId: string;
  followupAt: string;
  concern?: string;
}

export interface FollowupResponseData {
  id: string;
  followupAt: string;
  [key: string]: unknown;
}

export interface LeadResponseData {
  id: string;
  name?: string;
  phone?: string;
  gender?: string;
  email?: string;
  plan_code?: string;
  [key: string]: unknown;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export interface ApiErrorBody {
  code?: string;
  message: string | string[];
  traceId?: string;
}

export interface PlanVariantFeature {
  featureId?: string;
  limit?: number | null;
  limitPeriod?: string;
  isActive?: boolean;
}

export interface PlanVariant {
  id: string;
  variantLabel: string;
  price: number;
  durationInDays: number;
  billingType: 'ONE_TIME' | 'RECURRING';
  isActive: boolean;
  features?: PlanVariantFeature[];
}

export interface SystemPlan {
  baseName: string;
  code: string;
  description?: string;
  variants: PlanVariant[];
}

export interface TrialOffer {
  id: string;
  name: string;
  description?: string;
  price: number;
  currency: string;
  durationInDays: number;
}

export interface SystemPlanData {
  subscriptionPlans: SystemPlan[];
  trial: TrialOffer | null;
}

export interface CheckoutResponseData {
  paymentLinkId: string;
  razorpayKeyId: string;
  razorpayOrderId?: string | null;
  razorpaySubscriptionId?: string | null;
  amount: number;
  currency: string;
  planName: string;
  prefill: {
    name?: string;
    email?: string;
    contact?: string;
  };
}

export interface CheckoutPayload {
  subscriptionPlanId: string;
  leadId: string;
  acceptedTerms: boolean;
  futurePlanCode?: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
export function formatApiError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const errData = error.response?.data as ApiErrorBody | undefined;
    if (errData?.message) {
      if (Array.isArray(errData.message)) {
        return errData.message.join(', ');
      }
      return errData.message;
    }
    if (error.response?.status === 409) {
      return 'This phone number or email is already registered. Please reach out to our care team.';
    }
    if (error.response?.status === 404) {
      return 'Requested resource not found.';
    }
    return error.message || 'An unexpected error occurred while communicating with Joyzen services.';
  }
  return error instanceof Error ? error.message : 'An unknown error occurred.';
}

/**
 * Filter out undefined, null, or empty string values from payload
 * as required by the Joyzen public API.
 */
export function cleanPayload<T extends object>(data: T): Partial<T> {
  const result: Partial<T> = {};
  for (const [key, value] of Object.entries(data)) {
    if (value !== undefined && value !== null && value !== '') {
      result[key as keyof T] = value as T[keyof T];
    }
  }
  return result;
}

// ---------------------------------------------------------------------------
// API Methods
// ---------------------------------------------------------------------------

/**
 * 1. Create a public lead
 * POST /leads/public
 */
export async function createLead(payload: CreateLeadPayload): Promise<LeadResponseData> {
  const cleaned = cleanPayload(payload);
  const response = await joyzenClient.post<ApiResponse<LeadResponseData>>(
    '/leads/public',
    cleaned
  );
  return response.data.data;
}

/**
 * 2. Fetch system plan durations and trial offer
 * GET /subscription-plans/system-plans/:code?leadId=...
 */
export async function fetchSystemPlan(
  code: string,
  leadId?: string | null
): Promise<SystemPlanData> {
  const params = leadId ? { leadId } : {};
  const response = await joyzenClient.get<ApiResponse<SystemPlanData>>(
    `/subscription-plans/system-plans/${encodeURIComponent(code)}`,
    { params }
  );
  return response.data.data;
}

/**
 * 3. Start Checkout
 * POST /payment-links/public/checkout
 */
export async function createPublicCheckout(
  payload: CheckoutPayload
): Promise<CheckoutResponseData> {
  const response = await joyzenClient.post<ApiResponse<CheckoutResponseData>>(
    '/payment-links/public/checkout',
    payload
  );
  return response.data.data;
}

/**
 * 4. Schedule a Call-back / Follow-up Request
 * POST /leads/public/followup
 */
export async function createFollowup(
  payload: CreateFollowupPayload
): Promise<FollowupResponseData> {
  const cleaned = cleanPayload(payload);
  const response = await joyzenClient.post<ApiResponse<FollowupResponseData>>(
    '/leads/public/followup',
    cleaned
  );
  return response.data.data;
}

// ---------------------------------------------------------------------------
// Razorpay Modal Integration
// ---------------------------------------------------------------------------
let razorpayScriptPromise: Promise<boolean> | null = null;

export function loadRazorpayScript(): Promise<boolean> {
  if (typeof window === 'undefined') return Promise.resolve(false);
  if ((window as unknown as { Razorpay?: unknown }).Razorpay) return Promise.resolve(true);

  if (razorpayScriptPromise) return razorpayScriptPromise;

  razorpayScriptPromise = new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => {
      razorpayScriptPromise = null;
      resolve(false);
    };
    document.body.appendChild(script);
  });

  return razorpayScriptPromise;
}

export async function openRazorpayCheckout(
  checkout: CheckoutResponseData,
  onCancel: () => void
): Promise<void> {
  const isLoaded = await loadRazorpayScript();
  if (!isLoaded) {
    throw new Error('Payment gateway could not be loaded. Please check your internet connection.');
  }

  const Razorpay = (window as unknown as { Razorpay: new (opts: unknown) => { open: () => void } }).Razorpay;
  if (!Razorpay) {
    throw new Error('Razorpay SDK unavailable.');
  }

  // Persist order metadata in session storage for reliable retrieval on success page
  try {
    sessionStorage.setItem(
      'joyzen_last_order',
      JSON.stringify({
        paymentLinkId: checkout.paymentLinkId,
        planName: checkout.planName,
        amount: checkout.amount,
        currency: checkout.currency || 'INR',
        timestamp: Date.now(),
      })
    );
  } catch {
    /* storage might be restricted in private browsing mode */
  }

  const razorpayInstance = new Razorpay({
    key: checkout.razorpayKeyId,
    name: 'JOYZEN',
    description: checkout.planName,
    prefill: {
      name: checkout.prefill?.name,
      email: checkout.prefill?.email || undefined,
      contact: checkout.prefill?.contact,
    },
    ...(checkout.razorpaySubscriptionId
      ? { subscription_id: checkout.razorpaySubscriptionId }
      : {
          order_id: checkout.razorpayOrderId,
          amount: Math.round(checkout.amount * 100), // convert to paise
          currency: checkout.currency,
        }),
    handler: () => {
      // Payment completed: redirect to Joyzen success page with full order details
      const params = new URLSearchParams({
        paymentLinkId: checkout.paymentLinkId,
        planName: checkout.planName,
        amount: String(checkout.amount),
        currency: checkout.currency || 'INR',
      });
      const baseAppUrl = JOYZEN_APP_URL.replace(/\/+$/, '');
      const redirectUrl = `${baseAppUrl}/payment/success?${params.toString()}`;
      window.location.assign(redirectUrl);
    },
    modal: {
      ondismiss: onCancel,
    },
  });

  razorpayInstance.open();
}

