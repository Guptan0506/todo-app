# Contributing to Todo App

Thanks for your interest in contributing!

## Getting started
- Fork the repository
- Clone your fork
- Run:
```bash
npm ci
npm test
npm run build
```

## Workflow
- Create a topic branch for your change (`git checkout -b feat/your-feature`)
- Make small, focused commits with descriptive messages
- Run tests locally and ensure they pass:
  - `npm test`
- When ready, open a Pull Request using the provided template and describe the changes and testing steps done.

## Code Style
- Keep the code simple and readable
- Follow the existing style conventions (ES modules, vanilla JS, small helper functions)

## Tests
- Unit tests live under `tests/` and are runnable with `npm test`
- If adding logic to `tasks.js`, add unit tests to `tests/tasks.test.js`

## Building the project
- The build uses `esbuild` and produces a single-file build in `build/index.light.html`.
- `npm run build` will generate the build file.

## Adding a custom domain
- If you want to deploy with a custom domain, add a `CNAME` file to the repo root with the domain, and add appropriate DNS records (CNAME `www` to `<username>.github.io`, A records for the root).
- Alternatively, use the GitHub Pages settings to configure a custom domain.

## Contact
- Open an issue or a PR if you have any questions about the design, tests, or build process.
