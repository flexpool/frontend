import styled from 'styled-components';
import { Button } from './Button';
import { useState } from 'react';
import Modal from './Modal/Modal';
import { Spacer } from './layout/Spacer';
import { ScrollArea } from './layout/ScrollArea';
import { Trans, useTranslation } from 'next-i18next';

const Container = styled.div`
  position: fixed;
  bottom: 10px;
  border: 1px solid var(--border-color);
  z-index: 1000;
  padding: 8px 20px;
  border-radius: 5px;
  max-width: 800px;
  width: 90vw;
  box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.3);

  background-color: var(--bg-primary);
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  justify-content: space-between;
  align-items: center;

  flex-wrap: wrap;
`;

export const ShutdownNoticeBar = () => {
  const [show, setShow] = useState(false);
  const { t } = useTranslation('common');

  return (
    <>
      <Container>
        <div
          style={{
            margin: '14px 16px 14px 0px',
          }}
        >
          <h3>{t('shutdown.announcement')}</h3>
        </div>

        <div
          style={{
            margin: '8px 0',
          }}
        >
          <Button onClick={() => setShow(true)} variant="primary">
            {t('shutdown.read_more')}
          </Button>
        </div>
      </Container>
      <Modal
        isOpen={show}
        closeOnOuterClick
        handleClose={() => {
          setShow(false);
        }}
      >
        <Modal.Header>{t('shutdown.notice_header')}</Modal.Header>
        <ScrollArea>
          <Modal.Body>
            <h3>{t('shutdown.notice_p1_title')}</h3>
            <p>
              <Trans
                t={t}
                i18nKey={'shutdown.notice_p1_content'}
                components={{
                  b: <b />,
                }}
              />
            </p>

            <h3>{t('shutdown.notice_p2_title')}</h3>
            <p>{t('shutdown.notice_p2_content')}</p>
            <h3>{t('shutdown.notice_p3_title')}</h3>
            <p>{t('shutdown.notice_p3_content')}</p>
            <h3>{t('shutdown.notice_p4_title')}</h3>
            <p>{t('shutdown.notice_p4_content')}</p>
            <Spacer size="lg" />
            <Button variant="primary" onClick={() => setShow(false)}>
              {t('shutdown.close')}
            </Button>
          </Modal.Body>
        </ScrollArea>
      </Modal>
    </>
  );
};
