# DevOps Engineer Challenge: Ship a Full-Stack App

Sep 29, 2026 · @Someone

## Context and purpose

Your goal is to take a two-part web app from source code to a running, reproducible environment, with CI that proves every change builds. You already know how to write code; this challenge is about everything around it: packaging, automation, configuration and operability.

- **Who it is for:** a developer moving into DevOps, with no prior DevOps experience.
- **Timebox:** 1 week calendar time, roughly 15–20 hours of work. Stop when the timebox ends and document what is left.
- **What we evaluate:** that it works, that it is reproducible on a clean machine, and above all _why_ you made each decision. A simple solution you can defend beats a complex one you can't.
- **How it ends:** a 45–60 minute debrief where you demo it live and walk us through your choices.

There is no single correct answer. You will not get step-by-step instructions; where something is unclear, make a reasonable assumption and write it down.

## The scenario

A small team has built **Linkbox**, an internal link bookmarking tool, and it only runs on their laptops with `npm start`. You are their first DevOps hire: make it buildable by CI and runnable by anyone with one command.

You build the app yourself (keep it small; the app is not what we grade). Minimum functionality:

| Part           | Responsibility                                | Minimum features                                                                |
| :------------- | :-------------------------------------------- | :------------------------------------------------------------------------------ |
| Backend (API)  | REST API over HTTP, stores data in a database | `GET /api/links`, `POST /api/links`, `DELETE /api/links/:id`, `GET /api/health` |
| Frontend (web) | Browser UI that calls the API                 | List links, add a link, delete a link, show API errors                          |
| Database       | Persists links                                | Data survives a restart of the whole stack                                      |

Pick any language and framework you are comfortable with for each part (for example Node/Express, Python/FastAPI or Go for the API; React, Vue or plain HTML/JS for the web). Each part must have at least one automated test and a lint or format check.

This is the minimum shape the finished work must have. The pull from GHCR is a command you run on the Mac, not something CI triggers. How each box is built is up to you.

## Constraints and ground rules

These are fixed; everything else is your call.

- **Hardware:** everything runs on a MacBook with an M1 Pro (Apple Silicon, `arm64`). Images must run natively there, with no reliance on emulation.
- **One repository:** frontend, backend, infrastructure and pipeline live in a single public GitHub repo (a monorepo).
- **Everything containerized:** the app, database and proxy all run as containers orchestrated with Docker Compose. Nothing but Docker and Git should be needed on the host.
- **Nginx in front:** a single Nginx container is the only entry point exposed to the host.
- **No paid services and no cloud:** GitHub Actions free tier and GitHub Container Registry (GHCR) are allowed.
- **No secrets in Git:** not in code, compose files, images or pipeline logs.
- **Docker runtime:** Docker Desktop, OrbStack or Colima are all fine; say which you used.
- **AI assistants and docs are allowed.** You must be able to explain every line you submit.

## How it runs on the Mac

GitHub Actions never connects to your Mac. CI only builds, tests and publishes images to GHCR; you run the stack yourself with Docker Compose.

- **What you install:** a Docker runtime that includes Docker Compose (Docker Desktop, OrbStack or Colima) and Git. Nothing else.
- **Plain HTTP only:** the app runs on `http://localhost:8080`. No certificates, domains or HTTPS are needed.
- **Build once, in CI:** images are built only by GitHub Actions. The Mac never builds app images; Compose pulls them from GHCR by commit SHA and runs them. Make the packages public so no login is needed to pull.
- **The loop is:** push a branch, open a PR, CI goes green, merge, CI publishes the images, then on the Mac pull and restart. That last step is manual, and that is expected.

## Required goals

All five goals are required. Each lists what "done" looks like, not how to get there.

### 1. Monorepo layout

- [ ] Frontend, backend, infrastructure and CI config each have a clear home in one repo.
- [ ] A newcomer can tell from the tree and the README where to change what.
- [ ] Generated files, dependencies and local env files are ignored by Git.

### 2. Container images

- [ ] Each app part has its own Dockerfile and builds to its own image.
- [ ] Images use multi-stage builds: build tools are not in the final image.
- [ ] Containers run as a non-root user.
- [ ] Dockerfiles are ordered so a code-only change reuses cached dependency layers in CI.
- [ ] You can state each final image's size and justify its base image.

### 3. Local environment with Docker Compose and Nginx

- [ ] From a fresh clone, `docker compose up` pulls the CI images and starts the whole stack; `docker compose down` tears it down. No app image is built on the Mac.
- [ ] Nginx serves the frontend and proxies `/api` to the backend, all on one host port (for example `http://localhost:8080`).
- [ ] Only Nginx publishes a port; backend and database are unreachable from the host.
- [ ] The database has a persistent volume: links survive `down` and `up`.
- [ ] Services have health checks, and the backend waits for a healthy database instead of crash-looping.
- [ ] Configuration comes from environment variables, with a committed `.env.example` and an uncommitted `.env`.
- [ ] Logs from every service are visible with a single command.

### 4. CI pipeline with GitHub Actions

- [ ] On every pull request, the pipeline lints, tests and builds the images for both parts.
- [ ] A failing test or lint blocks the pull request (branch protection on `main`).
- [ ] A change only to the frontend does not rebuild or retest the backend, and vice versa.
- [ ] On merge to `main`, images are pushed to GHCR tagged with the commit SHA; the runtime is `linux/arm64` at minimum.
- [ ] Dependency and Docker layer caching make a no-change rerun noticeably faster than a cold run (report both times).
- [ ] The local stack runs only the images CI published, selected by commit SHA. The pull is done by you on the Mac; CI does not deploy anywhere.

### 5. Documentation

- [ ] The README covers prerequisites, how to run, test and stop the stack, and how to troubleshoot the three most likely failures.
- [ ] An architecture decision section records each choice from the next section, the alternatives, and why you picked yours.
- [ ] A "what I would do next" list shows what you would change for production.

## Decisions that are yours

Make each of these deliberately and record it in the README. We care more about the reasoning than the pick.

| Decision                   | Example options                                                                     | What we want to hear                                 |
| :------------------------- | :---------------------------------------------------------------------------------- | :--------------------------------------------------- |
| Languages and frameworks   | Node, Python, Go; React, Vue, plain JS                                              | How the choice affects image size and build time     |
| Database                   | PostgreSQL, MySQL, SQLite in a volume                                               | Persistence, migrations, how the schema gets created |
| Base images                | Alpine, Debian slim, distroless                                                     | Size vs. debuggability vs. compatibility on arm64    |
| How the frontend is served | Static files in the Nginx image, or a separate web container                        | Number of moving parts, cache headers, rebuild cost  |
| Nginx role                 | Reverse proxy only, or also serving static assets; gzip, timeouts, security headers | Why each directive is there                          |
| Pipeline shape             | One workflow with path filters, separate workflows, reusable workflows, matrix      | Readability vs. duplication                          |
| Image tagging              | SHA only, SHA + `latest`, semantic versions                                         | How you would roll back                              |
| Multi-arch builds          | arm64 only, or arm64 + amd64 with Buildx                                            | Cost in CI minutes vs. who can run the images        |
| Config and secrets         | `.env` files, Compose secrets, GitHub secrets                                       | Where each secret lives and who can read it          |
| Migrations                 | On app start, a one-off migration container, manual                                 | What happens with two backend replicas               |

## Deliverables

Send these before the debrief:

1.  A link to the public GitHub repository, with the history left intact (no squash into one commit: we read how the work evolved).
2.  At least one merged pull request showing CI running and passing, and one showing CI blocking a failing change.
3.  The images published in GHCR for the latest `main` commit.
4.  The README described in goal 5.
5.  A short list of what you did not finish, and why.

We will verify it by cloning the repo on an M1 Mac, running your one command, and using the app in a browser. If that fails, we stop there.

## Evaluation and debrief

We score out of 100. Passing is 60 with no zero in any area.

| Area                          | Weight | Strong looks like                                                          |
| :---------------------------- | :----- | :------------------------------------------------------------------------- |
| Works from a clean clone      | 25     | One command, app works in the browser, data persists                       |
| CI pipeline                   | 25     | Blocks bad PRs, builds only what changed, cached, publishes arm64 images   |
| Container and Compose quality | 20     | Small non-root images, health checks, only Nginx exposed, no secrets       |
| Decisions and reasoning       | 20     | Every choice recorded with alternatives; answers hold up under questioning |
| Documentation and Git hygiene | 10     | README a stranger can follow, readable commits and PRs                     |

**Debrief questions** (we will pick a few):

- Walk us through what happens, container by container, from `docker compose up` to the first page load.
- The backend image grew 3x overnight. How would you find out why?
- A teammate pushes a database password to the repo. What do you do in the next 10 minutes?
- How would you roll back to yesterday's version with what you built?
- Your CI takes 12 minutes. Where would you look first to speed it up?
- What is the biggest gap between this setup and one you would run in production?

**Live change:** during the debrief we will ask for a small change (for example, a new env variable or a new API route) and watch it go through the pipeline.

