# 🍦 for dhruviieee

A tiny, cute, interactive site that walks through 4 pages and ends with an
ice-cream invite (with a date & time picker).

Built with **React + Vite**.

## Run it locally

```bash
npm install
npm run dev
```

Then open the URL it prints (usually http://localhost:5173).

## ✏️ Personalize everything

Open **`src/config.js`** — every piece of text lives there:

- `herName` / `yourName`
- `introTitle`, `introSubtitle` — page 1
- `balloonMessages`, `catchReward` — page 2 games
- `tellTitle`, **`tellMessage`** ← put your real paragraph here (page 3)
- `askQuestion`, `askNote`, `askSuccess` — page 4 (the ask)

To change the song, replace `public/music.mp3` (keep the credit line in the footer
if you keep the included track — it's required by its free licence).

## The 4 pages

1. `/` — little intro + the cute character
2. `/games` — catch the ice creams 🍦 + pop the balloons 🎈
3. `/tell` — "okay… real quick" (your message, typed out)
4. `/ask` — "wanna grab ice cream?" → pick a **day + time (12-hour AM/PM)**

## 🚀 Deploy

### Push to GitHub (from VS Code or terminal)

```bash
git add -A
git commit -m "update"
# create an empty repo on github.com first, then:
git remote add origin https://github.com/<your-username>/<repo>.git
git branch -M main
git push -u origin main
```

### Deploy on Vercel

1. Go to vercel.com → **Add New → Project** → import this GitHub repo.
2. Framework preset: **Vite** (auto-detected). Build command `npm run build`,
   output dir `dist`. Just click **Deploy**.
3. You get a live link to send her. ✅

## 📨 Seeing her answer (date + time) — added later

Right now, when she submits, the answer is saved in her browser
(`localStorage` key `icecream-rsvp`) and logged to the console. To actually
receive it yourself after deploying, the easiest option is:

- **Formspree / Google Form / a Vercel serverless function at `api/rsvp.js`.**

The submit handler in `src/pages/Ask.jsx` already POSTs the answer to `/api/rsvp`
(it fails silently until that endpoint exists). When you're ready, we'll add that
endpoint so the date/time lands in your inbox or a dashboard.
