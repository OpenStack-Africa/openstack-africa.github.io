export type Category = 'payments' | 'messaging' | 'banking' | 'business-ops'

export interface Template {
  id: string
  title: string
  description: string
  category: Category
  apis: string[]
  path: string
  author: {
    name: string
    twitter?: string
  contributorId?: string
    location: string
  }
  tags: string[]
  n8n_version_min: string
  created_at: string
  downloads: number
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  readme?: string
}

export const templates: Template[] = [
  {
    id: 'paystack-webhook-slack',
    title: 'Paystack payment webhook to Slack',
    description: 'Get a real-time Slack notification whenever a Paystack payment is completed, failed, or refunded — with full transaction details including amount, customer email, and reference.',
    category: 'payments',
    apis: ['paystack', 'slack'],
    path: 'templates/payments/paystack-webhook-slack',
    author: { name: 'Chuka Onyekwere', twitter: 'chuukkaa_OG', location: 'Lagos, Nigeria', contributorId: 'chuka-onyekwere' },
    tags: ['webhook', 'notifications', 'paystack', 'slack', 'realtime'],
    n8n_version_min: '1.0.0',
    created_at: '2025-01-15',
    downloads: 0,
    difficulty: 'beginner',
  },
  {
    id: 'termii-otp-verification',
    title: 'Termii OTP send and verify flow',
    description: 'Full OTP send-and-verify workflow using Termii SMS. Generates a 6-digit code, stores it with a 10-minute expiry, and validates the user input against the stored code.',
    category: 'messaging',
    apis: ['termii'],
    path: 'templates/messaging/termii-otp-verification',
    author: { name: 'Chuka Onyekwere', twitter: 'chuukkaa_OG', location: 'Lagos, Nigeria', contributorId: 'chuka-onyekwere' },
    tags: ['otp', 'sms', 'termii', 'authentication', 'verification'],
    n8n_version_min: '1.0.0',
    created_at: '2025-01-15',
    downloads: 0,
    difficulty: 'intermediate',
  },
  {
    id: 'flutterwave-reconciliation-sheets',
    title: 'Flutterwave daily reconciliation to Google Sheets',
    description: 'Automatically pulls the previous day\'s Flutterwave transactions every morning at 8am and appends them to a Google Sheets reconciliation spreadsheet with status, amount, and customer data.',
    category: 'payments',
    apis: ['flutterwave', 'google-sheets'],
    path: 'templates/payments/flutterwave-reconciliation-sheets',
    author: { name: 'Chuka Onyekwere', twitter: 'chuukkaa_OG', location: 'Lagos, Nigeria', contributorId: 'chuka-onyekwere' },
    tags: ['reconciliation', 'flutterwave', 'google-sheets', 'scheduled', 'finance'],
    n8n_version_min: '1.0.0',
    created_at: '2025-01-15',
    downloads: 0,
    difficulty: 'intermediate',
  },
  {
    id: 'paystack-subscription-email',
    title: 'Paystack subscription lifecycle emails',
    description: 'Send branded emails on subscription creation, renewal, and cancellation via Paystack webhooks. Handles all subscription events with customizable email templates.',
    category: 'payments',
    apis: ['paystack', 'sendgrid'],
    path: 'templates/payments/paystack-subscription-email',
    author: { name: 'Adaeze Nwosu', location: 'Enugu, Nigeria', contributorId: 'adaeze-nwosu' },
    tags: ['subscription', 'email', 'paystack', 'lifecycle'],
    n8n_version_min: '1.0.0',
    created_at: '2025-01-20',
    downloads: 0,
    difficulty: 'beginner',
  },
  {
    id: 'whatsapp-support-triage',
    title: 'WhatsApp Business customer support triage',
    description: 'Routes incoming WhatsApp messages to the right support queue based on keyword matching. Escalates unresolved tickets to Slack after 2 hours of inactivity.',
    category: 'messaging',
    apis: ['whatsapp-business', 'notion', 'slack'],
    path: 'templates/messaging/whatsapp-support-triage',
    author: { name: 'Tunde Fashola', location: 'Lagos, Nigeria', contributorId: 'tunde-fashola' },
    tags: ['whatsapp', 'support', 'triage', 'automation'],
    n8n_version_min: '1.0.0',
    created_at: '2025-01-22',
    downloads: 0,
    difficulty: 'advanced',
  },
  {
    id: 'kuda-low-balance-alert',
    title: 'Kuda account low balance alert',
    description: 'Monitors a Kuda business account and sends Slack + SMS alerts when balance drops below a configurable threshold. Configurable check interval.',
    category: 'banking',
    apis: ['kuda', 'slack', 'termii'],
    path: 'templates/banking/kuda-low-balance-alert',
    author: { name: 'Emeka Ibe', location: 'Lagos, Nigeria', contributorId: 'emeka-ibe' },
    tags: ['kuda', 'banking', 'alerts', 'balance', 'monitoring'],
    n8n_version_min: '1.0.0',
    created_at: '2025-01-25',
    downloads: 0,
    difficulty: 'intermediate',
  },
  {
    id: 'moniepoint-transaction-airtable',
    title: 'Moniepoint POS transactions to Airtable',
    description: 'Captures every Moniepoint POS transaction via webhook and logs it to an Airtable base for real-time reporting and end-of-day reconciliation.',
    category: 'banking',
    apis: ['moniepoint', 'airtable'],
    path: 'templates/banking/moniepoint-transaction-airtable',
    author: { name: 'Amara Ike', location: 'Abuja, Nigeria', contributorId: 'amara-ike' },
    tags: ['moniepoint', 'pos', 'airtable', 'reconciliation'],
    n8n_version_min: '1.0.0',
    created_at: '2025-01-28',
    downloads: 0,
    difficulty: 'beginner',
  },
  {
    id: 'weekly-revenue-telegram',
    title: 'Weekly revenue summary to Telegram',
    description: 'Aggregates the week\'s Paystack transactions every Monday at 8am and posts a formatted revenue summary to a Telegram channel with totals, counts, and top customers.',
    category: 'business-ops',
    apis: ['paystack', 'telegram'],
    path: 'templates/business-ops/weekly-revenue-telegram',
    author: { name: 'Moses Otu', location: 'Abuja, Nigeria', contributorId: 'moses-otu' },
    tags: ['reporting', 'paystack', 'telegram', 'scheduled', 'revenue'],
    n8n_version_min: '1.0.0',
    created_at: '2025-02-01',
    downloads: 0,
    difficulty: 'beginner',
  },
]

export const categoryMeta: Record<Category, { label: string; icon: string; color: string }> = {
  'payments': { label: 'Payments', icon: '💳', color: '#00c896' },
  'messaging': { label: 'Messaging', icon: '📲', color: '#f5a623' },
  'banking': { label: 'Banking', icon: '🏦', color: '#4a90e2' },
  'business-ops': { label: 'Business Ops', icon: '🧾', color: '#e84393' },
}

export const difficultyMeta = {
  beginner: { label: 'Beginner', color: '#00c896' },
  intermediate: { label: 'Intermediate', color: '#f5a623' },
  advanced: { label: 'Advanced', color: '#e84393' },
}
