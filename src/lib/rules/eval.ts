import type { ProfileFormData } from "@/App";
import type {
  ClauseCondition,
  ClausesDefinition,
  RuleSet,
  RuleSetEval,
  RuleSetEvalCriterion,
} from "./rule.types";

interface ScoringTable {
  criteria: Record<string, Node>;
  total: number;
}

export interface CriterionNode {
  criterionLevel: string;
  max?: number;
  aggregate?: boolean;
  subTotal: number;
  children: NodeMap;
}

export interface ScoringBasisNode {
  basis: string;
  dependencies: string[];
  score: number;
}

export type Node = CriterionNode | ScoringBasisNode;
export type NodeMap = Record<string, Node>;

export function computeScore(
  rule: RuleSet,
  formData: ProfileFormData
): ScoringTable {
  const evalRules = rule.eval;

  if (!evalRules) {
    throw new Error("No eval rules found");
  }

  const criteria: Record<string, Node> = {};

  for (const criterion of evalRules) {
    const node = buildCriterionNode(criterion, formData, [], evalRules);
    if (node.dependencies !== undefined) {
      criteria[criterion.key] = {
        ...node,
        dependencies: Array.from(node.dependencies),
      };
    } else {
      criteria[criterion.key] = node;
    }
  }

  console.log("Scoring Table:", criteria);

  // Recursively iterate the object to fill in the total and subtotal values
  for (const node of Object.values(criteria)) {
    calculateNode(node);
  }

  return {
    criteria,
    total: calculateTotal(criteria),
  };
}

function buildCriterionNode(
  criterion: RuleSetEvalCriterion,
  formData: ProfileFormData,
  levelStack: string[],
  evalRules: RuleSetEval[]
) {
  const newLevelStack = [...levelStack];
  newLevelStack.push(criterion.key);

  // This is a parent node
  if ("sub" in criterion) {
    const subCriteria: Record<string, Node> = {};

    for (const subCriterion of criterion.sub) {
      // Most of the time it will only contain one element
      const derivedSubCriterion: RuleSetEvalCriterion[] = [];

      // If template is defined, duplicate copies of the template instead of directly using the sub criterion
      if ("template" in subCriterion && !!subCriterion.template) {
        const template = subCriterion.template;

        for (const templateCopy of template.with) {
          // Replace the template key with the actual key
          const newTemplateKey = subCriterion.key.replace(
            template.replace,
            templateCopy
          );

          // Replace the inner if conditions' keys
          const newClauses = subCriterion.clauses.reduce((acc, next) => {
            const newIf = Object.entries(next.if).reduce(
              (acc, [key, value]) => {
                const newKey = key.replace(template.replace, templateCopy);
                acc[newKey] = value;
                return acc;
              },
              {} as Record<string, ClauseCondition[]>
            );

            acc.push({
              ...next,
              if: newIf,
            });

            return acc;
          }, [] as ClausesDefinition["clauses"]);

          derivedSubCriterion.push({
            ...subCriterion,
            key: newTemplateKey,
            clauses: newClauses,
          });
        }
      } else {
        derivedSubCriterion.push(subCriterion);
      }

      for (const derived of derivedSubCriterion) {
        const node = buildCriterionNode(
          derived,
          formData,
          newLevelStack,
          evalRules
        );

        if (node.dependencies !== undefined) {
          subCriteria[derived.key] = {
            ...node,
            dependencies: Array.from(node.dependencies),
          };
        } else {
          subCriteria[derived.key] = node;
        }
      }
    }

    return {
      criterionLevel: newLevelStack.join(":"),
      max: criterion.max,
      aggregate: criterion.aggregate,
      subTotal: 0,
      children: subCriteria,
    };
  } else {
    let evalTarget: Basis;

    // Retrieve reference from another criterion
    if ("use" in criterion) {
      const keyPath = criterion.use.split(":");
      const node = searchRuleSetEvalForBasis(keyPath, evalRules);
      if (!node) {
        throw new Error(`Use target ${criterion.use} not found`);
      }

      // Construct a new basis node that consist of current key and the referenced clauses
      evalTarget = {
        key: criterion.use,
        clauses: node.clauses,
      };
    } else {
      evalTarget = criterion;
    }

    const { score, dependencies } = evalBasis(evalTarget, formData);

    return {
      basis: criterion.key,
      dependencies,
      score,
    };
  }
}

function searchRuleSetEvalForBasis(
  fullKey: string[],
  criteria: RuleSetEvalCriterion[]
): ClausesDefinition | null {
  const targetKey = fullKey.shift();

  if (!targetKey) {
    console.error("Invalid key path");
    return null;
  }

  const criterion = criteria.find((c) => c.key === targetKey);

  if (!criterion) {
    console.error(`Target key ${targetKey} not found`);
    return null;
  }

  // Basis node
  if ("clauses" in criterion) {
    return criterion;
  }

  if ("use" in criterion) {
    throw new Error(
      `Multiple level of referencing not supported in searchRuleSetEvalForBasis`
    );
  }

  // Search criterion node with a shifted key
  return searchRuleSetEvalForBasis(fullKey, criterion.sub);
}

interface Basis {
  key: string;
  clauses: { if: Record<string, ClauseCondition[]>; score: number }[];
}

function evalBasis(
  basis: Basis,
  formData: ProfileFormData
): {
  score: number;
  dependencies: Set<string>;
} {
  // Only for UI/UX
  const dependencies: Set<string> = new Set();

  for (const condition of basis.clauses) {
    try {
      const allConditionsMet = Object.entries(condition.if).every(
        ([fieldName, targetValue]) => {
          if (!dependencies.has(fieldName)) dependencies.add(fieldName);

          // If the target value is an array, it will be an OR condition
          // In this case we only need one of the values to match
          if (Array.isArray(targetValue)) {
            return targetValue.some((value) => formData[fieldName] === value);
          }

          // Otherwise compare it directly to the value
          return formData[fieldName] === targetValue;
        }
      );

      if (allConditionsMet) {
        return { score: condition.score, dependencies };
      }
    } catch (e) {
      console.error(
        `Error occurred while evaluating condition ${basis.key}:`,
        e
      );
      return { score: 0, dependencies };
    }
  }

  return {
    score: 0,
    dependencies,
  };
}

function calculateNode(node: Node): number {
  // Scoring basis node
  if (!("children" in node)) {
    return node.score;
  }

  // Criterion node
  let sum = 0;

  for (const child of Object.values(node.children)) {
    sum += calculateNode(child);
  }

  if (node.max !== undefined) {
    sum = Math.min(sum, node.max);
  }

  node.subTotal = sum;
  return sum;
}

function calculateTotal(criteria: NodeMap): number {
  let total = 0;

  for (const node of Object.values(criteria)) {
    total += calculateNode(node);
  }

  return total;
}
