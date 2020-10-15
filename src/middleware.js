import langStorage from './langStorage';

export default function (defaultLocale) {
  return async function loadLocaleMiddleware(ctx, next) {
    const storage = ctx.state.langStorage || langStorage;
    const locale = ctx.state.locale || defaultLocale;
    ctx.state.langStrings = storage.getStrings(locale);
    await next();
  };
}
