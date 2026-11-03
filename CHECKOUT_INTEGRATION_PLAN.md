# Joyzen Public Plan Checkout Integration Plan

This plan details the full implementation of the lead capture form in `components/forms/exploreform.tsx`, the lead creation API (`POST /leads/public`), session storage persistence of `lead_id`, dynamic routing to program pages, and the Razorpay public checkout integration in `membership.tsx` according to the [Joyzen Public Plan Checkout API Guide](file:///C:/Users/thein/Downloads/Joyzen-Public-Plan-Checkout-API-Guide-Short%201.pdf).

---

## 1. Architecture & End-to-End Flow

```
[ Visitor ]
    │
    ▼
Step 1: Explore Form (`components/forms/exploreform.tsx`)
    ├── Full name (`name`, required)
    ├── Phone with country code (`phone`, required, e.g. +919876543210)
    ├── Gender (`gender`: MALE | FEMALE | OTHER, required)
    ├── Email (`email`, optional)
    ├── Date of Birth (`dob`: YYYY-MM-DD, optional)
    ├── Location: Country (`raw_country`), State (`raw_state`), City (`raw_city`)
    └── How did you hear about us? (`temp_lead_source` dropdown)
    │
    ▼
Step 2: Tailored Health Needs
    ├── Gender-specific health concern list (female-plan.txt, male-plan.txt, prefer-not-to-say.txt)
    ├── Selected option determines `plan_code` (e.g. LUNA, CALA, CORE, ATLAS, etc.)
    ├── Main health concern (`clear_health_description`)
    ├── Unclear about concern (`unclear_health_description` textarea)
    └── Message / Extra notes (`extra_notes` textarea)
    │
    ▼
Submit Form &rarr; Axios API Call: `POST https://api.joyzen.in/api/v1/leads/public`
    ├── Clean payload: only non-empty fields sent
    ├── On Success: Extract `data.id` (Lead ID)
    ├── Security: Store strictly `lead_id` in `sessionStorage.setItem('joyzen_lead_id', data.id)`
    │   (NO sensitive PII like phone, email, health notes stored in browser storage)
    └── Route to Program Page: `router.push('/' + targetRoute)` (e.g., `/luna`, `/cala`, `/atlas`)
    │
    ▼
Program Page &rarr; Membership Section (`ProgramMembership.tsx`)
    ├── Read `lead_id` from `sessionStorage`
    ├── Axios API Call: `GET /subscription-plans/system-plans/:code?leadId=<leadId>`
    ├── Display trial card (if offered, e.g. "Start with a 14-day trial · ₹300")
    │
    ▼
User clicks "Choose Plan" / "Start Trial"
    ├── Axios API Call: `POST /payment-links/public/checkout`
    │   └── Body: `{ subscriptionPlanId, leadId, acceptedTerms: true, futurePlanCode? }`
    ├── Receive checkout data: `razorpayKeyId`, `order_id` / `subscription_id`, `amount`, `paymentLinkId`
    ├── Open Razorpay popup via `https://checkout.razorpay.com/v1/checkout.js`
    └── On Payment Success:
        Redirect full page via `window.location.assign('https://web.joyzen.in/payment/success?paymentLinkId=' + paymentLinkId)`
```

---

## 2. Security & Clean Code Principles

1. **Security & Data Privacy (HIPAA / Healthcare Compliance)**:
   - **Strictly `lead_id` in `sessionStorage`**: No Personally Identifiable Information (name, email, phone number) or sensitive health descriptions will be stored in client-side storage (`localStorage` / `sessionStorage`).
   - The `lead_id` is a transient opaque identifier used strictly to authenticate the checkout and retrieve eligible plan durations/trials.
   - Clean up on session expiry / logout / error.

2. **Clean Code & Modularity**:
   - Centralized Axios client in `lib/joyzenApi.ts` configured with base URL, standard timeout, and JSON headers.
   - Fully typed TypeScript interfaces for lead creation, subscription plans, checkout responses, and API error envelopes.
   - Consistent error handling parsing `{ code, message, traceId }` to show meaningful user feedback while avoiding leaking internal stack traces.

---

## 3. Component 1: Explore Form (`components/forms/exploreform.tsx`)

### 3.1 Step 1 Modifications (Basic Information & Location)
- **`name`** (Full Name): Text input, required, minimum 3 characters.
- **`phone`** (Phone Number): Phone input with country code selector (`+91` default), required, validated E.164 format.
- **`gender`**: Custom glass dropdown with options `Female` (maps to `FEMALE`), `Male` (maps to `MALE`), and `Prefer not to say` (maps to `OTHER`).
- **`email`**: Email input, optional.
- **`dob`**: Date of birth input (`YYYY-MM-DD`), optional.
- **`raw_country`**: Country text input (defaults to "India" or user input), optional.
- **`raw_state`**: State text input, optional.
- **`raw_city`**: City text input, optional.
- **`temp_lead_source`**: "How did you hear about us?" custom glass dropdown with options:
  - `Instagram`
  - `Facebook`
  - `Google Search`
  - `Friend / Family Referral`
  - `Doctor / Healthcare Professional`
  - `LinkedIn`
  - `YouTube`
  - `Other`

### 3.2 Step 2 Modifications (Tailored Needs & Health Description)
- Present health concern options depending on gender:
  - **Female**: 9 options from `female-plan.txt`
  - **Male**: 10 options from `male-plan.txt`
  - **Prefer not to say**: Choice selector with 3 categories from `prefer-not-to-say.txt`:
    1. *Women's health* (9 female options)
    2. *Men's health* (10 male options)
    3. *Care for us as a couple* (3 couple options)
- Display a plan badge on each option pill (`LUNA`, `CORE`, `CALA`, `EVE`, `VITA`, etc.).
- When an option is selected:
  - `clear_health_description` is set to the selected text.
  - `plan_code` is mapped to the corresponding system plan code.
- Additional textareas:
  - **`unclear_health_description`**: "Unclear about concern" / "Tell us in your own words what you are experiencing" (textarea).
  - **`extra_notes`**: "Message" / "Any other notes" (textarea).

### 3.3 Step 3 / Submission Handling & Lead Creation via Axios
- When submitting:
  1. Build the payload omitting any empty strings or undefined keys:
     ```json
     {
       "name": "Rahul Sharma",
       "phone": "+919876543210",
       "gender": "MALE",
       "email": "rahul@example.com",
       "dob": "1995-04-12",
       "plan_code": "CORE",
       "temp_lead_source": "Instagram",
       "raw_country": "India",
       "raw_state": "Karnataka",
       "raw_city": "Bengaluru",
       "clear_health_description": "I want to improve my overall health, energy, and lifestyle",
       "unclear_health_description": "Feeling sluggish in the afternoons",
       "extra_notes": "Prefer weekend calls"
     }
     ```
  2. Send request using `apiClient.post('/leads/public', payload)`.
  3. On success (`200` / `201`):
     - Extract `leadId = response.data.data.id`.
     - Save to session storage:
       ```ts
       sessionStorage.setItem('joyzen_lead_id', leadId);
       ```
     - Navigate to program route using Next.js `useRouter`:
       ```ts
       router.push(targetRoute); // e.g. /luna, /cala, /core
       ```
  4. On error:
     - `400 BAD_REQUEST`: Show validation message from API response (`response.data.message`).
     - `409 PHONE_ALREADY_EXISTS / EMAIL_ALREADY_EXISTS`: Show dedicated notice: *"This phone or email is already registered with Joyzen. Please contact our care team or continue with your consultation."*

---

## 4. Plan Code & Route Mapping Matrix

| Gender / Focus | Option Description | Plan Shown | `plan_code` | Program Route |
|---|---|---|---|---|
| **Female** | I am a teenager and want to understand my body and periods | LUNA | `LUNA` | `/luna` |
| **Female** | I want to improve my overall health, lifestyle, and cycle | LYRA | `LYRA` | `/lyra` |
| **Female** | I just want a doctor and guidance for my health | LYRA | `LYRA` | `/lyra` |
| **Female** | I have PCOS, irregular periods, or hormone issues | CALA | `CALA` | `/cala` |
| **Female** | I am married and want to prepare my body before pregnancy | EVE | `EVE` | `/eve` |
| **Female** | I am getting married soon and want to prepare my body for a healthy pregnancy | EVE | `EVE` | `/eve` |
| **Female / Couple** | We are trying to conceive | VITA | `VITA` | `/vita` |
| **Female / Couple** | We have been trying for a while but no success | VITA | `VITA` | `/vita` |
| **Female / Couple** | We are planning pregnancy and want to prepare together | EVE + GENESIS | `EVE-GENESIS` | `/eve-genesis` |
| **Male** | I want to improve my overall health, energy, and lifestyle | CORE | `CORE` | `/core` |
| **Male** | I feel low energy, stressed, or not physically at my best | CORE | `CORE` | `/core` |
| **Male** | I just want a personal doctor for guidance | CORE | `CORE` | `/core` |
| **Male** | I have sexual health or testosterone concerns | ATLAS | `ATLAS` | `/atlas` |
| **Male** | I have fertility issues or poor sperm reports | ATLAS | `ATLAS` | `/atlas` |
| **Male** | I am getting married soon and want to prepare my health for good performance and future fatherhood | GENESIS | `GENESIS` | `/genesis` |
| **Male** | We are planning for a baby | VITA | `VITA` | `/vita` |
| **Male / Couple** | We are trying to conceive | VITA | `VITA` | `/vita` |
| **Male / Couple** | We have been trying for a while but no success | VITA | `VITA` | `/vita` |
| **Male / Couple** | We are planning pregnancy and want to prepare together | EVE + GENESIS | `EVE-GENESIS` | `/eve-genesis` |

---

## 5. Component 2: Membership & Razorpay Checkout Integration

### 5.1 Centralized Axios Client & Checkout Utility (`lib/joyzenApi.ts`)
Create a central utility encapsulating all network operations via Axios:
1. **Axios Client**:
   ```ts
   import axios from 'axios';

   export const apiClient = axios.create({
     baseURL: process.env.NEXT_PUBLIC_JOYZEN_API_URL || 'https://api.joyzen.in/api/v1',
     headers: {
       'Content-Type': 'application/json',
     },
     timeout: 15000,
   });
   ```
2. **Methods**:
   - `createLead(leadData)`: Calls `apiClient.post('/leads/public', cleanPayload)`.
   - `fetchSystemPlan(code: string, leadId?: string)`: Calls `apiClient.get(`/subscription-plans/system-plans/${encodeURIComponent(code)}`, { params: { leadId } })`.
   - `createPublicCheckout(subscriptionPlanId: string, leadId: string, futurePlanCode?: string)`: Calls `apiClient.post('/payment-links/public/checkout', body)`.
   - `loadRazorpayScript()`: Dynamically loads `https://checkout.razorpay.com/v1/checkout.js`.
   - `openRazorpayCheckout(checkoutData, onCancel)`: Initializes `new (window as any).Razorpay({...})` as specified in Section 5 of the API guide.

### 5.2 Membership Section Updates (`reuseable/ProgramMembership.tsx`)
- On component mount:
  1. Retrieve `leadId` from `sessionStorage.getItem('joyzen_lead_id')`.
  2. If `leadId` is available, call `fetchSystemPlan(data.programKey, leadId)` to fetch active variants & trial.
  3. If a trial offer exists (`trial`), render a dedicated glassmorphic trial banner above duration tabs:
     *"Start with a 14-day trial · ₹300 — Try the full program before committing."*
- When visitor clicks the plan CTA button (e.g., `START MONTHLY`, `CHOOSE 3 MONTHS`, `CHOOSE 6 MONTHS`, or `START TRIAL`):
  1. Check if `leadId` exists in `sessionStorage`:
     - If missing: Show a prompt modal or redirect to `/q-form?plan=<programKey>` so they can enter their details first.
  2. If `leadId` exists:
     - Set loading state on the button.
     - Call `createPublicCheckout` via Axios:
       - If standard duration: `{ subscriptionPlanId: variant.id, leadId, acceptedTerms: true }`.
       - If trial: `{ subscriptionPlanId: trial.id, leadId, acceptedTerms: true, futurePlanCode: programKey.toUpperCase() }`.
     - When checkout data returns, invoke `openRazorpayCheckout`:
       - On payment success: Redirect to `https://web.joyzen.in/payment/success?paymentLinkId=${paymentLinkId}`.
       - On popup dismiss / cancel: Reset loading state so the visitor can retry.
     - Error handling:
       - `404 BUYER_NOT_FOUND`: Clear `joyzen_lead_id` and redirect to `/q-form`.
       - `400 TRIAL_ALREADY_USED`: Hide trial card and inform visitor.
       - `429 TOO_MANY_CHECKOUT_ATTEMPTS`: Prompt visitor to wait a moment.

---

## 6. Files to Create & Update

| File | Action | Purpose |
|---|---|---|
| `lib/joyzenApi.ts` | **Create** | Axios API client for leads, system-plans, checkout, and Razorpay checkout helper |
| `components/forms/exploreform.tsx` | **Modify** | Add Step 1 fields (phone, country, state, city, lead source), Step 2 plan-code mapping, Axios submission to `/leads/public`, save `lead_id` to `sessionStorage`, and route to program |
| `reuseable/ProgramMembership.tsx` | **Modify** | Integrate dynamic trial & variants loading via Axios, checkout CTA handler with Razorpay popup, and redirect to payment success page |
| `components/plan-and-pricing/form.tsx` | **Maintain** | Consistency with `female-plan.txt`, `male-plan.txt`, and `prefer-not-to-say.txt` routing mappings |

---

## 7. Verification Checklist

1. **Security Verification**:
   - Confirm only `lead_id` is stored in `sessionStorage`.
   - Confirm no PII (phone, email, name, concerns) is persisted in browser storage.
2. **Axios Client Verification**:
   - Submissions made via Axios instance with proper Content-Type and error interception.
   - Clean payload sent (only non-empty fields).
3. **Explore Form Step 1 & 2**:
   - Phone with country code formatted as E.164 (`+919876543210`).
   - Dropdown selections for lead source, gender, and health concerns work smoothly.
4. **Lead API & Routing**:
   - `POST /leads/public` succeeds, saves `lead_id` in `sessionStorage`, and routes to `/luna`, `/core`, `/cala`, etc.
5. **Membership & Razorpay**:
   - Program page loads plan durations from API.
   - Clicking Choose Plan calls checkout API and opens Razorpay modal.
   - On payment completion, redirects to `https://web.joyzen.in/payment/success?paymentLinkId=...`.
