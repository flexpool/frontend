import React, { useEffect, useLayoutEffect, useState } from 'react';
import { Badge } from '@/components/Badge';
import styled from 'styled-components';
import { Ellipsis } from '@/components/Ellipsis';
import { Spacer } from '../layout/Spacer';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { motion, AnimatePresence, HTMLMotionProps } from 'framer-motion';
import { Content } from '../layout/Content';
import DynamicList from 'src/components/layout/List/List';
import { AiOutlineFullscreen } from 'react-icons/ai';
import { IoClose } from 'react-icons/io5';

import { Mono } from '@/components/Typo/Typo';
import { Code } from '@/components/Code/Code';
import { Button } from '../Button';
import { LoaderOverlayWithin } from '../Loader/LoaderOverlayWithin';
import { RequestExample } from './components/RequestExample';
import { HiChevronUpDown } from 'react-icons/hi2';

const DesktopContainer = styled(Tabs)`
  display: inherit;
  width: 100%;

  @media screen and (max-width: 768px) {
    display: none;
  }
`;

const MobileContainer = styled(Tabs)`
  display: none;

  @media screen and (max-width: 768px) {
    position: relative;
    display: block;
    height: 100%;
  }
`;

const MotionSafeText = ({ ...props }: HTMLMotionProps<'div'>) => {
  return (
    <motion.div {...props} layout="position">
      {props.children}
    </motion.div>
  );
};

const ViewerContainer = styled(motion.div)`
  left: 0;
  box-shadow: 0 0 0 1px var(--border-color);
  background-color: var(--bg-primary);
  overflow: hidden;
  display: flex;

  @media screen and (max-width: 768px) {
    flex-direction: column;
  }
`;

const StyledTabPanel = styled(TabPanel)`
  &.react-tabs__tab-panel--selected {
    overflow: auto;
    height: 100%;
  }
`;

const SidePanel = styled.div`
  overflow: hidden;
  width: 30%;
  height: 100%;

  @media screen and (max-width: 768px) {
    width: 100%;
  }
`;

const Body = styled.div`
  flex: 1;
  box-shadow: -1px 0 0 var(--border-color);
  overflow: hidden;
  background-color: var(--bg-primary);
`;

const MobileBody = styled(motion.div)`
  z-index: 500;
  width: 100%;
  height: 100%;
  position: absolute;
  box-shadow: 0 -1px 0 var(--border-color);
  background-color: var(--bg-primary);
`;

const Header = styled(motion.div)`
  height: 60px;
  padding: 20px;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  font-weight: 500;
  position: sticky;
  top: 0;
  z-index: 100;
  background: var(--bg-primary);
  box-shadow: 0 -1px 0 var(--border-color);
`;

const StyledTabList = styled(TabList)`
  list-style: none;
  list-style-type: none;
  height: 100%;
  overflow-y: scroll;
`;

const EndpointTabWrapper = styled(motion.div)`
  padding: 20px;
  border-bottom: 1px solid var(--border-color);
  background-color: var(--bg-primary);
  cursor: pointer;

  &:hover {
    background-color: var(--bg-secondary);
  }
`;

const StyledTab = styled(Tab)`
  all: unset;

  &[aria-selected='true'] {
    ${EndpointTabWrapper} {
      background-color: var(--bg-secondary);
    }
  }
`;

const LineClamp = styled.div<{ lines?: number }>`
  -webkit-line-clamp: ${(p) => p.lines || 1};
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

type EndpointTabProps = {
  method: 'GET' | 'POST';
  path: string;
  desc: string;
};

const EndpointTab = ({ method, path, desc }: EndpointTabProps) => {
  return (
    <EndpointTabWrapper layout>
      <MotionSafeText>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Badge
            style={{
              margin: '0 8px 0 0',
            }}
          >
            {method}
          </Badge>
          <Ellipsis size={240}>{path}</Ellipsis>
        </div>

        <Spacer size="sm" />
        <LineClamp
          style={{
            color: 'var(--text-secondary)',
          }}
          lines={2}
        >
          {desc}
        </LineClamp>
      </MotionSafeText>
    </EndpointTabWrapper>
  );
};

type Endpoint = {
  method: 'GET' | 'POST';
  path: string;
  desc: string;
  params: any;
  returnExample: any;
};

type Props = {
  endpoints?: Endpoint[];
  isLoading: boolean;
};

const variants = {
  open: {
    zIndex: 5000,
    opacity: 1.0,
    transition: { duration: 0.2 },
  },
  closed: {
    transition: { duration: 0.4 },
    opacity: 0.9999999,
    transitionEnd: {
      zIndex: 0,
    },
  },
};

const EndpointDetail = ({ endpoint }: { endpoint: Endpoint }) => {
  return (
    <MotionSafeText
      style={{
        padding: 20,
        backgroundColor: 'var(--bg-primary)',
      }}
    >
      <h4>Description</h4>
      <p>{endpoint.desc}</p>
      <Spacer size="sm" />

      <h4>{endpoint.method === 'GET' ? 'Request Query' : 'Request Body'}</h4>
      {endpoint.params ? (
        <motion.div
          layout
          style={{
            maxWidth: 500,
          }}
        >
          <DynamicList
            data={Object.keys(endpoint.params || {})}
            columns={[
              {
                title: 'Key',
                Component: ({ data }) => {
                  return (
                    <Mono
                      style={{
                        fontWeight: 500,
                      }}
                    >
                      {data}
                    </Mono>
                  );
                },
              },
              {
                title: 'Value',
                Component: ({ data }) => {
                  return <Mono>{endpoint.params[data]}</Mono>;
                },
              },
            ]}
          />
        </motion.div>
      ) : (
        <p>No request query</p>
      )}

      <Spacer size="sm" />

      <h4>Request Example</h4>
      <Spacer size="sm" />
      <motion.div
        layout
        style={{
          maxWidth: 800,
        }}
      >
        <RequestExample endpoint={endpoint} />
      </motion.div>

      <h4>Response</h4>
      <Spacer size="sm" />
      <motion.div
        layout
        style={{
          maxWidth: 800,
        }}
      >
        <Code language="json">
          {JSON.stringify(endpoint.returnExample, null, 2)}
        </Code>
      </motion.div>
    </MotionSafeText>
  );
};

export const ApiDocViewer = ({ endpoints, isLoading }: Props) => {
  const [fullScreen, setFullScreen] = useState(false);
  const [isSelecting, setIsSelecting] = useState(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setFullScreen(false);
      }
    };

    window.addEventListener('keyup', handler);

    return () => {
      window.removeEventListener('keyup', handler);
    };
  }, []);

  useEffect(() => {
    if (fullScreen) {
      setTimeout(() => {
        document
          .getElementsByTagName('body')[0]
          .style.setProperty('overflow', 'hidden');
      }, 200);
    } else {
      document
        .getElementsByTagName('body')[0]
        .style.setProperty('overflow', null);
    }
  }, [fullScreen]);

  return (
    <>
      <Content
        style={{
          textAlign: 'right',
        }}
      >
        <Button
          onClick={() => {
            setFullScreen(true);
          }}
        >
          <AiOutlineFullscreen
            style={{
              marginRight: 8,
            }}
            size={18}
          />
          View in Full Screen
        </Button>
      </Content>

      <Spacer />

      <AnimatePresence>
        {fullScreen && (
          <motion.div
            layout
            initial={{ y: -60 }}
            animate={{ y: 0 }}
            exit={{ y: -60 }}
            transition={{
              ease: 'linear',
            }}
            style={{
              width: '100vw',
              backgroundColor: 'var(--bg-primary)',
              zIndex: 5000,
              position: 'fixed',
              top: 0,
              left: 0,
              height: 60,
              flexShrink: 0,
              padding: 20,
              display: 'flex',
              alignItems: 'center',
              fontWeight: 500,
            }}
          >
            Flexpool.io API Documentation
            <Button
              onClick={() => {
                setFullScreen(false);
              }}
              style={{
                marginLeft: 'auto',
              }}
            >
              <IoClose size={20} />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <div
        style={{
          height: '70vh',
          position: 'relative',
        }}
      >
        <Content>
          <motion.div
            animate={fullScreen ? 'open' : 'closed'}
            variants={variants}
            style={{
              position: 'relative',
            }}
          >
            <ViewerContainer
              layout
              style={{
                borderRadius: fullScreen ? 0 : 5,
                position: fullScreen ? 'fixed' : 'absolute',
                top: fullScreen ? 60 : 0,
                width: fullScreen ? '100vw' : '100%',
                height: fullScreen ? 'calc(100vh - 60px)' : '70vh',
              }}
            >
              {isLoading && <LoaderOverlayWithin />}

              <DesktopContainer>
                {endpoints && (
                  <>
                    <SidePanel>
                      <StyledTabList>
                        {endpoints.map((endpoint) => {
                          return (
                            <StyledTab
                              key={`${endpoint.method}-${endpoint.path}`}
                            >
                              <EndpointTab {...endpoint} />
                            </StyledTab>
                          );
                        })}
                      </StyledTabList>
                    </SidePanel>
                    <Body>
                      {endpoints.map((endpoint) => {
                        return (
                          <StyledTabPanel
                            key={`${endpoint.method}-${endpoint.path}`}
                          >
                            <Header layout>
                              <MotionSafeText>
                                <Badge
                                  style={{
                                    margin: '0 8px 0 0',
                                  }}
                                >
                                  {endpoint.method}
                                </Badge>
                                {endpoint.path}
                              </MotionSafeText>
                            </Header>
                            <EndpointDetail endpoint={endpoint} />
                          </StyledTabPanel>
                        );
                      })}
                    </Body>
                  </>
                )}
              </DesktopContainer>

              <MobileContainer
                onSelect={() => {
                  setIsSelecting(false);
                  return true;
                }}
              >
                {endpoints && (
                  <>
                    <SidePanel>
                      <StyledTabList
                        style={{
                          paddingBottom: 140,
                        }}
                      >
                        {endpoints.map((endpoint) => {
                          return (
                            <StyledTab
                              key={`${endpoint.method}-${endpoint.path}`}
                            >
                              <EndpointTab {...endpoint} />
                            </StyledTab>
                          );
                        })}
                      </StyledTabList>
                    </SidePanel>
                    <MobileBody
                      layout
                      style={{
                        top: isSelecting ? '80%' : '0px',
                      }}
                    >
                      {endpoints.map((endpoint) => {
                        return (
                          <StyledTabPanel
                            key={`${endpoint.method}-${endpoint.path}`}
                          >
                            <Header
                              layout
                              onClick={() => {
                                setIsSelecting((t) => !t);
                              }}
                            >
                              <MotionSafeText>
                                <Badge
                                  style={{
                                    margin: '0 8px 0 0',
                                  }}
                                >
                                  {endpoint.method}
                                </Badge>
                                {endpoint.path}

                                <HiChevronUpDown
                                  style={{
                                    verticalAlign: 'top',
                                    position: 'absolute',
                                    right: '20px',
                                  }}
                                  size={20}
                                />
                              </MotionSafeText>
                            </Header>
                            <EndpointDetail endpoint={endpoint} />
                          </StyledTabPanel>
                        );
                      })}
                    </MobileBody>
                  </>
                )}
              </MobileContainer>
            </ViewerContainer>
          </motion.div>
        </Content>
      </div>
    </>
  );
};

export default ApiDocViewer;
