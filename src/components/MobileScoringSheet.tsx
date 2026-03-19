import type { NodeMap } from "@/lib/rules/eval";
import { ScoringTable } from "./ScoreDisplaySection";
import { Sheet, SheetContent } from "./shadcn/Sheet";

interface MobileScoringSheetProps {
  criteria: NodeMap;
  ruleId: string;
  open: boolean;
  onClose: () => void;
}

export function MobileScoringSheet({
  criteria,
  ruleId,
  open,
  onClose,
}: MobileScoringSheetProps) {
  return (
    <Sheet open={open}>
      <SheetContent
        side="bottom"
        className="rounded-t-xl [&>button:first-of-type]:hidden"
      >
        <div className="px-6 py-4 mb-16 max-h-[calc(90dvh-24px)] flex flex-col">
          <ScoringTable criteria={criteria} ruleId={ruleId} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
