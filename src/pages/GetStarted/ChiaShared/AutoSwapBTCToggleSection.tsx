import { useState } from 'react';
import { MineBTCBox } from '../common/MineBTCBox';
import { Spacer } from '@/components/layout/Spacer';

export const AutoSwapBTCToggleSection = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [checked, setChecked] = useState(false);

  return (
    <div>
      <MineBTCBox checked={checked} onClick={setChecked} />

      {checked && (
        <>
          <Spacer size="sm" />
          {children}
        </>
      )}
    </div>
  );
};
