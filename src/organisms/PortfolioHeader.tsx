import SectionHeader from "@/molecules/SectionHeader";
import SyncStatus from "@/molecules/SyncStatusCard";

type Props = {
  syncLabel: string;
  /** Green only for a finished sync; grey or red for everything else. */
  syncTone?: "success" | "danger" | "neutral";
};

const PortfolioHeader = ({ syncLabel, syncTone = "success" }: Props) => (
  <SectionHeader
    title="PORTFOLIO"
    size="base"
    right={<SyncStatus label={syncLabel} tone={syncTone} />}
  />
);

export default PortfolioHeader;
