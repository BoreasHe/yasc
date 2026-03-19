import type { ScoringBasisNode } from "@/lib/rules/eval";
import { useConfigStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import NumberFlow from "@number-flow/react";
import { IconCornerDownRight } from "@tabler/icons-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

interface ScoringTableEntryProps {
  ruleId: string;
  node: ScoringBasisNode;
  beforeEl?: React.ReactNode;
  afterEl?: React.ReactNode;
}

export const ScoringTableEntry = ({
  node,
  ruleId,
  beforeEl,
  afterEl,
}: ScoringTableEntryProps) => {
  const { t } = useTranslation(ruleId);
  const setSelectedScoreBasis = useConfigStore.use.setSelectedScoreBasis();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={cn(
        "rounded-sm -mx-1 hover:cursor-help",
        isHovered && "bg-warning/10",
      )}
    >
      <div
        className={cn(
          "flex flex-row justify-between px-1",
          isHovered && "text-warning",
        )}
        onMouseEnter={() => {
          setIsHovered(true);
          setSelectedScoreBasis({
            basis: node.basis,
            dependencies: node.dependencies,
          });
        }}
        onMouseLeave={() => {
          setIsHovered(false);
          setSelectedScoreBasis(undefined);
        }}
      >
        <div className="flex flex-row gap-1 items-center">
          <IconCornerDownRight
            size={14}
            className={cn(
              "text-muted-foreground mb-1",
              isHovered && "text-warning",
            )}
            stroke={3}
          />
          {beforeEl}
          <div className="text-[14px]">{t(`eval.${node.basis}`)}</div>
          {afterEl}
        </div>
        <NumberFlow value={node.score} />
      </div>
    </div>
  );
};
