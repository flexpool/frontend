import React from 'react';
import { InfoBox } from '../InfoBox';

export const ErrorBox: React.FC<{ error?: { message: string } | null }> = ({
  error,
}) => {
  if (error) {
    return <InfoBox variant="error">{error.message}</InfoBox>;
  } else {
    return null;
  }
};
