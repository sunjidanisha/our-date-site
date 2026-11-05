# Our date site: public GitHub Pages, answers by WhatsApp

Files: `index.html`, `style.css`, `app.js`, `.nojekyll`. No login, no database, no card.

## Step 1: Add YOUR WhatsApp number
1. Open `app.js` in Notepad (or any text editor).
2. At the top, find `whatsappNumber: '',` and put your number between the quotes:
   - Country code + number, digits only, no `+`, no spaces, **no leading 0**.
   - Bangladesh example: `01712345678` → `whatsappNumber: '8801712345678',`
3. Save the file.

## Step 2: Put it on GitHub (no Git install needed)
1. Go to github.com → **New repository**:
   - Name: `our-date-site`
   - Choose **Public**
   - Tick "Add a README file"
   - Click **Create repository**
2. Click **Add file → Upload files**.
3. Drag in `index.html`, `style.css` and `app.js` (and `.nojekyll` if you can see it), then click **Commit changes**.
4. Go to **Settings → Pages** → **Build and deployment**:
   - Source: **Deploy from a branch**
   - Branch: **main**
   - Folder: **/ (root)**
   - Click **Save**.
5. After 1 to 2 minutes your link is: `https://YOUR-USERNAME.github.io/our-date-site/`

## Step 3: Test it yourself, then send him the link
1. Open your link on your phone and click through all pages.
2. On the last screen tap the green **Send me the details on WhatsApp 💚** button.
3. WhatsApp opens a chat with your number and the message ready. Check that the number is correct.
4. Send him the link.

## What you receive on WhatsApp
```
It's a date! 💌
📅 Friday, 20 November 2026
⏰ 7:00 PM
🚗 Long drive
😂 I tried to click "No" 4 time(s)
🙈 I chased the runaway option 2 time(s)
🚕 Uber's on you 😏
YES, I'M YOURS 💗
```

## Updating later
Edit the file on GitHub (pencil icon) or run `git add . && git commit -m "update" && git push`. The live site refreshes in about a minute.

## Important
- The repo and site are **public**. Anyone with the link can open it, and anyone can read the text in the repo.
- Your WhatsApp number will be visible in `app.js` to anyone who opens the repo. If you don't want that, use a number you're okay sharing.
- He has to press **send** himself in WhatsApp. If he skips it, you get nothing.
- The page asks search engines not to index it, but the repo itself is public.
