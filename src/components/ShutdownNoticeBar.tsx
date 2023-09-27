import styled from 'styled-components';
import { Button } from './Button';
import { useEffect, useState } from 'react';
import Modal from './Modal/Modal';
import { ScrollArea } from './layout/ScrollArea';
import { Trans, useTranslation } from 'next-i18next';
import { useLocalStorageState } from '@/hooks/useLocalStorageState';
import useIsMounted from '@/hooks/useIsMounted';
import { Checkbox } from './Form/Checkbox';
import { BiChevronDown } from 'react-icons/bi';
import { Spacer } from './layout/Spacer';
import AnnouncementBar from './AnnouncementBar';

const ReadMoreButton = styled.button`
  all: unset;
  outline: none;
  display: inline-flex;
  align-items: center;
  color: var(--primary);

  &:hover {
    text-decoration: underline;
  }
`;

const ModalFooter = styled.div`
  padding: 12px 1.5rem;
  border-top: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
`;

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
  const [acknowledge, setAcknowledge] = useLocalStorageState(
    'shutdown_acknowledgement',
    false
  );

  const [showDetailModal, setShowDetailModal] = useState(false);

  const [show, setShow] = useState(false);

  const [readMore, setReadMore] = useState(false);

  const isMounted = useIsMounted();

  useEffect(() => {
    if (isMounted && acknowledge === false) {
      setShow(true);
    }
  }, [isMounted, acknowledge]);

  useEffect(() => {
    if (show) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [show]);

  const { t } = useTranslation('common');

  return (
    <>
      <AnnouncementBar
        removable={false}
        variant="primary"
        id="shutdown_announcement"
      >
        {t('shutdown.announcement')}{' '}
        <ReadMoreButton
          style={{
            marginLeft: '4px',
            color: 'white',
          }}
          onClick={() => {
            setShowDetailModal(true);
          }}
        >
          Read more
        </ReadMoreButton>
      </AnnouncementBar>
      <Modal
        isOpen={showDetailModal}
        size="sm"
        closeOnOuterClick
        handleClose={() => {
          setShowDetailModal(false);
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
          </Modal.Body>
        </ScrollArea>
        <ModalFooter>
          <div />
          <Button variant="primary" onClick={() => setShowDetailModal(false)}>
            {t('shutdown.close')}
          </Button>
        </ModalFooter>
      </Modal>
      <Modal isOpen={show} size="sm" hideCloseButton handleClose={() => {}}>
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

            <Spacer size="sm" />

            <ReadMoreButton onClick={() => setReadMore(true)}>
              Read more <BiChevronDown />
            </ReadMoreButton>

            {readMore && (
              <>
                <h3>{t('shutdown.notice_p2_title')}</h3>
                <p>{t('shutdown.notice_p2_content')}</p>
                <h3>{t('shutdown.notice_p3_title')}</h3>
                <p>{t('shutdown.notice_p3_content')}</p>
                <h3>{t('shutdown.notice_p4_title')}</h3>
                <p>{t('shutdown.notice_p4_content')}</p>
              </>
            )}
          </Modal.Body>
        </ScrollArea>
        <ModalFooter>
          <Checkbox
            label="I have read this message"
            checked={acknowledge}
            value={acknowledge === true ? 'true' : undefined}
            onChange={(e) => {
              if (e.currentTarget.checked) {
                setAcknowledge(true);
              } else {
                setAcknowledge(false);
              }

              console.log(e.currentTarget.checked);
            }}
          />
          <Button
            disabled={!acknowledge}
            variant="primary"
            onClick={() => setShow(false)}
          >
            {t('shutdown.close')}
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};
