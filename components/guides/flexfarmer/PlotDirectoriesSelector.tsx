import { Trans, useTranslation } from 'next-i18next';
import React from 'react';
import { IoMdRemove, IoMdAdd } from 'react-icons/io';
import { Button } from 'src/components/Button';
import { TextInput } from 'src/components/Form/TextInput';
import { Divider } from 'src/components/layout/Divider';
import { Spacer } from 'src/components/layout/Spacer';
import styled from 'styled-components';

const PlotDirectorySelectorWrapper = styled.div`
  display: flex;

  div:first-child {
    width: 100%;
  }
`;

const InputButton = styled(Button)`
  margin-left: 1em;
  margin-top: 1.625em;
`;

const PlotDirectoriesHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const PlotDirectoriesHeading = styled.div`
  font-size: 1.25em;
  font-weight: 700;
`;

export const PlotDirectoriesSelector: React.FC<{
  os: string;
  dirs: string[];
  setDirs: (dirs: string[]) => void;
}> = ({ os, dirs, setDirs }) => {
  const { t } = useTranslation('guide-flexfarmer');

  const handleInputChange = React.useCallback(
    (value: string, index: number) => {
      const tmp = [...dirs];
      tmp[index] = value;
      setDirs(tmp);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dirs]
  );

  const removeDir = React.useCallback(
    (index: number) => {
      const tmp = [...dirs];
      tmp.splice(index, 1);
      setDirs(tmp);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dirs]
  );

  const addNewDir = React.useCallback(() => {
    const tmp = [...dirs, ''];
    setDirs(tmp);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dirs]);

  return (
    <>
      <PlotDirectoriesHeader>
        <PlotDirectoriesHeading>
          {t('plot_directories.selected_dirs', { value: dirs.length })}
        </PlotDirectoriesHeading>
        <Button onClick={() => addNewDir()}>
          <IoMdAdd />
        </Button>
      </PlotDirectoriesHeader>
      <Spacer />
      <Divider />
      <Spacer />
      {dirs.map((item, index) => {
        return (
          <>
            <PlotDirectorySelectorWrapper>
              <TextInput
                key={index}
                autoComplete="off"
                spellCheck="false"
                label={t('plot_directories.plot_dir', { value: index + 1 })}
                placeholder={os === 'windows' ? 'C:\\Plots' : '/mnt/plots'}
                value={item}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleInputChange(e.target.value, index)
                }
              />
              <InputButton onClick={() => removeDir(index)} disabled={dirs.length == 1}>
                <IoMdRemove />
              </InputButton>
            </PlotDirectorySelectorWrapper>
            <Spacer />
          </>
        );
      })}
    </>
  );
};
