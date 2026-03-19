import i18n from "i18next";
import { useCallback, useState } from "react";
import yaml from "yaml";

import type {
  RuleSet,
  RuleSetEval,
  RuleSetForm,
  RuleSetMeta,
  RuleSetPreprocess,
} from "../rules/rule.types";
import { ruleFiles, ruleI18nFiles, ruleIds } from "../setup";

export const useRule = () => {
  const [currentRule, setCurrentRule] = useState<RuleSet | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadRule = useCallback(async (ruleId: string) => {
    setIsLoading(true);
    setError(null);
    setCurrentRule(null);

    if (!(ruleId in ruleFiles)) {
      console.error(`Rule file not found for ruleId: ${ruleId}`);
      setError(`Rule set "${ruleId}" not found.`);
      setIsLoading(false);
      return;
    }

    // Load the rule documents
    try {
      const getYamlString = ruleFiles[ruleId];
      const rawYamlString = await getYamlString();

      // Parse the YAML string
      const [metaDoc, formDoc, preprocessDoc, evalDoc] =
        yaml.parseAllDocuments(rawYamlString);

      const rule = {
        // Inject id here
        meta: metaDoc.toJSON().meta as RuleSetMeta,
        form: formDoc.toJSON().form as RuleSetForm[],
        preprocess: preprocessDoc.toJSON().preprocess as
          | RuleSetPreprocess[]
          | undefined,
        eval: evalDoc.toJSON().eval as RuleSetEval[] | undefined,
      };
      setCurrentRule(rule);
      console.info("Loaded rule:", rule.meta.id);
    } catch (e) {
      console.error("Error loading rule:", e);
      setError("Failed to load or parse the rule file.");
    } finally {
      setIsLoading(false);
    }

    // Load the rule i18n
    try {
      const allLanguagesOfRule = Object.entries(ruleI18nFiles).filter(([key]) =>
        key.startsWith(ruleId)
      );

      const i18nObjects = await Promise.all(
        allLanguagesOfRule.map(async ([key, getYamlString]) => {
          const lang = key.split(":")[1];
          const yamlString = await getYamlString();
          return { lang, translations: yaml.parse(yamlString) };
        })
      );

      for (const i18nObject of i18nObjects) {
        i18n.addResourceBundle(
          i18nObject.lang,
          ruleId,
          i18nObject.translations
        );
      }
    } catch (e) {
      console.error("Error loading rule i18n:", e);
      setError("Failed to load or parse the rule i18n file.");
    }
  }, []);

  return {
    currentRule,
    isLoading,
    error,
    availableRules: ruleIds,
    loadRule,
  };
};
