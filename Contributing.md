# Contributing to OpenStack Africa
 
Welcome! OpenStack Africa is a community-maintained library of n8n workflow templates built for African business contexts. Every template here was built by someone in the community solving a real problem.
 
## What makes a good template
 
A good OpenStack Africa template:
- Uses at least one African API (Paystack, Flutterwave, Termii, Moniepoint, Kuda, MTN MoMo, M-Pesa, etc.)
- Solves a real business problem common in African contexts
- Is tested and working — not theoretical
- Has clear documentation so anyone can set it up in under 10 minutes
## How to submit a template
 
### Step 1 — Fork the repository
 
Fork this repo and clone it locally:
 
```bash
git clone https://github.com/openstack-africa/templates.git
cd templates
```
 
### Step 2 — Create your template folder
 
Create a new folder under the correct category:
 
```
templates/
  payments/
  messaging/
  banking/
  business-ops/
```
 
Name your folder using kebab-case, descriptive and specific:
 
```bash
mkdir templates/payments/paystack-webhook-to-slack
```
 
### Step 3 — Add required files
 
Every template submission must include exactly three files:
 
```
templates/payments/paystack-webhook-to-slack/
  workflow.json        ← the exported n8n workflow
  README.md            ← setup instructions
  preview.png          ← screenshot of the workflow canvas
```
 
**workflow.json**
Export your workflow from n8n: open the workflow → ⋮ menu → Download. Do not include any real API keys or credentials. Replace all sensitive values with placeholders like `YOUR_PAYSTACK_SECRET_KEY`.
 
**README.md**
Use the template README format below.
 
**preview.png**
A clean screenshot of the workflow canvas. Minimum 1200px wide. No personal data visible.
 
### Step 4 — Fill in the template README
 
Copy this exactly and fill in every field:
 
```markdown
# [Template Name]
 
## What this does
[One or two sentences. What problem does this solve? Be specific.]
 
## APIs used
- [API Name](https://link-to-docs) — what it does in this workflow
 
## Prerequisites
- n8n instance (self-hosted or cloud)
- [API Name] account with [specific tier/access needed]
- [Any other requirement]
 
## Setup
 
1. Import `workflow.json` into your n8n instance
2. Create credentials for [API Name]:
   - Go to Settings → Credentials → Add Credential
   - Select [credential type]
   - Enter your [specific keys/values]
3. [Any other setup steps]
4. Activate the workflow
 
## How it works
[Brief explanation of each major node or step]
 
## Example use case
[A real scenario where this would be used]
 
## Author
- Name: [Your name or handle]
- Twitter: [@handle]
- Location: [City, Country]
```
 
### Step 5 — Open a Pull Request
 
Push your branch and open a PR against `main`:
 
```bash
git checkout -b add/paystack-webhook-to-slack
git add templates/payments/paystack-webhook-to-slack/
git commit -m "add: paystack webhook to slack notification template"
git push origin add/paystack-webhook-to-slack
```
 
PR title format: `add: [brief description]`
 
A maintainer will review within 3 business days. We may ask for changes before merging.
 
## Template categories
 
| Category | Folder | What belongs here |
|----------|--------|-------------------|
| Payments | `payments/` | Webhooks, reconciliation, notifications for Paystack, Flutterwave, etc. |
| Messaging | `messaging/` | SMS via Termii, WhatsApp Business, email flows |
| Banking | `banking/` | Kuda, Moniepoint, bank statement parsing, alerts |
| Business Ops | `business-ops/` | Invoicing, onboarding, CRM, reporting |
 
Not sure where your template belongs? Open an issue and ask.
 
## Quality checklist
 
Before submitting, confirm:
 
- [ ] Workflow exports and imports cleanly in n8n
- [ ] No real API keys in `workflow.json`
- [ ] README covers all setup steps — a stranger should be able to use this
- [ ] Preview screenshot is clear and minimum 1200px wide
- [ ] Folder name is descriptive and uses kebab-case
- [ ] PR title follows the format `add: [description]`
## Questions?
 
Open an issue or join the n8n Nigeria community on [Whatsapp — https://chat.whatsapp.com/Fm3f2UzdveYGOLJpUCWuvO].
 
Built with ❤️ by the African n8n developer community.
 
