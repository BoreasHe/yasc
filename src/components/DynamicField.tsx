import type { ProfileForm } from "@/App";
import type { RuleSetForm } from "@/lib/rules/rule.types";
import { useConfigStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { IconGitBranch } from "@tabler/icons-react";
import { AnimatePresence, motion } from "motion/react";
import { useMemo } from "react";
import type { ControllerRenderProps } from "react-hook-form";
import { Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import type { FormFieldWithDependents } from "./FormSection";
import { Button } from "./shadcn/Button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "./shadcn/Field";

type DynamicFieldProps = {
  form: ProfileForm;
  fields: RuleSetForm[];
  name: string;
  field: RuleSetForm;
  ruleId: string;
  dependents?: FormFieldWithDependents[];
  enableCondition?: {
    key: string;
    value: string;
    enabled: boolean;
  };
};

export const DynamicField = ({
  form,
  fields,
  name,
  field,
  ruleId,
  dependents,
  enableCondition,
}: DynamicFieldProps) => {
  const { t } = useTranslation(ruleId);
  const selectedScoreBasis = useConfigStore.use.selectedScoreBasis();
  const formValue = form.watch(name);
  const namespace = `form.${name}`;

  const handleChange = (value: string | null) => {
    form.setValue(name, value);

    // Unset all dependent fields
    dependents?.forEach((dependent) => {
      form.setValue(dependent.key, null);
    });
  };

  const questionVisible =
    enableCondition === undefined || enableCondition.enabled;

  const visibleDependents = useMemo(
    () =>
      dependents?.filter((dependent) => {
        return formValue === Object.values(dependent.prerequisites!)[0];
      }) || [],
    [dependents, formValue],
  );

  const fieldValues = useMemo(() => {
    if ("values" in field) {
      return field.values;
    }

    // Else it uses the values from another field
    const target = fields.find((f) => f.key === field.use);
    if (!target || !("values" in target)) {
      throw new Error(
        `Field ${field.use} does not have a values property and now it is being used as a dependency. Please check the rule set.`,
      );
    }

    return target.values;
  }, [field, fields]);

  const desc = t(`${namespace}.desc`, "");

  return (
    <div>
      {questionVisible && (
        <div
          className={cn(
            "px-4 py-3 border-[1.5px] border-dashed border-muted-foreground/20 rounded-md bg-card",
            selectedScoreBasis?.dependencies.includes(name) &&
              "border-warning bg-warning/10",
          )}
        >
          {enableCondition && (
            <Condition enableCondition={enableCondition} ruleId={ruleId} />
          )}
          <Controller
            name={name}
            control={form.control}
            render={({ field: _field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="gap-2">
                <FieldLabel htmlFor={_field.name} className="text-lg">
                  {t(`${namespace}.label`)}
                </FieldLabel>
                {!!desc && <FieldDescription>{desc}</FieldDescription>}
                <div className="flex flex-row flex-wrap gap-2 mt-2">
                  {fieldValues.map((value) => (
                    <DynamicFieldOption
                      key={value}
                      ruleId={ruleId}
                      field={_field}
                      overrideI18n={"use" in field ? field.use : undefined}
                      value={value}
                      handleValueChange={handleChange}
                    />
                  ))}
                </div>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </div>
      )}
      <AnimatePresence>
        {visibleDependents.length > 0 && (
          <div className="ml-2">
            <FieldGroup className="gap-0">
              {visibleDependents.map((dependent, index) => {
                // TODO: Handle multiple prerequisites
                const thePrerequisite = Object.entries(
                  dependent.prerequisites!,
                )[0];

                const isLastChild = index === visibleDependents.length - 1;

                return (
                  <motion.div
                    key={dependent.key}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="border-l border-dashed border-muted-foreground/20 h-2" />
                    <div
                      className={cn(
                        "border-l border-dashed border-muted-foreground/20 pl-2 relative",
                        isLastChild && "border-l-0",
                      )}
                    >
                      <div className="absolute left-0 top-[25px] w-[8px] h-0 border-b border-dashed" />
                      {isLastChild && (
                        <div className="absolute left-0 top-0 w-0 h-[25px] border-l border-dashed" />
                      )}
                      <DynamicField
                        form={form}
                        name={dependent.key}
                        field={dependent}
                        fields={fields}
                        ruleId={ruleId}
                        enableCondition={{
                          key: name,
                          value: thePrerequisite[1],
                          enabled: form.getValues(name) === thePrerequisite[1],
                        }}
                        dependents={dependent.dependents}
                      />
                    </div>
                  </motion.div>
                );
              })}
            </FieldGroup>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

interface DynamicFieldOptionProps {
  field: ControllerRenderProps<Record<string, string | null>, string>;
  overrideI18n?: string;
  ruleId: string;
  value: string;
  handleValueChange: (value: string | null) => void;
}

const DynamicFieldOption = ({
  field,
  ruleId,
  overrideI18n,
  value,
  handleValueChange,
}: DynamicFieldOptionProps) => {
  const { t } = useTranslation(ruleId);

  const namespace = `form.${overrideI18n || field.name}`;
  const isSelected = field.value === value;

  const handleClick = (value: string | null) => {
    if (isSelected) {
      handleValueChange(null);
    } else {
      handleValueChange(value);
    }
  };

  return (
    <Button
      key={value}
      variant="outline"
      size="sm"
      type="button"
      className={`${
        isSelected
          ? "bg-success/25! text-success! border-success! outline-success/10! outline-3! outline-solid!"
          : ""
      }`}
      onClick={() => handleClick(value)}
    >
      <span className="font-body font-normal md:font-light text-[17px] md:text-[15px]">
        {t(`${namespace}.values.${value}`, value)}
      </span>
    </Button>
  );
};

const Condition = ({
  enableCondition,
  ruleId,
}: {
  enableCondition: DynamicFieldProps["enableCondition"];
  ruleId: string;
}) => {
  const { t } = useTranslation(ruleId);

  return (
    <div className="flex flex-row gap-2">
      <IconGitBranch size={16} className="mt-[2.5px] text-success/50" />
      <div className="text-muted-foreground text-sm">
        {t(`form.${enableCondition?.key}.label`)}
      </div>
      <div className="font-bold font-display text-muted-foreground/50 text-sm">
        =
      </div>
      <div className="text-success/50 text-sm">
        {t(`form.${enableCondition?.key}.values.${enableCondition?.value}`)}
      </div>
    </div>
  );
};
