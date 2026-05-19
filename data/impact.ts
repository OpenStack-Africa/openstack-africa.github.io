// Average hours saved per template download (conservative estimates)
export const hoursPerTemplate: Record<string, number> = {
  'paystack-webhook-slack': 2,
  'termii-otp-verification': 4,
  'flutterwave-reconciliation-sheets': 5,
  'paystack-subscription-email': 3,
  'whatsapp-support-triage': 6,
  'kuda-low-balance-alert': 2,
  'moniepoint-transaction-airtable': 3,
  'weekly-revenue-telegram': 2,
}

export const DEFAULT_HOURS_SAVED = 3

// Weekly hours saved if workflow is used regularly
export const weeklyHoursPerTemplate: Record<string, number> = {
  'paystack-webhook-slack': 3,
  'termii-otp-verification': 5,
  'flutterwave-reconciliation-sheets': 6,
  'paystack-subscription-email': 4,
  'whatsapp-support-triage': 8,
  'kuda-low-balance-alert': 2,
  'moniepoint-transaction-airtable': 4,
  'weekly-revenue-telegram': 2,
}
