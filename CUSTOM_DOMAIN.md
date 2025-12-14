Custom Domain / GitHub Pages Troubleshooting

If your GitHub Pages site redirects to a custom domain name and returns a 404 (e.g. https://www.example.com), try the following steps:

Option 1: Keep the custom domain (e.g. www.example.com)
- Ensure a `CNAME` file (in the repo root) exists and contains exactly your domain, e.g. `www.example.com`.
- On your DNS provider create a CNAME for `www` pointing to `<username>.github.io`.
- If you also want the root/apex domain to work (example.com): add these A records:
  - 185.199.108.153
  - 185.199.109.153
  - 185.199.110.153
  - 185.199.111.153
- Wait for DNS to propagate (may take up to 24-48 hours).
- In GitHub Settings → Pages: make sure the custom domain is set and HTTPS is enabled.

Option 2: Remove the custom domain and use GitHub Pages URL
- Remove the `CNAME` file from the repository and commit.
- In GitHub Settings → Pages: clear the Custom domain field, and save.
- This will remove the redirect and the site will be served at `https://<username>.github.io/<repo>`.

Development / testing tips
- If you want to temporarily test the site, open `build/index.light.html` locally, or use the GitHub Pages URL `https://<username>.github.io/<repo>/` after removing custom domain.
- To push the build with or without CNAME, check the `CNAME` file in your repo before running `npm run deploy`.

If you need the assistant to remove the `CNAME` and push a PR to revert, let me know and I will prepare the commit for you.
