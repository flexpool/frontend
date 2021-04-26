import React, { FC, useEffect } from 'react';
import { Button } from 'src/components/Button';
import * as serviceWorker from 'src/serviceWorkerRegistration';
import styled from 'styled-components';

const Container = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 10000;
  display: flex;
  justify-content: center;
`;
const ReloadBanner = styled.div`
  max-width: 700px;
  padding: 1.25rem 2rem;
  background: var(--primary);
  display: flex;
  align-items: center;
  box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.3);
  border-radius: 5px;
  margin-bottom: 2rem;
  p {
    color: var(--text-on-bg);
    margin-right: 2rem;
  }
  @media screen and (max-width: 768px) {
    flex-direction: column;
    margin-bottom: 0;
    padding: 2rem;
    width: 100%;
    border-radius: 0;
    p {
      margin-bottom: 1rem;
    }
  }
`;

const ServiceWorkerWrapper: FC = () => {
  const [showReload, setShowReload] = React.useState(false);
  const [
    waitingWorker,
    setWaitingWorker,
  ] = React.useState<ServiceWorker | null>(null);

  const onSWUpdate = (registration: ServiceWorkerRegistration) => {
    const waitingServiceWorker = registration.waiting;

    if (waitingServiceWorker) {
      console.log('[SW]: New update available.');
      waitingServiceWorker.addEventListener('statechange', (event) => {
        if ((event.target as any)?.state === 'activated') {
          console.log('[SW]: New service worker has been activated');
          window.location.reload();
          setShowReload(false);
        }
      });

      setShowReload(true);
      setWaitingWorker(waitingServiceWorker);
    }
  };

  useEffect(() => {
    serviceWorker.register({
      onUpdate: onSWUpdate,
    });
  }, []);

  const reloadPage = () => {
    console.log('[SW]: Skip waiting.');
    waitingWorker?.postMessage({ type: 'SKIP_WAITING' });
  };

  if (!showReload) {
    return null;
  }

  return (
    <Container>
      <ReloadBanner>
        <div>
          <p>New version is available</p>
        </div>
        <div>
          <Button color="inherit" size="sm" onClick={reloadPage}>
            Get latest
          </Button>
        </div>
      </ReloadBanner>
    </Container>
  );
};

export default ServiceWorkerWrapper;
