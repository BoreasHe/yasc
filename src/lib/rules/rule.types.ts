export interface RuleSet {
  meta: RuleSetMeta;
  form: RuleSetForm[];
  preprocess?: RuleSetPreprocess[];
  eval?: RuleSetEval[];
}

export interface RuleSetMeta {
  id: string;
  version: string;
}

// Form related types

export type RuleSetForm = {
  key: string;
  type: string;
  prerequisites?: Record<string, string>;
} & FormFieldValues;

export type FormFieldValues =
  | {
      values: string[];
    }
  | {
      use: string; // Directly copy the values from another form field
    };

// Preprocess related types

const preprocessOperations = [
  "map_values",
  "min",
  "max",
  "conditional_assignment",
] as const;

type PreprocessOperation = (typeof preprocessOperations)[number];

export type RuleSetPreprocess = {
  key: string;
} & (MapValuesConfig | MinConfig | MaxConfig | ConditionalAssignmentConfig);

export interface MapValuesConfig {
  operation: "map_values";
  config: {
    sources: string | string[];
    outputs: string | string[];
    mapping: Record<string, string>;
  };
}

export interface MinConfig {
  operation: "min";
  config: {
    sources: string[];
    output: string;
    min: number;
    fallback?: string;
  };
}

export interface MaxConfig {
  operation: "max";
  config: {
    sources: string[];
    output: string;
    min: number;
    fallback?: string;
  };
}

type Operator = "eq" | "neq" | "gt" | "gte" | "lt" | "lte";

export interface ConditionalAssignmentConfig {
  operation: "conditional_assignment";
  config: {
    if: {
      operation: Operator;
      left: string;
      right: string;
    };
    then: {
      source: string;
      output: string;
    }[];
    else: {
      source: string;
      output: string;
    }[];
  };
}

// Eval related types

export type RuleSetEval = RuleSetEvalCriterion;

export type RuleSetEvalCriterion = {
  key: string;
} & (
  | {
      max?: number;
      sub: RuleSetEvalCriterion[];
      aggregate?: boolean;
    }
  | ClausesDefinition
  | {
      use: string;
    }
);

export interface ClausesDefinition {
  clauses: {
    if: Record<string, ClauseCondition[]>;
    score: number;
  }[];
  template?: {
    find: string;
    replace: string;
    with: string[];
  };
}
export type ClauseCondition = string | string[];
