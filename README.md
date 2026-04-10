# web_app (Nuxt 3)

Минимальный frontend на Vue + Nitro.

## Архитектурный паттерн

- `src/app`: глобальная инициализация/стили.
- `src/pages`: route-страницы.
- `src/features`: бизнес-фичи (`model/api/ui`).
- `src/shared`: UI, lib, api, types.
- `src/server`: Nitro handlers.

Подробно: `docs/ARCHITECTURE.md`.

## UI Preferences

- Footer содержит переключатель языка (`RU/EN`).
- Footer содержит переключатель темы (`system/light/dark`).
- Год в footer подставляется динамически.

## Локальный запуск
```bash
npm install
npm run dev
```

Откроется на `http://localhost:3000`.

## Тесты
```bash
npm test
```

## Lint и Format
```bash
npm run lint
npm run format:check
```

Автоисправление:
```bash
npm run lint:fix
npm run format
```

## Docker
```bash
docker compose -f docker-compose.yml up -d --build
```
