import { useHistory, useLocation } from 'react-router';
import qs from 'query-string';
import { TextInput } from 'src/components/Form/TextInput';
import { DivText, Highlight } from 'src/components/Typo/Typo';
import { Spacer } from 'src/components/layout/Spacer';
import React from 'react';

export const SetWorkerNameSection = () => {
  const history = useHistory();
  const { search } = useLocation();

  const value = React.useMemo(() => {
    const parsedSearch = qs.parse(search);
    return parsedSearch.workerName || '';
  }, [search]);

  const handleInputChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      const parsedSearch = qs.parse(search);
      history.replace({
        search: qs.stringify({
          ...parsedSearch,
          workerName: value,
        }),
      });
    },
    [search, history]
  );

  return (
    <>
      <h2>
        <Highlight>#3</Highlight> Name your worker
      </h2>
      <p>
        Naming your worker is recommended if you have multiple mining rigs
        connected to Flexpool. This will give you more clarity about how your
        mining rigs perform on your dashboard page.
      </p>
      <Spacer />
      <DivText>
        <TextInput
          label="Worker name"
          placeholder="e.g. MY_RIG_580x2"
          value={value}
          onChange={handleInputChange}
          spellCheck="false"
          autoComplete="off"
        />
      </DivText>
    </>
  );
};
