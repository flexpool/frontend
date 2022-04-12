import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';
import useGetRegionHashRate from '@/hooks/useGetRegionHashrate';
import { useStore } from '../../store';
import { REGION_MAP } from '../../constants';

const StyledRegionOverlay = styled.div`
  border-radius: 4px;
  font-family: 'Inter', sans-serif;
  padding: 1rem;
  color: white;
  background-color: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(10px);
  width: 280px;
  min-height: 45px;
  position: fixed;
  pointer-events: none;
`;

const Item = styled.div`
  display: flex;

  & > div:first-child {
    flex: 1;
  }
`;

const HashrateList = styled.div`
  color: #a3a2a2;
  margin-top: 6px;
  font-size: 0.85rem;
  line-height: 1.4;

  & > ${Item} + ${Item} {
    margin-top: 4px;
  }
`;

const RegionOverlay = () => {
  const region = useStore((state) => state.region);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const hashrate = useGetRegionHashRate();

  useEffect(() => {
    const saveMousePos = (e: any) => {
      if (overlayRef.current) {
        overlayRef.current.style.left = `${Math.min(
          e.clientX + 10,
          window.innerWidth - 280
        )}px`;
        overlayRef.current.style.top = `${e.clientY + 10}px`;
      }
    };

    window.addEventListener('mousemove', saveMousePos);
    return () => {
      window.removeEventListener('mousemove', saveMousePos);
    };
  }, []);

  return (
    <StyledRegionOverlay
      style={{
        display: region ? 'block' : 'none',
      }}
      ref={overlayRef}
    >
      <div>{REGION_MAP[region]}</div>

      <HashrateList>
        {region === 'ru' && <div>This region is not available.</div>}
        {region === 'af' && (
          <div>
            No server locations in this region. <br />
            Closest region you can use is Europe.
          </div>
        )}
        {region === 'me' && (
          <div>
            No server locations in this region. <br />
            Closest regions you can use are Europe & Asia Pacific.
          </div>
        )}

        {hashrate?.eth?.[region] && (
          <Item>
            <div>Ethereum</div>
            <div>{hashrate?.eth[region]}</div>
          </Item>
        )}

        {hashrate?.etc?.[region] && (
          <Item>
            <div>Ethereum Classic</div>
            <div>{hashrate.etc[region]}</div>
          </Item>
        )}

        {hashrate?.xch?.[region] && (
          <Item>
            <div>Chia</div>
            <div>{hashrate.xch[region]}</div>
          </Item>
        )}
      </HashrateList>
    </StyledRegionOverlay>
  );
};

export default RegionOverlay;
