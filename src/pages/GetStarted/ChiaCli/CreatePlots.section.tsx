import React from 'react';
import { Trans, useTranslation } from 'next-i18next';
import { Spacer } from 'src/components/layout/Spacer';
import { LinkOut } from 'src/components/LinkOut';
import { TerminalCommand } from './TerminalCommand';

export const StandardPlotterGuide = () => {
  const { t } = useTranslation('get-started');
  return (
    <>
      <p>
        <Trans
          ns="get-started"
          i18nKey="detail_xch.create_plots.standard.desc"
        />
      </p>
      <Spacer />
      <p>{t('detail_xch.create_plots.standard.create_plots_command')}</p>
      <TerminalCommand
        cmd={`chia plots create -k 32 -n <plot-count> -r <thread-count> -c <p2-singleton-address> -f <farmer-public-key> -t <tmpdir> -d <final-dir>`}
      />
    </>
  );
};

export const MadmaxPlotterGuide = () => {
  const { t } = useTranslation('get-started');
  return (
    <>
      <p>
        <Trans
          ns="get-started"
          i18nKey="detail_xch.create_plots.madmax.desc"
          components={{
            plotter: (
              <LinkOut href="https://github.com/madMAx43v3r/chia-plotter" />
            ),
            madmax: <LinkOut href="https://github.com/madMAx43v3r" />,
          }}
        />
      </p>
      <Spacer />
      <p>{t('detail_xch.create_plots.madmax.install_dependencies_command')}</p>
      <TerminalCommand cmd={`sudo apt install libsodium-dev`} />
      <Spacer />
      <p>
        <b>{t('detail.note') + ' '}</b>
        <Trans
          ns="get-started"
          i18nKey="detail_xch.create_plots.madmax.instructions_note"
          components={{
            github: (
              <LinkOut href="https://github.com/madMAx43v3r/chia-plotter" />
            ),
          }}
        />
      </p>
      <Spacer />
      <p>{t('detail_xch.create_plots.madmax.build_and_install_command')}</p>
      <TerminalCommand
        cmd={`git clone https://github.com/madMAx43v3r/chia-plotter\ncd chia-plotter\ngit submodule update --init\nbash make_release.sh\nsudo mv build/chia_plot /usr/bin`}
      />
      <Spacer />
      <p>
        <b>{t('detail.note') + ' '}</b>
        {t('detail_xch.create_plots.madmax.cmake_version_notice')}
      </p>
      <Spacer />
      <p>{t('detail_xch.create_plots.madmax.create_plots_command')}</p>
      <TerminalCommand
        cmd={`chia_plot -n <plot-count> -r <thread-count> -t <tmpdir-1> -2 <tmpdir-2> -d <final-dir> -c <p2-singleton-address> -f <farmer-public-key>`}
      />
    </>
  );
};
