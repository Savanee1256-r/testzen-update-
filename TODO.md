# TestZen Vercel Deployment

## Deployment Plan:
- [x] Created vercel.json configuring build for frontend (Vite/React)
- [ ] Commit changes: `git add . && git commit -m "Add Vercel config for frontend deployment"`
- [ ] Push to GitHub: `git push origin main` (or master/main branch)
- [ ] Import to Vercel:
  1. Go to vercel.com → New Project
  2. Import repo: Savanee1256-r/testzen-update-
  3. Settings: Framework Preset = Vite, Root Directory = `frontend`
  4. Deploy → Get live URL
- [ ] Post-deploy:
  - Update frontend API calls to prod backend URL (add VITE_API_URL env var in Vercel dashboard)
  - Deploy backend separately (e.g., Render/Heroku for Node.js)
- [ ] Test live site

## Status: Ready for Git commit/push and Vercel import. Frontend will deploy automatically on push.
