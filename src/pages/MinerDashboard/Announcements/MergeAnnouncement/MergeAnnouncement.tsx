import React from 'react';
import Link from 'next/link';
import { useTranslation, Trans } from 'next-i18next';
import AnnouncementBar from '@/components/AnnouncementBar';

const BannerLink = (props: any) => {
  return (
    <Link href="/the-merge-announcement" passHref>
      <a
        style={{
          color: 'white',
          textDecoration: 'underline',
          cursor: 'pointer',
        }}
      >
        {props.children}
      </a>
    </Link>
  );
};

const MergeAnnouncement = () => {
  const { t } = useTranslation('dashboard');

  return (
    <AnnouncementBar variant="primary" id="ethereum-merge" removable={false}>
      <Trans
        t={t}
        i18nKey="announcements.the_merge"
        components={{
          merge: <BannerLink />,
          br: <br />,
        }}
      />
    </AnnouncementBar>
  );
};

export default MergeAnnouncement;
