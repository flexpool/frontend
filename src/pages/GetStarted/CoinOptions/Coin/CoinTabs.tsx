import React, { useState, useRef, useEffect, useContext } from 'react';
import styled from 'styled-components';

const TabsContext = React.createContext<any>(undefined);

type CoinTabsProps = {
  children: React.ReactNode;
};

const useTabs = () => useContext(TabsContext);

export const CoinTabs = ({ children }: CoinTabsProps) => {
  const [intersection, setIntersection] = useState<
    IntersectionObserver | undefined
  >();

  const [selected, setSelected] = useState(0);

  useEffect(() => {
    const options = {
      rootMargin: '0px',
      threshold: Array.from({ length: 11 }, (_, i) => i / 10),
    };

    const tabsIR: (number | undefined)[] = [];

    const callback = (entries) => {
      entries.forEach((entry) => {
        const tabIndex = Number(entry.target.attributes.tabIndex.value);

        tabsIR[tabIndex] = entry.intersectionRatio;
      });

      const indexRes = tabsIR.reduce((prev = 0, _, currentIndex) => {
        const ci = tabsIR[currentIndex] ?? Infinity;
        const prevIndex = tabsIR[prev] ?? 0;

        if (ci > prevIndex) {
          return currentIndex;
        }

        return prev;
      }, 0);

      setSelected(indexRes!);
    };

    const io = new IntersectionObserver(callback, options);
    setIntersection(io);
  }, []);

  return (
    <TabsContext.Provider
      value={{
        selected,
        intersection,
      }}
    >
      {children}
    </TabsContext.Provider>
  );
};

const TabWrapper = styled.div`
  display: inline-block;
`;

const TabListWrapper = styled.div`
  z-index: 10;
  white-space: nowrap;
  /* overflow: scroll; */

  ${TabWrapper} + ${TabWrapper} {
    margin-left: 10px;
  }
`;

type TabListProps = {
  children: React.ReactNode;
};

const TabList = ({ children }: TabListProps) => {
  return <TabListWrapper>{children}</TabListWrapper>;
};

type TabRenderProps = {
  selected: boolean;
};

type TabProps = {
  index: number;
  children: (props: TabRenderProps) => React.ReactNode;
};

export const Tab = ({ children, index }: TabProps) => {
  const { selected } = useTabs();

  return (
    <TabWrapper
      onClick={() => {
        document.getElementById(`coin-tab-${index}-anchor`)?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }}
    >
      {children({ selected: selected === index })}
    </TabWrapper>
  );
};

type SectionProps = {
  children: React.ReactNode;
  index: number;
};

const Section = ({ children, index }: SectionProps) => {
  const tabs = useTabs();

  const elRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (elRef.current && tabs.intersection) {
      tabs.intersection.observe(elRef.current);
    }
  }, [elRef, tabs.intersection]);

  return (
    <div ref={elRef} tabIndex={index}>
      <div
        id={`coin-tab-${index}-anchor`}
        style={{
          position: 'relative',
          top: '-185px',
        }}
      ></div>
      {children}
    </div>
  );
};

CoinTabs.Tab = Tab;
CoinTabs.TabList = TabList;
CoinTabs.Section = Section;

export default CoinTabs;
