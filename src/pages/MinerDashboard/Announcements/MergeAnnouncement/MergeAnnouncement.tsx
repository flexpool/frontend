import React from 'react';
import Link from 'next/link';
import AnnouncementBar from '@/components/AnnouncementBar';

const MergeAnnouncement = () => {
  return (
    <AnnouncementBar variant="primary" id="ethereum-merge" removable={false}>
      The Merge has been confirmed for September 15. After that, the Ethereum
      mining will no longer be possible. Please read our{' '}
      <Link href="/the-merge-announcement" passHref>
        <a
          style={{
            color: 'white',
            textDecoration: 'underline',
            cursor: 'pointer',
          }}
        >
          our official announcement
        </a>
      </Link>{' '}
      for details.
    </AnnouncementBar>
  );
};

export default MergeAnnouncement;
