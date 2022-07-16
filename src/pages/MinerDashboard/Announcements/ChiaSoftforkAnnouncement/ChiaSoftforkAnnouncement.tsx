import { Trans } from 'next-i18next';
import AnnouncementBar from '@/components/AnnouncementBar';
import useMinerWorkersQuery from '@/hooks/api/useMinerWorkersQuery';

const ChiaSoftforkAnnouncement = ({ address }: { address: string }) => {
  const { data, isSuccess } = useMinerWorkersQuery(
    {
      coin: 'xch',
      address,
    },
    {
      select: (data) => {
        return data.some((worker) => worker.reportedHashrate === 0);
      },
    }
  );

  if (!isSuccess || data === false) return null;

  return (
    <AnnouncementBar variant="warning" id="chia-softfork">
      <Trans
        ns="dashboard"
        i18nKey="announcements.chia_softfork"
        components={{
          bold: <strong />,
          br: <br />,
        }}
      />
    </AnnouncementBar>
  );
};

export default ChiaSoftforkAnnouncement;
