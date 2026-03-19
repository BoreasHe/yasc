import type { ProfileFormData } from "@/App";
import type {
  MapValuesConfig,
  MinConfig,
  ConditionalAssignmentConfig,
  RuleSetPreprocess,
} from "./rule.types";

export const preprocessFormData = (
  form: ProfileFormData,
  preprocess: RuleSetPreprocess[]
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
    }
  }

  return result;
};

function mapValues(
  form: ProfileFormData,
  config: MapValuesConfig["config"]
): ProfileFormData {
  const result = { ...form };

  const bothIsArray =
    Array.isArray(config.sources) && Array.isArray(config.outputs);

  if (bothIsArray && config.sources.length !== config.outputs.length) {
    console.warn(
      `Source ${config.sources} or ${config.outputs} length mismatch, can't calculate map_values. Skipping.`
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
  config: MinConfig["config"],
  method: "min" | "max" | "sum"
): ProfileFormData {
  const result = { ...form };
  const sources = config.sources.map((source) => form[source]);

  if (config.fallback !== undefined && sources.length > 0) {
    const numberizedSource = sources.map((source) =>
      Number.isNaN(Number(source)) ? Number(config.fallback) : source
    );

    const num = numberizedSource.reduce((a, b) => {
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
    }, null as number | null);

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
  config: ConditionalAssignmentConfig["config"]
): ProfileFormData {
  const result = { ...form };

  let conditionMet = false;
  const left = form[config.if.left];
  const right = form[config.if.right];

  if (left === undefined || right === undefined) {
    console.warn(
      `Source ${config.if.left} or ${config.if.right} not found in form while preprocessing conditional_assignment. Skipping.`
    );
    return result;
  }

  const bothAreNumbers =
    !Number.isNaN(Number(left)) && !Number.isNaN(Number(right));

  switch (config.if.operation) {
    case "eq":
      conditionMet = form[config.if.left] === config.if.right;
      break;
    case "neq":
      conditionMet = form[config.if.left] !== config.if.right;
      break;
    case "gt":
      if (bothAreNumbers && left !== null && right !== null) {
        conditionMet = left > right;
      } else {
        // console.warn(
        //   `Source ${config.if.left} or ${config.if.right} is not a number, can't calculate gt. Skipping.`
        // );
        return result;
      }
      break;
    case "gte":
      if (bothAreNumbers && left !== null && right !== null) {
        conditionMet = left >= right;
      } else {
        // console.warn(
        //   `Source ${config.if.left} or ${config.if.right} is not a number, can't calculate gte. Skipping.`
        // );
        return result;
      }
      break;
    case "lt":
      if (bothAreNumbers && left !== null && right !== null) {
        conditionMet = left < right;
      } else {
        // console.warn(
        //   `Source ${config.if.left} or ${config.if.right} is not a number, can't calculate lt. Skipping.`
        // );
        return result;
      }
      break;
    case "lte":
      if (bothAreNumbers && left !== null && right !== null) {
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
