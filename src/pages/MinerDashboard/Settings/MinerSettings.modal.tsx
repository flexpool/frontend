import { Button } from 'src/components/Button';
import Modal from 'src/components/Modal/Modal';
import { useOpenState } from 'src/hooks/useOpenState';
import { PayoutSettings } from './PayoutSettings';

export const MinerSettingsModal = () => {
  const openState = useOpenState();

  return (
    <>
      <Button onClick={openState.handleOpen} size="sm" variant="primary">
        Settings
      </Button>
      <Modal {...openState.modalProps}>
        <Modal.Header>
          <h2>Settings</h2>
        </Modal.Header>
        <Modal.Body>
          <PayoutSettings />
        </Modal.Body>
      </Modal>
    </>
  );
};
