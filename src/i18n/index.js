import { createI18n } from 'vue-i18n';

async function loadLocaleMessages() {
  const locales = import.meta.glob('./locales/**/*.json');
  const messages = {};
  for (const _key in locales) {
    const key = _key.replace('./locales/', '');

    const matched = key.match(/([A-Za-z0-9-_]+)\./i);
    if (matched && matched.length > 1) {
      const matched = key.match(/([A-Za-z0-9-_]+)\//i);
      const matchedModule = key.match(/([A-Za-z0-9-_]+)\./i);
      if (matched && matched.length > 1 && matched && matchedModule.length > 1) {
        const locale = matched[1];
        const module = matchedModule[1];
        if (!messages[locale]) messages[locale] = {};
        if (module === 'common') messages[locale] = (await locales[_key]()).default;
        else messages[locale][module] = (await locales[_key]()).default;
      }
    }
  }
  return Promise.resolve(messages);
}

const messages = await loadLocaleMessages();

export default createI18n({
  legacy: true,
  globalInjection: true,
  locale: import.meta.env.VITE_I18N_LOCALE || 'en',
  fallbackLocale: import.meta.env.VITE_I18N_FALLBACK_LOCALE || 'en',
  messages,
});
