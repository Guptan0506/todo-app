# Todo App

This is a minimal to-do list web app with the following features:

- Add tasks via the input and Add button (or by pressing Enter)
- Persist tasks in `localStorage` so they survive page refreshes
- Mark tasks as complete (using a checkbox)
- Delete a task (click the × button)
- Clear all tasks with the Clear All button
- Accessible labels and basic keyboard support

How to run
1. Open `index.html` in your browser (double-click or use a local server), or run a simple static file server:

```bash
# the simplest: (python 3)
python3 -m http.server 8000
# then open http://localhost:8000
```

Run unit tests
```
# run tests with node
npm test
```

Lightweight single-file build
1. Open `build/index.light.html` in your browser (no server required) — it's a single-file lightweight app with inlined CSS/JS.

Auto-deploy with GitHub Actions
1. Push this repository to GitHub (set `origin` remote and push `main`).
2. The repository includes a GitHub Actions workflow that automatically: runs tests, builds the project, and deploys the `build` folder to the `gh-pages` branch.
3. The workflow copies `build/index.light.html` to `build/index.html` before deployment so the production artifact works.
4. Once deployed, your site will be available at `https://<username>.github.io/<repo>/`.

Or run the build helper (this runs the ESBuild-based bundler; run `npm install` first):
```
npm install
npm run build
```

Notes about the default `index.html`
- The repository has a lightweight single-file `index.html` (generated) which is what opens by default.
- The original multi-file dev version is available as `index.html` in the repository root (development).

Notes
- Tasks are saved to `localStorage` under the key `todoApp.tasks`.
- Styling is minimal; edit `style.css` to update the look and feel.

Contributing
- Open a PR or modify the project locally to add features (sorting, due dates, editing tasks, etc.).

Custom domain & 404 troubleshooting

If your site is deployed but redirects to a custom domain and returns a 404 (for example `www.example.com`), see these steps:
- If you want to host the site on your GitHub Pages URL (e.g. `https://<username>.github.io/<repo>/`):
	- In the repository **Settings → Pages**, remove the custom domain (clear the Custom domain field) and save. Or remove the `CNAME` file in your repo and the action will no longer push a CNAME to the `gh-pages` branch; the repo has been updated to use the default GitHub Pages URL.
	- In the repository **Settings → Pages**, remove the custom domain (clear the Custom domain field) and save. Or remove the `CNAME` file in your repo and the action will no longer push a CNAME to the `gh-pages` branch.
- If you want a custom domain to be used (e.g. `www.example.com`):
	- Add a `CNAME` file (top-level) with the domain name (e.g. `www.example.com`), commit and push.
	- Set a **CNAME** DNS record for your `www` subdomain pointing to `<username>.github.io`.
	- For an apex (root) domain (example.com) add A records for these IPs: 185.199.108.153, 185.199.109.153, 185.199.110.153, and 185.199.111.153.
	- Wait for DNS propagation (may take up to 24-48 hours depending on TTL), then enable HTTPS in Pages settings if necessary.

Once DNS is configured correctly and the Pages site is associated with the custom domain, the site should stop returning 404s.
