import type { CriterionNode, Node } from "@/lib/rules/eval";
import NumberFlow from "@number-flow/react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ScoringTableEntry } from "./ScoringTableEntry";
import { IconListTree } from "@tabler/icons-react";
import { cn } from "@/lib/utils";

interface ScoringTableLayoutProps {
  ruleId: string;
  node: Node;
  isTopLevel?: boolean;
}

export const ScoringTableLayout = ({
  ruleId,
  node,
  isTopLevel,
}: ScoringTableLayoutProps) => {
  const getNodeKey = (node: Node) => {
    if ("criterionLevel" in node) {
      return node.criterionLevel;
    }
    return node.basis;
  };

  if ("basis" in node) {
    return <ScoringTableEntry node={node} ruleId={ruleId} />;
  }

  if (node.aggregate) {
    return <AggregatedCriterionLayout node={node} ruleId={ruleId} />;
  }

  return (
    <div className={isTopLevel ? "" : "ml-2"}>
      <CriterionHeader node={node} ruleId={ruleId} />
      <div>
        {Object.values(node.children).map((child) => (
          <ScoringTableLayout
            key={getNodeKey(child)}
            node={child}
            ruleId={ruleId}
          />
        ))}
      </div>
      <CriterionFooter node={node} ruleId={ruleId} />
    </div>
  );
};

const AggregatedCriterionLayout = ({
  node,
  ruleId,
}: {
  node: CriterionNode;
  ruleId: string;
}) => {
  const [expandAggregation, setExpandAggregation] = useState(false);

  return (
    <div
      onMouseEnter={() => setExpandAggregation(true)}
      onMouseLeave={() => setExpandAggregation(false)}
      className="py-0 hover:py-1"
    >
      <div className="relative">
        <div
          className={cn(
            "absolute -inset-1 pointer-events-none rounded-sm my-0",
            expandAggregation &&
              "outline-warning/10 outline-2 outline-offset-2 my-1 "
          )}
        />
        <ScoringTableEntry
          node={{
            basis: node.criterionLevel.split(":").pop()!,
            score: node.subTotal,
            dependencies: Object.values(node.children).flatMap((child) =>
              "dependencies" in child ? child.dependencies : []
            ),
          }}
          ruleId={ruleId}
          beforeEl={<IconListTree size={17} stroke={3} />}
        />
        <AnimatePresence>
          {expandAggregation && (
            <motion.div
              className={"ml-2"}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              {Object.values(node.children).map((n) => {
                const key = "criterionLevel" in n ? n.criterionLevel : n.basis;
                return (
                  <ScoringTableLayout key={key} node={n} ruleId={ruleId} />
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const CriterionHeader = ({
  node,
  ruleId,
}: {
  node: CriterionNode;
  ruleId: string;
}) => {
  const { t } = useTranslation(ruleId);

  return (
    <div className="flex flex-row gap-2 items-center mt-2">
      <div className="font-bold font-display text-muted-foreground text-xs ml-0">
        {t(`eval.${node.criterionLevel.split(":").pop()!}`).toUpperCase()}
      </div>
    </div>
  );
};

const CriterionFooter = ({
  node,
  ruleId,
}: {
  node: CriterionNode;
  ruleId: string;
}) => {
  const isCapped = node.max !== undefined && node.max === node.subTotal;

  return (
    <div className="bg-info/10 rounded-sm -mx-1 mt-1">
      <div className="flex flex-row justify-between py-[2px] px-2 items-center">
        <div className="font-bold font-display text-xs text-info/50">
          SUBTOTAL
        </div>
        <div className="flex flex-row gap-1 items-center">
          <div className="text-info/50 font-medium">
            <NumberFlow value={node.subTotal} />
          </div>
          {node.max !== undefined && (
            <div className="text-muted-foreground/50 text-xs font-bold flex flex-row gap-0.5">
              <div>/</div>
              <div className="mt-[2px]">
                {isCapped ? "CAPPED" : "MAX"} {node.max}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
