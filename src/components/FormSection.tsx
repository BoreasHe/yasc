import type { ProfileForm } from "@/App";
import { Badge } from "@shadcn/Badge";
import i18n from "i18next";
import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import type { RuleSetForm } from "@/lib/rules/rule.types";
import type { RuleSet } from "@/lib/rules/rule.types";
import { DynamicField } from "./DynamicField";
import { FieldGroup } from "./shadcn/Field";
import { ScrollArea } from "./shadcn/ScrollArea";
import { ScrollAreaScrollbar } from "@radix-ui/react-scroll-area";
import { cn } from "@/lib/utils";

interface FormSectionProps {
  form: ProfileForm;
  rule: RuleSet;
  className?: string;
}

export type FormFieldWithDependents = RuleSetForm & {
  dependents?: FormFieldWithDependents[];
};

// Helper function to recursively find a field and add a dependent to it
function findAndAddDependent(
  fields: FormFieldWithDependents[],
  targetKey: string,
  dependent: FormFieldWithDependents,
): boolean {
  for (let i = 0; i < fields.length; i++) {
    if (fields[i].key === targetKey) {
      // Found the target field, add the dependent
      fields[i] = {
        ...fields[i],
        dependents: [...(fields[i].dependents || []), dependent],
      };
      return true;
    }

    const fieldDependent = fields[i].dependents;

    // Recursively search in nested dependents
    if (fieldDependent && fieldDependent.length > 0) {
      if (findAndAddDependent(fieldDependent, targetKey, dependent)) {
        return true;
      }
    }
  }
  return false;
}

export function FormSection({ rule, form, className }: FormSectionProps) {
  const { t } = useTranslation(rule.meta.id);

  useEffect(() => {
    i18n.changeLanguage(i18n.language); // Hack to force re-render
  }, []);

  const formFields = useMemo(() => {
    return rule.form.reduce((cur, next) => {
      if (next.prerequisites) {
        const firstPrerequisiteKey = Object.keys(next.prerequisites)[0];

        // Try to find and add to the prerequisite field (recursively)
        const found = findAndAddDependent(cur, firstPrerequisiteKey, next);

        if (!found) {
          console.warn(
            `Prerequisite field ${Object.keys(next.prerequisites).join(
              ",",
            )} not found in form schema. Skipping field ${next.key}`,
          );
        }
      } else {
        // No prerequisites, add to top level
        cur.push(next);
      }

      return cur;
    }, [] as FormFieldWithDependents[]);
  }, [rule]);

  useEffect(() => {
    console.log("Form Fields:", formFields);
  }, [formFields]);

  return (
    <div className={cn("flex-1 bg-card/50 flex flex-col min-h-0", className)}>
      <ScrollArea className="h-full flex-1">
        <div className="py-6 md:py-8 px-4 md:px-8 flex flex-col gap-8">
          {/* Rule Set Header */}
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-bold font-display flex flex-row justify-start items-center gap-2">
              <span className="text-muted-foreground/50">Rule Set: </span>
              <div className="flex items-center gap-2">
                <span>{t(`meta.title`)}</span>
                <Badge variant="outline">{rule.meta.version}</Badge>
              </div>
            </h2>
            <p className="text-muted-foreground">{t(`meta.desc`)}</p>
          </div>

          <form>
            <FieldGroup className="gap-4">
              {formFields.map((r) => (
                <DynamicField
                  key={r.key}
                  field={r}
                  fields={rule.form}
                  form={form}
                  name={r.key}
                  ruleId={rule.meta.id}
                  dependents={r.dependents}
                />
              ))}
            </FieldGroup>
          </form>
        </div>
        <ScrollAreaScrollbar orientation="vertical" />
      </ScrollArea>
    </div>
  );
}
