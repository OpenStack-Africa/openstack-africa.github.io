export const readmes: Record<string, string> = {
  'paystack-webhook-slack': `## What this does
Listens for Paystack payment events via webhook and sends a formatted Slack notification in real time. Handles successful payments, failed charges, and refunds — each with the customer name, email, amount, reference, and payment channel.

## Prerequisites
- n8n instance (self-hosted or cloud)
- Paystack account with webhook access
- Slack workspace with an incoming webhook URL

## Setup
1. Import the workflow into n8n
2. Copy the webhook URL from the Webhook node
3. In your Paystack dashboard → Settings → Webhooks → add the copied URL
4. Create a Slack credential in n8n: Settings → Credentials → Slack → add your webhook URL
5. Activate the workflow

## How it works
The **Webhook** node receives POST requests from Paystack on every payment event. The **If** node checks whether the event is a successful charge. If yes, the **Format Payment Data** node extracts and formats the transaction details. The **Slack** node sends a rich block message to your chosen channel. Non-success events are logged separately for debugging.

## Example use case
A Lagos-based e-commerce store uses this to notify their operations team on Slack every time a customer completes a purchase, so they can start order fulfilment immediately without checking the Paystack dashboard.`,

  'termii-otp-verification': `## What this does
A complete two-endpoint OTP system. The first endpoint generates a 6-digit code and sends it to a phone number via Termii SMS. The second endpoint verifies the submitted code against the stored one, with a 10-minute expiry and single-use enforcement.

## Prerequisites
- n8n instance (self-hosted or cloud)
- Termii account with an approved Sender ID
- Phone numbers in international format (e.g. 2348012345678)

## Setup
1. Import the workflow into n8n
2. Open the **Send SMS via Termii** node
3. Replace \`YOUR_TERMII_API_KEY\` with your Termii API key
4. Replace \`YOUR_TERMII_SENDER_ID\` with your approved sender ID
5. Activate the workflow — you get two webhook URLs

## How it works
**Send OTP flow:** Webhook receives a phone number → Code node generates a 6-digit OTP and sets a 10-minute expiry → HTTP Request node calls Termii's SMS API → Code node stores the OTP in workflow static data → Webhook responds with success.

**Verify OTP flow:** Webhook receives phone + OTP → Code node retrieves the stored OTP → checks existence, expiry, and match → returns verified or failed with a specific reason → deletes used OTP on success.

## Example use case
A Nigerian fintech app uses this to verify phone numbers during user onboarding before creating a wallet, ensuring every account is linked to a real, reachable phone number.`,

  'flutterwave-reconciliation-sheets': `## What this does
Every morning at 8am WAT, this workflow fetches the previous day's successful Flutterwave transactions and appends them to a Google Sheets reconciliation spreadsheet — with transaction reference, amount, customer details, payment type, and status.

## Prerequisites
- n8n instance (self-hosted or cloud)
- Flutterwave account with API access
- Google Sheets spreadsheet with a sheet named "Reconciliation"
- Google Sheets OAuth2 credential in n8n

## Setup
1. Import the workflow into n8n
2. Open the **Fetch Flutterwave Transactions** node
3. Replace \`YOUR_FLUTTERWAVE_SECRET_KEY\` with your secret key
4. Open the **Append to Google Sheets** node
5. Replace \`YOUR_GOOGLE_SHEET_ID\` with your spreadsheet ID (from the URL)
6. Connect your Google Sheets credential
7. Activate — it will run at 8am every day automatically

## How it works
The **Schedule Trigger** fires at 8am daily. The **Set Date Range** node calculates yesterday's date boundaries in WAT timezone. The **Fetch** node calls Flutterwave's transactions API with date filters. The **Format** node maps each transaction to clean row data. Each row is appended to Google Sheets. A Slack summary is sent with the total count and amount.

## Example use case
A Lagos startup's finance team uses this to have a complete daily transaction record ready every morning for bookkeeping, without manually exporting from the Flutterwave dashboard.`,

  'paystack-subscription-email': `## What this does
Sends automated branded emails when a Paystack subscription is created, renewed, or cancelled. Each event triggers a different email with the relevant subscription details.

## Prerequisites
- n8n instance (self-hosted or cloud)
- Paystack account with subscription products set up
- SendGrid account with a verified sender email

## Setup
1. Import the workflow into n8n
2. Copy the webhook URL and add it to Paystack → Settings → Webhooks
3. Add your SendGrid API key in n8n credentials
4. Replace the sender email placeholder with your verified address
5. Activate the workflow

## How it works
The Webhook node receives subscription events from Paystack. An If node routes each event to the correct email template. SendGrid sends the appropriate message — welcome email for new subscriptions, renewal confirmation for recurring charges, cancellation acknowledgment for ended subscriptions.

## Example use case
A SaaS company in Nigeria uses this to automatically email customers when their monthly plan renews, reducing support tickets asking "why was I charged?".`,

  'whatsapp-support-triage': `## What this does
Routes incoming WhatsApp Business messages to the right support queue based on keyword detection. Urgent messages get escalated to Slack after 2 hours without resolution.

## Prerequisites
- n8n instance (self-hosted or cloud)
- WhatsApp Business API access
- Notion database for ticket tracking
- Slack workspace for escalations

## Setup
1. Import the workflow into n8n
2. Connect your WhatsApp Business webhook
3. Add your Notion integration token and database ID
4. Add your Slack webhook URL
5. Activate the workflow

## How it works
Incoming WhatsApp messages trigger the webhook. A Code node checks for keywords (payment, refund, delivery, technical) and assigns a queue. Notion creates a ticket with the message content and queue assignment. A scheduled check runs every 2 hours — unresolved tickets get escalated to the Slack #support channel.

## Example use case
An e-commerce business in Lagos uses this to handle 200+ daily WhatsApp customer messages, routing payment issues to finance and delivery problems to logistics without manual sorting.`,

  'kuda-low-balance-alert': `## What this does
Monitors your Kuda business account balance on a schedule and sends both a Slack message and an SMS via Termii when the balance drops below a threshold you set.

## Prerequisites
- n8n instance (self-hosted or cloud)
- Kuda business account with API access
- Termii account for SMS alerts
- Slack webhook for team notifications

## Setup
1. Import the workflow into n8n
2. Replace \`YOUR_KUDA_CLIENT_SECRET\` with your Kuda API credentials
3. Set your balance threshold in the If node (default: ₦50,000)
4. Add your Termii API key and alert phone number
5. Add your Slack webhook URL
6. Activate — checks every 6 hours by default

## How it works
The Schedule Trigger checks every 6 hours. An HTTP Request fetches the current Kuda balance. An If node compares it against your threshold. If below, a Code node formats the alert message. Slack and Termii nodes send simultaneous notifications to the team.

## Example use case
A startup in Lagos uses this to ensure their Kuda operations account never runs out of funds for supplier payments, with the finance manager getting an SMS alert before the balance hits zero.`,

  'moniepoint-transaction-airtable': `## What this does
Captures every Moniepoint POS transaction via webhook and logs it to an Airtable base in real time — with transaction amount, reference, customer details, status, and timestamp.

## Prerequisites
- n8n instance (self-hosted or cloud)
- Moniepoint business account with webhook access
- Airtable base with a configured table

## Setup
1. Import the workflow into n8n
2. Copy the webhook URL and register it in your Moniepoint dashboard
3. Add your Airtable API key and base ID in n8n credentials
4. Update the table name in the Airtable node if needed
5. Activate the workflow

## How it works
The Webhook node receives POST requests from Moniepoint on every POS transaction. A Code node extracts and formats the transaction data. The Airtable node appends a new record to your base. A separate branch handles failed transactions with a different status flag.

## Example use case
A retail chain with multiple POS terminals across Lagos uses this to get all transactions into Airtable instantly, powering a real-time sales dashboard for the business owner.`,

  'weekly-revenue-telegram': `## What this does
Every Monday morning at 8am, this workflow fetches the previous week's Paystack transactions, calculates total revenue, counts transactions, and posts a formatted summary to a Telegram channel.

## Prerequisites
- n8n instance (self-hosted or cloud)
- Paystack account with API access
- Telegram bot token and channel/group chat ID

## Setup
1. Import the workflow into n8n
2. Replace \`YOUR_PAYSTACK_SECRET_KEY\` with your Paystack secret key
3. Create a Telegram bot via @BotFather and copy the token
4. Add the bot to your channel and get the chat ID
5. Replace the placeholders in the Telegram node
6. Activate — sends every Monday at 8am WAT automatically

## How it works
The Schedule Trigger fires every Monday at 8am. A Code node calculates the previous week's date range. An HTTP Request fetches all successful transactions in that range from Paystack. A Code node aggregates totals, counts, and identifies the top customers. The Telegram node posts a formatted message with the weekly summary.

## Example use case
A subscription business in Abuja uses this so the founder wakes up every Monday to a Telegram message showing exactly how much revenue came in last week, without opening any dashboards.`,
}
