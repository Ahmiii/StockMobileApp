import SectionHeader from "@/molecules/SectionHeader";
import SyncStatus from "@/molecules/SyncStatusCard";

type Props = { syncLabel: string };

const PortfolioHeader = ({ syncLabel }: Props) => (
  <SectionHeader
    title="PORTFOLIO"
    size="base"
    right={<SyncStatus label={syncLabel} />}
  />
);

export default PortfolioHeader;
