# Browser checks

Run `npm ci`, then `npm run test:e2e`.

The suite starts its own Vite server on an available local port, uses isolated browser contexts and a fixed random seed, and checks chests, reading, normal battles, review, and save/resume. The existing unit checks remain available through `npm test`.

A local Chrome/Chromium installation is used when found. Set `CHROME_PATH` to choose another executable, or run `npx playwright-core install chromium` once to install Playwright's compatible browser. No real player save data is touched.
