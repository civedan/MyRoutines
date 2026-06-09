# Receipt Tracker — Setup Checklist

Work through these steps once and the form will be live on your phone.

---

## 1 — Create the Google Drive folder

1. Open Google Drive → go to **My Drive > Areas > Finance**.
2. Create a new folder called **Receipt Photos** inside Finance.
3. Open that folder and copy the folder ID from the URL:
   `https://drive.google.com/drive/folders/`**`THIS_PART_IS_THE_ID`**
4. Keep it handy for step 3.

---

## 2 — Create the Google Sheet

1. Inside **My Drive > Areas > Finance** (not inside Receipt Photos), create a new Google Sheet.
2. Name it **Receipt Tracker**.
3. In row 1, add these exact headers in columns A–F:

   | A    | B       | C      | D           | E            | F         |
   |------|---------|--------|-------------|--------------|-----------|
   | Date | Company | Amount | Description | Receipt Link | Submitted |

4. Optional: bold the header row, freeze row 1 (View → Freeze → 1 row), and format column C as Currency.
5. Copy the Sheet ID from the URL:
   `https://docs.google.com/spreadsheets/d/`**`THIS_PART_IS_THE_ID`**`/edit`

---

## 3 — Deploy the Apps Script backend

1. Go to [script.google.com](https://script.google.com) and click **New project**.
2. Name it **Receipt Tracker Backend**.
3. Delete the placeholder code and paste in the full contents of `Code.gs`.
4. At the top of the file, fill in the two config values:
   ```js
   var DRIVE_FOLDER_ID = 'paste your Receipt Photos folder ID here';
   var SHEET_ID        = 'paste your Sheet ID here';
   ```
5. Click **Deploy → New deployment**.
   - Type: **Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**
6. Click **Deploy** and authorise the permissions when prompted.
7. Copy the **Web app URL** — it looks like:
   `https://script.google.com/macros/s/LONG_STRING/exec`

---

## 4 — Wire the URL into the form

1. Open `receipt-tracker/index.html` in a text editor.
2. Find this line near the bottom of the `<script>` block:
   ```js
   const APPS_SCRIPT_URL = 'YOUR_APPS_SCRIPT_WEB_APP_URL_HERE';
   ```
3. Replace the placeholder with your Web app URL, keeping the quotes:
   ```js
   const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/…/exec';
   ```
4. Save the file.

---

## 5 — Push to GitHub and enable Pages

1. Commit and push the updated `index.html` to your repo's default branch (or this branch once merged to main).
2. In your GitHub repo go to **Settings → Pages**.
3. Source: **Deploy from a branch** → branch `main` (or `master`) → folder `/ (root)`.
4. Wait ~60 seconds, then your Pages URL will appear, e.g.:
   `https://civedan.github.io/myroutines/receipt-tracker/`

---

## 6 — Bookmark on your phone

1. Open the Pages URL in Safari (iOS) or Chrome (Android).
2. **iOS:** tap the Share icon → **Add to Home Screen**.
3. **Android:** tap the three-dot menu → **Add to Home screen**.

The icon will sit on your home screen like a regular app. Open it when you get a receipt and tap **Tap to snap or upload** — the camera will open directly.

---

## Re-deploying after code changes

Any time you edit `Code.gs`, you must create a **new deployment version**:
- Deploy → Manage deployments → click the pencil on your existing deployment → Version: **New version** → Deploy.

Using the same deployment URL is fine; the new version takes over automatically.
