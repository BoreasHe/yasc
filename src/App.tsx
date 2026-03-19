import { useMediaQuery } from "usehooks-ts";
import { AppContainer } from "./components/AppContainer";

import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { DesktopLayout } from "./DesktopLayout";
import { useRule } from "./lib/hooks/useRule";
import { preprocessFormData } from "./lib/rules/preprocess";
import type { RuleSet } from "./lib/rules/rule.types";
import { MobileLayout } from "./MobileLayout";

export type ProfileForm = ReturnType<
  typeof useForm<Record<string, string | null>>
>;
export type ProfileFormData = Record<string, string | null>;

export interface LayoutProps {
  currentRule: RuleSet;
  form: ReturnType<typeof useForm<ProfileFormData>>;
  preprocessedFormData: ProfileFormData;
}

function App() {
  const mobile = useMediaQuery("(max-width: 1024px)");
  const { currentRule, loadRule } = useRule();

  // Load a default rule on component mount
  useEffect(() => {
    loadRule("canada-crs");
  }, [loadRule]);

  const form = useForm<ProfileFormData>({
    defaultValues: {},
  });

  const formValues = form.watch();

  const preprocessedFormData = useMemo(() => {
    return preprocessFormData(formValues, currentRule?.preprocess || []);
  }, [formValues, currentRule?.preprocess]);

  const Layout = mobile ? MobileLayout : DesktopLayout;

  return (
    <AppContainer>
      {currentRule && (
        <Layout
          currentRule={currentRule}
          form={form}
          preprocessedFormData={preprocessedFormData}
        />
      )}
    </AppContainer>
  );
}

export default App;
