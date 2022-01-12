import React from 'react';
import { CheckboxField } from '@/components/Form/Checkbox';

const AcknowledgeCheckbox = () => {
  return (
    <CheckboxField
      label={
        'I acknowledge that higher difficulty will make the effective space calculations less precise.'
      }
      name="acknowledge"
    />
  );
};

export default AcknowledgeCheckbox;
