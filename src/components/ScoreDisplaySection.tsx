import type { ProfileFormData } from "@/App";
import { computeScore, type Node, type NodeMap } from "@/lib/rules/eval";
import { type RuleSet } from "@/lib/rules/rule.types";
import NumberFlow from "@number-flow/react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@shadcn/Card";
import { useMemo } from "react";
import { ScoringTableLayout } from "./ScoringTableLayout";
import { ScrollArea } from "./shadcn/ScrollArea";
import { ScrollAreaScrollbar } from "@radix-ui/react-scroll-area";
import { AppInfo } from "./AppInfo";

interface ScoreDisplaySectionProps {
  rule: RuleSet;
  preprocessedFormData: ProfileFormData;
}

export function ScoreDisplaySection({
  rule,
  preprocessedFormData,
}: ScoreDisplaySectionProps) {
  const scoringTable = useMemo(() => {
    console.log("preprocessedFormData", preprocessedFormData);
    return computeScore(rule, preprocessedFormData);
  }, [rule, preprocessedFormData]);

  return (
    <div className="min-w-[400px] min-h-0 relative">
      <Card className="max-h-full flex flex-col overflow-hidden h-full">
        <CardHeader>
          <CardTitle className="text-md font-bold font-display -mb-2">
            Scoring Table
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 min-h-0 flex flex-col h-full">
          <ScoringTable
            criteria={scoringTable.criteria}
            ruleId={rule.meta.id}
          />
        </CardContent>
        <CardFooter className="flex justify-between items-end">
          <div className="text-sm font-display font-bold text-muted-foreground">
            TOTAL SCORE
          </div>
          <div className="text-3xl text-info font-bold font-display -mb-1">
            <NumberFlow value={scoringTable.total} />
          </div>
        </CardFooter>
      </Card>
      {/* The absolute positioning is a workaround for a CSS issue with shadcn scroll area */}
      <AppInfo className="absolute" />
    </div>
  );
}

export const ScoringTable = ({
  criteria,
  ruleId,
}: {
  criteria: NodeMap;
  ruleId: string;
}) => {
  const getNodeKey = (node: Node) => {
    if ("criterionLevel" in node) {
      return node.criterionLevel;
    }
    return node.basis;
  };

  return (
    <ScrollArea className="min-h-0 flex-1 -mx-4 h-full">
      <div className="flex flex-col gap-2 px-4">
        {Object.values(criteria).map((node) => (
          <ScoringTableLayout
            key={getNodeKey(node)}
            node={node}
            ruleId={ruleId}
            isTopLevel
          />
        ))}
      </div>
      <ScrollAreaScrollbar orientation="vertical" />
    </ScrollArea>
  );
};
