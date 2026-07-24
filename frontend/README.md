# Field Notes — Review Insights Web App

A React (Vite) frontend for the review-analysis project: users can classify a
single review with the sentiment model, and browse the 5 category reports
(generated article + stats + top/worst products).



## 1. Run it locally

**Backend first** (from your backend project folder):
```bash
pip install fastapi uvicorn
uvicorn backend.main:app --reload --port 8000
```
Confirm it's up: open `http://localhost:8000/docs` and try the endpoints.

**Frontend:**
```bash
cd webapp
npm install
cp .env.example .env.local     # then edit if your backend runs elsewhere
npm run dev
```
Open `http://localhost:5173`. You should be able to:
- Go to **Inspect a Review**, paste text, click Classify, and see a stamped verdict
- Go to **Category Reports**, see all 5 categories, click into one and see the article + charts

If either page shows a red error box, it means the frontend couldn't reach
the backend — check the backend is running and `VITE_API_BASE_URL` in
`.env.local` matches its address.

**Production build test** (do this before deploying, catches build-only bugs):
```bash
npm run build
npm run preview
```
Open the URL it prints and click through the same flows again.

## 3. Deploy the backend (do this before deploying the frontend)

The React app is a static site — it can only call a backend that's already
publicly reachable. Vercel's own serverless functions are a poor fit for a
FastAPI app that loads a DistilBERT model (cold starts reload the model on
every invocation), so deploy the backend on a platform built for
long-running Python processes instead.

- **Render** (free tier available): New → Web Service → point at your repo →
  build command `pip install -r requirements.txt` → start command
  `uvicorn backend.main:app --host 0.0.0.0 --port $PORT`


Note the public URL it gives you
(e.g. `https://your-api.onrender.com`) — you'll need it in step 4.


## 4. Deploy the frontend to Vercel

**Option A — Vercel dashboard (easiest):**
1. Push the `frontend/` folder to a GitHub repo
2. Go to [vercel.com](https://vercel.com) → **Add New → Project** → import that repo
3. Framework preset: Vercel auto-detects **Vite** — leave build command
   (`npm run build` / `vite build`) and output directory (`dist`) as default
4. Under **Environment Variables**, add:
   - `VITE_API_BASE_URL` = your deployed backend URL from step 3
     (e.g. `https://your-api.onrender.com`)
5. Click **Deploy**

**Option B — Vercel CLI:**
```bash
npm install -g vercel
cd webapp
vercel                       # first deploy — follow the prompts
vercel env add VITE_API_BASE_URL production   # paste your backend URL when asked
vercel --prod                # redeploy with the env var applied
```

**After deploying:** open the Vercel URL, click through both tools again the
same way you tested locally. If you see the red error boxes in production
but it worked locally, it's almost always one of:
- `VITE_API_BASE_URL` not set (or set only for "Development", not
  "Production") in Vercel's environment variables
- the backend's CORS `allow_origins` doesn't include your Vercel domain
- the backend went to sleep (common on free tiers after inactivity) — the
  first request after idling can take 30–60s to wake it up

