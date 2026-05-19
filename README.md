# Trust & Compliance Hub

Centralised privacy policies, terms, and account-deletion forms for every app
DavinTech operates. Vue 3 + Vite, deployed to GitHub Pages on every push to
`main`.

- **Live URL:** https://davisromans.github.io/compliance_hub/
- **GitHub Pages source:** `davisromans/compliance_hub` → branch `main` → `dist/` (built by CI)
- **Source of truth for content:** [`projects.json`](./projects.json) at the repo root.

Currently hosts:

| Code      | App           | Flow          | Delete API base                                            |
|-----------|---------------|---------------|------------------------------------------------------------|
| `amoview` | Amo View      | `email-token` | `https://app.amoview.com/api/v1/auth/web-delete`           |
| `adm`     | ADM Ministry  | `password`    | `http://172.105.118.145/api/auth/web-delete`               |

The hub supports **two deletion flows**, picked per-app via the `deleteFlow`
field in `projects.json`:

- **`email-token`** (Amo View) — works even for users who signed in with
  Google or Apple and have no password.
  1. User enters their account email → page POSTs to `${deleteApiUrl}/request`.
  2. Backend emails a one-time confirmation link with a `?token=...` query.
  3. User clicks → page POSTs the token to `${deleteApiUrl}/confirm` → account is hard-deleted.
- **`password`** (ADM Ministry — default if `deleteFlow` is absent) — single
  call to `${deleteApiUrl}` with `{ identifier, password }`.

Public per-app routes (hash-routed, so they work on GitHub Pages):

- `https://davisromans.github.io/compliance_hub/#/p/{code}/privacy`
- `https://davisromans.github.io/compliance_hub/#/p/{code}/terms`
- `https://davisromans.github.io/compliance_hub/#/p/{code}/delete-account`

---

## 1. How content flows

```
projects.json (in GitHub repo)
        │
        ▼
GitHub Contents API (raw fetch from the public web app)
        │
        ▼
Home.vue → list of apps           Public routes → render HTML from projects.json
        │
        ▼
Admin Dashboard ──► saveProjects() ──► GitHub Contents API ──► commit to main ──► Pages redeploys
```

There is **no server**. The public site reads `projects.json` straight from GitHub
on every page load. The admin dashboard writes back to it through the GitHub API
using a personal access token stored in `sessionStorage`.

This means: **edit `projects.json`, push to `main`, and within ~60 s GitHub Pages
serves the new content.** No backend deploy required.

---

## 2. Updating policy or terms (the fast way — admin dashboard)

Use this when you just want to fix copy, add a new app, or change the delete
endpoint URL.

1. Generate a **Fine-grained personal access token** at
   <https://github.com/settings/personal-access-tokens/new>.
   - Repository access: **only** `davisromans/compliance_hub`
   - Permissions → Repository → **Contents: Read and write**
   - Expiration: 90 days max
2. Go to <https://davisromans.github.io/compliance_hub/#/admin/login>.
3. Paste the PAT. It's kept in `sessionStorage` for the tab's lifetime only.
4. Edit the privacy / terms HTML or add a new app card.
5. Click **Save & Publish**. The dashboard commits to `projects.json` on `main`.
6. The GitHub Pages workflow rebuilds within ~60 s. Hard-reload the public page.

> The dashboard only stores the PAT in `sessionStorage` — it never leaves the
> browser tab and is wiped when you close it.

---

## 3. Updating via Git (for larger edits, code review)

Use this when you want to write the HTML in your editor and review the diff before publishing.

```bash
# 1. clone
git clone https://github.com/davisromans/compliance_hub.git
cd compliance_hub

# 2. edit projects.json — keep it valid JSON
$EDITOR projects.json
node -e "JSON.parse(require('fs').readFileSync('projects.json'))"   # sanity check

# 3. (optional) preview locally
npm install
npm run dev                              # opens http://localhost:5173/compliance_hub/

# 4. ship
git add projects.json
git commit -m "Update Amo View privacy policy"
git push origin main                     # CI builds + deploys automatically
```

---

## 4. Adding a brand-new app

1. Pick a short `code` (lower-case, no spaces — used in the URL).
2. Stand up a **POST `/web-delete`** endpoint on the app's backend that accepts
   `{ identifier, password }` and returns `{ success: true, message }` on success
   or `{ success: false, error }` on failure. See the reference implementation
   in `tai_view_backend/controllers/authController.js → exports.webDelete`.
3. Add the entry to `projects.json`:

```json
{
  "name": "Your App Name",
  "code": "yourapp",
  "deleteApiUrl": "https://api.yourapp.com/v1/auth/web-delete",
  "privacyPolicy": "<h1>Privacy Policy</h1>…",
  "terms":          "<h1>Terms of Service</h1>…"
}
```

4. Save & publish (admin dashboard) or commit and push.
5. Verify the three public URLs render:
   `/#/p/yourapp/privacy`, `/#/p/yourapp/terms`, `/#/p/yourapp/delete-account`.
6. Wire the app's in-app "Privacy / Terms / Delete account" buttons to those URLs.

---

## 5. Updating the Amo View policy specifically

Trigger any time you:

- collect a new data field (e.g. add a marketplace, biometric login)
- swap a major sub-processor (e.g. move payments off PawaPay)
- change retention windows
- launch in a new jurisdiction with its own consent rules
- ship a material feature like AI summarisation (already documented today)

**Procedure:**

1. Update `projects.json` → the `amoview` entry's `privacyPolicy` and/or `terms` fields.
2. Bump the `Effective Date` / `Last Updated` line inside the HTML.
3. Save & publish. The mobile app links straight to these URLs, so users see the new copy the next time they tap **Privacy policy** in Settings.
4. For material changes, also push an in-app banner / notification announcing the change (handled via the admin web dashboard at <https://admin.amoview.com>, not here).

---

## 6. How the Amo View deletion endpoint works

The Amo View flow is **email-token**, not password-based — most Amo View users
sign in with Google or Apple and have no password to type.

### Step 1 — request a confirmation email

| # | What happens |
|---|---|
| 1 | User opens `https://davisromans.github.io/compliance_hub/#/p/amoview/delete-account` |
| 2 | Page loads `projects.json`, finds the `amoview` entry, reads `deleteApiUrl` and `deleteFlow: 'email-token'` |
| 3 | User enters their account email |
| 4 | Browser POSTs to `${deleteApiUrl}/request` → `https://app.amoview.com/api/v1/auth/web-delete/request` with `{ identifier }` |
| 5 | Backend (`authController.requestWebDelete`): looks up user, generates a 48-char random token, sha-256 hashes it into `AccountDeletionToken`, and emails the plaintext token to the user as a link |
| 6 | Page shows a generic "If that email is on file, we've sent a link." — never leaks whether the address exists |

The endpoint is rate-limited to **5 requests per IP per 60 minutes**.

### Step 2 — confirm via the emailed link

| # | What happens |
|---|---|
| 1 | User clicks the button in the email → opens `…/#/p/amoview/delete-account?token=…` |
| 2 | Page detects `route.query.token`, swaps to the confirm UI |
| 3 | User ticks "I understand" and clicks **Confirm and delete my account** |
| 4 | Browser POSTs to `${deleteApiUrl}/confirm` → `…/auth/web-delete/confirm` with `{ token }` |
| 5 | Backend (`authController.confirmWebDelete`): sha-256s the token, looks up the row, checks `usedAt` / `expiresAt`, hard-deletes `User` + `Channel` + `FcmToken`, marks the token used, drops any other outstanding tokens for this user |
| 6 | Page shows the green success message |

The confirm endpoint is rate-limited to **10 attempts per IP per 60 minutes**.
Tokens expire in **30 minutes** and are single-use; a MongoDB TTL index sweeps
expired rows automatically.

### Backend environment

The deletion email is sent via `services/emailService.js` which uses SMTP. The
backend `.env` must have:

```
SMTP_HOST=...
SMTP_PORT=465
SMTP_USER=...
SMTP_PASS=...
SMTP_FROM=no-reply@amoview.com

# Optional override for the link domain — defaults to the GitHub Pages URL.
TRUST_CENTER_URL=https://davisromans.github.io/compliance_hub
```

If you move the Trust Center to a custom domain (e.g. `compliance.amoview.com`),
update `TRUST_CENTER_URL` so the magic-link emails point there.

### Phone-only accounts

The flow requires an email on file. If a user registered with phone only
(no email), the page tells them to open the Amo View app → *Edit profile* →
add an email, then come back. We never email SMS-link OTPs since we don't yet
have an SMS sub-processor in place.

---

## 7. Local development

```bash
npm install
npm run dev
# → http://localhost:5173/compliance_hub/
```

The local dev server reads the live `projects.json` from GitHub, so what you
see is what production sees. To test edits without publishing, edit
`projects.json` locally and temporarily patch `src/utils/github.js`
`getProjects()` to return a local copy. Don't commit that patch.

---

## 8. Project layout

```
src/
  App.vue                     ← shell, nav, footer
  main.js
  router/index.js             ← hash-routed; do NOT switch to history mode (breaks GH Pages)
  utils/github.js             ← GitHub Contents API helpers (read + write projects.json)
  views/
    Home.vue                  ← landing page, lists every project
    public/
      PrivacyPolicy.vue       ← renders project.privacyPolicy HTML
      Terms.vue               ← renders project.terms HTML
      DeleteAccount.vue       ← form that POSTs to project.deleteApiUrl
    admin/
      Login.vue               ← PAT prompt → sessionStorage
      Dashboard.vue           ← CRUD on projects.json via GitHub API
projects.json                 ← single source of truth for all app content
vite.config.js                ← base: '/compliance_hub/' — keep this matching the repo name
.github/workflows/            ← deploy to GitHub Pages on push to main
```

---

## 9. Common pitfalls

- **Edited `projects.json` but the page still shows old content?** GitHub
  Pages CDN can cache for ~10 min. Hard-reload (`Cmd+Shift+R`). The fetch URL
  already busts cache with `?t=${Date.now()}`, but the Pages edge cache can
  still serve a stale built `index.html`.
- **HTML in the JSON renders as literal text?** Make sure you used double
  quotes and escaped them correctly. Run `node -e "JSON.parse(require('fs').readFileSync('projects.json'))"`.
- **Renaming the repo breaks the site.** `vite.config.js` has
  `base: '/compliance_hub/'`. If you rename, update both this and every absolute
  URL in app code that points to the GitHub Pages domain.
- **CORS errors on delete?** The backend must allow the GitHub Pages origin
  (`https://davisromans.github.io`) for the `/auth/web-delete` route. Amo
  View's CORS config is permissive on auth routes; check yours if you add a
  new app.
