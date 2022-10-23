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

  const [selected, setSelected] = useState('etc');
  const [sectionList, setSectionList] = useState<string[]>([]);

  useEffect(() => {
    const options = {
      rootMargin: '0px',
      threshold: Array.from({ length: 11 }, (_, i) => i / 10),
    };

    // TODO: make this dynamic
    const ranks = {
      etc: 0,
      xch: 0,
      zil: 0,
    };

    const callback = (entries) => {
      entries.forEach((entry) => {
        ranks[entry.target.id] = entry.intersectionRatio;
      });

      const res = Object.keys(ranks).reduce((prev, current) => {
        if (ranks[current] > ranks[prev]) {
          return current;
        }

        return prev;
      }, 'etc');

      setSelected(res);
    };

    const io = new IntersectionObserver(callback, options);
    setIntersection(io);
  }, []);

  const add = (id: string) => {
    setSectionList((list) => [...list, id]);
  };

  return (
    <TabsContext.Provider
      value={{
        list: sectionList,
        add,
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
  id: string;
  children: (props: TabRenderProps) => React.ReactNode;
};

export const Tab = ({ id, children }: TabProps) => {
  const { selected } = useTabs();

  return (
    <TabWrapper
      onClick={() => {
        document.getElementById(`${id}-anchor`)?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }}
    >
      {children({ selected: selected === id })}
    </TabWrapper>
  );
};

type SectionProps = {
  id: string;
  children: React.ReactNode;
};

const Section = ({ id, children }: SectionProps) => {
  const tabs = useTabs();

  useEffect(() => {
    tabs.add(id);
  }, []);

  const elRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (elRef.current && tabs.intersection) {
      tabs.intersection.observe(elRef.current);
    }
  }, [elRef, tabs.intersection]);

  return (
    <div ref={elRef} id={id}>
      <div
        id={`${id}-anchor`}
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
