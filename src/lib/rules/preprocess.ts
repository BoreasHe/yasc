import type { ProfileFormData } from "@/App";
import { evalBasis, searchRuleSetEvalForBasis } from "./eval";
import type {
  CommonReduceConfig,
  ConditionalAssignmentConfig,
  MapValuesConfig,
  RuleSetEvalCriterion,
  RuleSetPreprocess,
  SimulationConfig,
} from "./rule.types";

export const preprocessFormData = (
  form: ProfileFormData,
  preprocess: RuleSetPreprocess[],
  evalConfig: RuleSetEvalCriterion[],
): ProfileFormData => {
  let result = { ...form };
  for (const pipeline of preprocess) {
    switch (pipeline.operation) {
      case "map_values":
        result = mapValues(result, pipeline.config);
        break;
      case "min":
        result = reduceFn(result, pipeline.config, "min");
        break;
      case "max":
        result = reduceFn(result, pipeline.config, "max");
        break;
      case "conditional_assignment":
        result = conditionalAssignment(result, pipeline.config);
        break;
      case "simulation":
        result = simulation(result, pipeline.config, evalConfig);
        break;
      case "sum":
        result = reduceFn(result, pipeline.config, "sum");
        break;
    }
  }

  return result;
};

function mapValues(
  form: ProfileFormData,
  config: MapValuesConfig["config"],
): ProfileFormData {
  const result = { ...form };

  const bothIsArray =
    Array.isArray(config.sources) && Array.isArray(config.outputs);

  if (bothIsArray && config.sources.length !== config.outputs.length) {
    console.warn(
      `Source ${config.sources} or ${config.outputs} length mismatch, can't calculate map_values. Skipping.`,
    );
    return result;
  }

  const sources = Array.isArray(config.sources)
    ? config.sources
    : [config.sources];
  const outputs = Array.isArray(config.outputs)
    ? config.outputs
    : [config.outputs];

  for (const [index, source] of sources.entries()) {
    const formSource = form[source];

    if (!formSource) {
      // console.warn(
      //   `Source ${source} not found in form while preprocessing map_values. Skipping.`
      // );
      continue;
    }

    const mappingValue = config.mapping[formSource];

    if (!mappingValue) {
      // console.warn(
      //   `Value for ${source} not found in mapping while preprocessing map_values. Skipping.`
      // );
      continue;
    }

    // Insert the value into the output field specified, based on the corresponding index of the source
    result[outputs[index]] = mappingValue;
  }
  return result;
}

function reduceFn(
  form: ProfileFormData,
  config: CommonReduceConfig,
  method: "min" | "max" | "sum",
): ProfileFormData {
  const result = { ...form };
  const sources = config.sources.map((source) => form[source]);

  if (config.fallback !== undefined && sources.length > 0) {
    const numberizedSource = sources.map((source) =>
      Number.isNaN(Number(source)) ? Number(config.fallback) : source,
    );

    const num = numberizedSource.reduce(
      (a, b) => {
        if (a === null) return b;

        let n = 0;
        const aNum = Number(a);
        const bNum = Number(b);
        switch (method) {
          case "min":
            n = aNum < bNum ? aNum : bNum;
            break;
          case "max":
            n = aNum > bNum ? aNum : bNum;
            break;
          case "sum":
            n = aNum + bNum;
            break;
        }

        return n;
      },
      null as number | null,
    );

    // num is guaranteed to be a number at this point
    result[config.output] = num!.toString();
  } else {
    // Try to check if all of the source values are numbers
    if (!sources.every((source) => !Number.isNaN(Number(source)))) {
      // console.warn(
      //   `Source ${config.sources.join(
      //     ", "
      //   )} contains non-numeric values, can't perform reduce. Skipping.`
      // );
    }
  }

  return result;
}

function conditionalAssignment(
  form: ProfileFormData,
  config: ConditionalAssignmentConfig["config"],
): ProfileFormData {
  const result = { ...form };

  let conditionMet = false;
  let _left = form[config.if.left];
  let _right = form[config.if.right];

  if (_left === undefined) {
    _left = "0";
    console.warn(
      `Source ${config.if.left} not found in form while preprocessing conditional_assignment. Will use 0 as fallback.`,
    );
  }

  if (_right === undefined) {
    _right = "0";
    console.warn(
      `Source ${config.if.right} not found in form while preprocessing conditional_assignment. Will use 0 as fallback.`,
    );
  }

  const left = Number(_left);
  const right = Number(_right);

  const bothAreNumbers = !Number.isNaN(left) && !Number.isNaN(right);

  if (!bothAreNumbers) {
    console.warn(
      `Source ${config.if.left} or ${config.if.right} is not a number, can't calculate. Skipping.`,
    );
    return result;
  }

  switch (config.if.operation) {
    case "eq":
      conditionMet = form[config.if.left] === config.if.right;
      break;
    case "neq":
      conditionMet = form[config.if.left] !== config.if.right;
      break;
    case "gt":
      if (left !== null && right !== null) {
        conditionMet = left > right;
      } else {
        // console.warn(
        //   `Source ${config.if.left} or ${config.if.right} is not a number, can't calculate gt. Skipping.`
        // );
        return result;
      }
      break;
    case "gte":
      if (left !== null && right !== null) {
        conditionMet = left >= right;
      } else {
        // console.warn(
        //   `Source ${config.if.left} or ${config.if.right} is not a number, can't calculate gte. Skipping.`
        // );
        return result;
      }
      break;
    case "lt":
      if (left !== null && right !== null) {
        conditionMet = left < right;
      } else {
        // console.warn(
        //   `Source ${config.if.left} or ${config.if.right} is not a number, can't calculate lt. Skipping.`
        // );
        return result;
      }
      break;
    case "lte":
      if (left !== null && right !== null) {
        conditionMet = left <= right;
      } else {
        // console.warn(
        //   `Source ${config.if.left} or ${config.if.right} is not a number, can't calculate lte. Skipping.`
        // );
        return result;
      }
      break;
    default:
      throw new Error(`Unknown operator: ${config.if.operation}`);
  }

  if (conditionMet) {
    for (const thenClause of config.then) {
      result[thenClause.output] = result[thenClause.source];
    }
  } else {
    for (const elseClause of config.else) {
      console.log(elseClause);
      result[elseClause.output] = result[elseClause.source];
    }
  }

  return result;
}

function simulation(
  form: ProfileFormData,
  config: SimulationConfig["config"],
  evalConfig: RuleSetEvalCriterion[],
): ProfileFormData {
  const result = { ...form };

  // Find the rule definition for the evaluation rule for this specific simulation
  const ruleDefinition = searchRuleSetEvalForBasis(
    config.eval_rule.split(":"),
    evalConfig,
  );

  if (!ruleDefinition) {
    console.warn(`Rule definition not found for path: ${config.eval_rule}`);
    throw new Error(
      `Rule definition not found for path: ${config.eval_rule} when evaluating simulation in preprocess`,
    );
  }

  const mockBasis = {
    key: config.eval_rule,
    clauses: ruleDefinition.clauses,
  };

  // Create a mock slice of the form for the simulation
  // The input `source` value can be a customized value, not necessarily from a field in the form
  // The `as` field has to match the specified key in the eval rule's basis
  const sources: Record<string, any> = {};
  for (const source of config.sources) {
    sources[source.as] = result[source.source];
  }

  const { score } = evalBasis(mockBasis, sources);

  // Store the simulation result in the form as specified in the config
  result[config.output] = score.toString();

  return result;
}
