const defaultValue = (locale, namespace, key, value) => {
  if (locale === "en") {
    return value;
  }
  return "";
};

module.exports = {
  defaultNamespace: "common",
  createOldCatalogs: false,
  defaultValue,
  input: "src/**/*.{ts,tsx}",
  output: "src/translations/$LOCALE/$NAMESPACE.json",
  locales: ["en", "fr", "de", "it", "es", "pt", "ru", "ja", "zh"],
  lexers: {
    hbs: ["HandlebarsLexer"],
    handlebars: ["HandlebarsLexer"],
    htm: ["HTMLLexer"],
    html: ["HTMLLexer"],
    mjs: ["JavascriptLexer"],
    js: ["JavascriptLexer"], // if you're writing jsx inside .js files, change this to JsxLexer
    ts: ["JavascriptLexer"],
    jsx: ["JsxLexer"],
    tsx: ["JsxLexer"],
    default: ["JavascriptLexer"],
  },
  contextSeparator: "_",
};
