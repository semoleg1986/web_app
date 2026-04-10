import type { LocaleCode } from '~/shared/lib/preferences/types';

export const MESSAGES: Record<LocaleCode, Record<string, string>> = {
  ru: {
    'app.name': 'Curs Platform',
    'page.hero.title': 'Платформа курсов для детей и родителей',
    'page.hero.subtitle': 'Курсы, прогресс, live-классы и контроль доступа в одном месте.',
    'page.status': 'Статус API',
    'status.ok': 'работает',
    'status.degraded': 'нестабильно',
    'catalog.title': 'Популярные курсы',
    'catalog.empty': 'Курсы скоро появятся.',
    'catalog.level': 'Уровень',
    'catalog.lessons': 'Уроков',
    'catalog.level.beginner': 'Начальный',
    'catalog.level.intermediate': 'Средний',
    'catalog.level.advanced': 'Продвинутый',
    'catalog.level.unknown': 'Без уровня',
    'catalog.open': 'Открыть курс',
    'course.back': 'К каталогу',
    'course.description': 'Описание',
    'footer.language': 'Язык',
    'footer.theme': 'Тема',
    'footer.theme.system': 'Системная',
    'footer.theme.light': 'Светлая',
    'footer.theme.dark': 'Темная',
    'footer.copyright': 'Все права защищены.'
  },
  en: {
    'app.name': 'Curs Platform',
    'page.hero.title': 'Learning platform for children and parents',
    'page.hero.subtitle': 'Courses, progress, live classes and access control in one place.',
    'page.status': 'API status',
    'status.ok': 'healthy',
    'status.degraded': 'degraded',
    'catalog.title': 'Popular courses',
    'catalog.empty': 'Courses are coming soon.',
    'catalog.level': 'Level',
    'catalog.lessons': 'Lessons',
    'catalog.level.beginner': 'Beginner',
    'catalog.level.intermediate': 'Intermediate',
    'catalog.level.advanced': 'Advanced',
    'catalog.level.unknown': 'Unspecified',
    'catalog.open': 'Open course',
    'course.back': 'Back to catalog',
    'course.description': 'Description',
    'footer.language': 'Language',
    'footer.theme': 'Theme',
    'footer.theme.system': 'System',
    'footer.theme.light': 'Light',
    'footer.theme.dark': 'Dark',
    'footer.copyright': 'All rights reserved.'
  }
};

export function translate(locale: LocaleCode, key: string): string {
  return MESSAGES[locale][key] ?? MESSAGES.ru[key] ?? key;
}
