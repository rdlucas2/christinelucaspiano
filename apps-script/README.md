# Group class sign-up form backend

The form on `group-class.html` posts to a small Google Apps Script web app.
Each sign-up is added as a row in a Google Sheet and emailed to
contact@christinelucaspiano.com. No server or paid service is involved.

## One-time setup (about 10 minutes)

1. Sign in to the Google account that should own the sign-ups list, then
   create a new Google Sheet, e.g. **"Group Class Sign-ups"**.
2. In the sheet: **Extensions → Apps Script**.
3. Delete the starter code, paste in everything from `Code.gs` in this folder,
   and click **Save**.
4. Click **Deploy → New deployment**.
   - Gear icon next to "Select type" → **Web app**.
   - Description: `signup form`
   - Execute as: **Me**
   - Who has access: **Anyone**
   - Click **Deploy**, then **Authorize access** and allow it. (Google shows an
     "unverified app" warning because you wrote the script yourself: click
     *Advanced → Go to … (unsafe)*. It only gets access to this sheet and
     permission to send email as you.)
5. Copy the **Web app URL** (ends in `/exec`).
6. Paste it into `SIGNUP_ENDPOINT` at the top of `js/signup.js`, commit, and
   open a PR.

Until step 6 is done the form still works: on submit it opens the visitor's
email app with their details filled in, addressed to Christine.

## Changing the script later

Edit the code in the Apps Script editor, then **Deploy → Manage deployments →
(pencil) Edit → Version: New version → Deploy**. The URL stays the same.
Keep `Code.gs` in this repo in sync.

## Testing

Submit the form on the live page with your own details. Within a few seconds
a row should appear in the **Signups** tab and Christine should get an email
whose Reply-To is the address you entered. Delete the test row afterwards.
