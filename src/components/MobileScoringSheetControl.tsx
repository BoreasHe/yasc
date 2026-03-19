import type { ProfileFormData } from "@/App";
import { computeScore } from "@/lib/rules/eval";
import type { RuleSet } from "@/lib/rules/rule.types";
import NumberFlow from "@number-flow/react";
import {
  IconLayoutSidebarRightCollapse,
  IconListDetails,
  IconMoodSpark,
} from "@tabler/icons-react";
import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";
import { MobileScoringSheet } from "./MobileScoringSheet";
import { Button } from "./shadcn/Button";

interface MobileScoringSheetButtonProps {
  rule: RuleSet;
  preprocessedFormData: ProfileFormData;
}

export function MobileScoringSheetControl({
  rule,
  preprocessedFormData,
}: MobileScoringSheetButtonProps) {
  const [expanded, setExpanded] = useState(false);

  const scoringTable = useMemo(() => {
    return computeScore(rule, preprocessedFormData);
  }, [rule, preprocessedFormData]);

  return (
    <>
      <div className="flex flex-row gap-2">
        <div className="bg-info/5 rounded-lg p-2 py-0.5 flex items-center gap-2">
          <div className="text-3xl text-info font-bold font-display min-w-[90px] text-right flex flex-row justify-between items-center">
            <IconMoodSpark size={28} className="opacity-50" />
            <div>
              <NumberFlow value={scoringTable.total} />
            </div>
          </div>
        </div>
        <Button
          onClick={() => setExpanded(!expanded)}
          variant="outline"
          className={
            "size-12 relative overflow-hidden bg-info/10! border-info/20! text-info"
          }
          size={"sm"}
          aria-label="Toggle scoring table sheet"
        >
          <AnimatePresence>
            {!expanded ? (
              <motion.div
                key="list-details"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="absolute"
              >
                <IconListDetails aria-label="List Details" className="size-6" />
              </motion.div>
            ) : (
              <motion.div
                key="hide-details"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="absolute"
              >
                <IconLayoutSidebarRightCollapse
                  aria-label="Hide Details"
                  className="rotate-90 size-6"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </Button>
      </div>
      <MobileScoringSheet
        ruleId={rule.meta.id}
        criteria={scoringTable.criteria}
        open={expanded}
        onClose={() => setExpanded(false)}
      />
    </>
  );
}
