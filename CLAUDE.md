# MyRoutines

Dan's collection of small personal web apps, each a self-contained static HTML page, published with
GitHub Pages at https://civedan.github.io/MyRoutines/ (repo `civedan/MyRoutines`).

## Layout
- `index.html`: "My Routines" landing page. It links the four routine/timer/planner pages; Site
  Scout and the receipt tracker are not linked from it and are opened by direct URL.
- `morning-routine.html`, `evening-routine.html`: daily routine checklists.
- `pomodoro-timer.html`: Pomodoro timer. `time-blocker.html`: "Day Planner".
- `construction-capture.html`: "Site Scout", a construction site capture app that can push to a
  monday.com board.
- `receipt-tracker/`: phone receipt form (`index.html`) plus a Google Apps Script backend
  (`Code.gs`) that saves photos to Google Drive and rows to a Google Sheet. `SETUP.md` has the
  one-time setup steps.
- `.github/workflows/`: `pages.yml` and `preview.yml` (see below).

## Publishing (important)
- A push to `main` runs `pages.yml`, which deploys the whole repo root to the `gh-pages` branch.
  `main` is the live site. Never edit `gh-pages` by hand; it is overwritten on every deploy.
- A push to any other branch runs `preview.yml`, which deploys that branch to
  `previews/<branch>/` on the live site and comments the URL on the PR. Every file in the repo is
  served publicly, so never commit private material.
- `preview.yml` hardcodes a PR comment table listing only Site Scout and the landing page.

## State and secrets
- Apps save their data in the browser's `localStorage` (per origin, per device). Keep storage keys
  and data shapes stable, or existing data is lost.
- The monday.com API token is typed in by the user inside Site Scout and kept in `localStorage`.
  It is never in the repo. Keep it that way: never hardcode tokens or keys.
- `receipt-tracker/Code.gs` contains the Drive folder ID and Sheet ID, and `index.html` contains
  the public Apps Script web-app URL. Receipt PDFs are shared as "anyone with the link".
  Do not change sharing, IDs or the deployment without being asked.

## Git
- Use a branch per change and open a PR. Features so far went through PRs, though some recent
  small fixes were committed straight to `main`. Since `main` publishes live, prefer a branch.
- Remote uses SSH (`git@github.com:civedan/MyRoutines.git`). Never put a token in the remote URL.
