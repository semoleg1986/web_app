# web_app

Parent/student-facing Nuxt storefront.

## Responsibility

`web_app` owns:

- public catalog browsing
- parent auth session UX
- child creation during checkout
- student course access status after invite/onboarding
- payment intent creation for selected student and offer
- server-side backend proxies under `/api`

## Local run

```bash
npm install
npm run dev
```

App URL:

- [http://localhost:3000](http://localhost:3000)

## Environment

- [web_app/.env.example](/Users/olegsemenov/Programming/curs/web_app/.env.example)
- [web_app/.env.local.example](/Users/olegsemenov/Programming/curs/web_app/.env.local.example)

Key variables:

- `NUXT_AUTH_SERVICE_BASE_URL`
- `NUXT_PUBLIC_API_BASE_URL`
- `NUXT_PUBLIC_SITE_URL`

Rule:

- browser-facing API base should stay relative (`/api`)
- backend hostnames belong only to server-side proxy config

## Tests and quality

```bash
npm test
npm run lint
npm run format:check
```

## Build

```bash
npm run build
npm run start
```

## Documentation

- [docs/ARCHITECTURE.md](/Users/olegsemenov/Programming/curs/web_app/docs/ARCHITECTURE.md)
