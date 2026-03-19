import type { StoreApi, UseBoundStore } from "zustand";
import { create } from "zustand";
import type { RuleSet } from "./rules/rule.types";

type WithSelectors<S> = S extends { getState: () => infer T }
  ? S & { use: { [K in keyof T]: () => T[K] } }
  : never;

const createSelectors = <S extends UseBoundStore<StoreApi<object>>>(
  _store: S
) => {
  const store = _store as WithSelectors<typeof _store>;
  store.use = {};
  for (const k of Object.keys(store.getState())) {
    (store.use as any)[k] = () => store((s) => s[k as keyof typeof s]);
  }

  return store;
};

type Theme = "system" | "light" | "dark";

interface SelectedScoreBasis {
  basis: string;
  dependencies: string[];
}

interface ConfigState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  ruleSet: RuleSet | undefined;
  setRuleSet: (ruleSet: RuleSet) => void;
  selectedScoreBasis: SelectedScoreBasis | undefined;
  setSelectedScoreBasis: (
    selectedScoreBasis: SelectedScoreBasis | undefined
  ) => void;
}

const useConfigStoreBase = create<ConfigState>()((set) => ({
  theme: "system",
  setTheme: (theme: Theme) => set({ theme }),
  ruleSet: undefined,
  setRuleSet: (ruleSet: RuleSet) => set({ ruleSet }),
  selectedScoreBasis: undefined,
  setSelectedScoreBasis: (selectedScoreBasis: SelectedScoreBasis | undefined) =>
    set({ selectedScoreBasis }),
}));

export const useConfigStore = createSelectors(useConfigStoreBase);
