import i18n from "i18next";
import { initReactI18next } from "react-i18next";

export const ruleFiles = Object.fromEntries(
  Object.entries(
    import.meta.glob<string>("@/assets/rules/**/*.yaml", {
      query: "?raw",
      import: "default",
    })
  ).map(([key, value]) => [key.split("/").pop()?.replace(".yaml", ""), value])
);

export const ruleI18nFiles = Object.fromEntries(
  Object.entries(
    import.meta.glob<string>("@/i18n/rules/**/*.yaml", {
      query: "?raw",
      import: "default",
    })
  ).map(([key, value]) => {
    const path = key.split("/");
    const lang = path[path.length - 1].replace(".yaml", "");
    const ruleId = path[path.length - 2];

    return [`${ruleId}:${lang}`, value];
  })
);

export const ruleIds = Object.keys(ruleFiles);

console.log("Rule files:", ruleFiles);
console.log("Rule i18n files:", ruleI18nFiles);

// Init i18n instance
i18n.use(initReactI18next).init({
  lng: "en",
  fallbackLng: "en",
  resources: {}, // Form specific i18n will be loaded on the fly
  react: {
    bindI18nStore: "added removed", // Allow rerender ondynamic loading of resources
  },
});
