# Web App Architecture (Senior Pattern)

`web_app` построен по layered/FSD-подходу поверх Nuxt 3.

## Слои

- `src/app`:
  - глобальные стили,
  - приложение/инициализация,
  - конфигурация окружения.
- `src/pages`:
  - route-level страницы,
  - композиция виджетов/фич.
- `src/features`:
  - изолированные бизнес-фичи,
  - структура внутри фичи: `model`, `api`, `ui`.
- `src/shared`:
  - переиспользуемый UI,
  - `lib` утилиты,
  - `api` thin-клиенты,
  - `types` контрактные типы.
- `src/server`:
  - Nitro API handlers.

## Правила зависимостей

- `pages` может импортировать из `shared`.
- `pages` может импортировать из `features`.
- `features` может импортировать из `shared`.
- `features` не импортирует другие `features` напрямую.
- `shared` не импортирует `pages`.
- `server` изолирован от UI-слоя.
- Общие типы DTO выносятся в `shared/types`.

## Папки

- `src/features/*/{model,api,ui}`: вертикальные срезы фич.
- `src/shared/ui/*`: атомарные компоненты.
- `src/shared/lib/*`: чистые функции (без side effects).
- `src/shared/lib/preferences/*`: i18n + theme preferences (`light|dark|system`).
- `src/shared/api/*`: обертки над `useFetch`.
- `tests/unit/*`: юнит-тесты по слоям shared/server.

## Why this

- предсказуемый рост проекта,
- легкий onboarding,
- контроль связности и границ слоя.
