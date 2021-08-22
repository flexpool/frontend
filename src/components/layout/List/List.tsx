/* eslint-disable react/display-name */
import React from 'react';
import { Img } from 'src/components/Img';
import { Tooltip } from 'src/components/Tooltip';
import { clx } from 'src/utils/clx';
import styled from 'styled-components';
import { Skeleton } from '../Skeleton';
import { HorizontalScrollWrapepr, ListWrapper, Table } from './components';
import { ListPagination } from './ListPagination';
import { LoaderOverlayWithin } from 'src/components/Loader/LoaderOverlayWithin';

export interface DynamicListColumn<D extends {}, CP extends {} = {}> {
  title?: React.ReactNode;
  onClickValue?: string;
  name?: string;
  alignRight?: boolean;
  skeletonWidth?: number;
  // TODO - not sure how to type this so that React.createElement likes it
  Component: React.ComponentType<{ data: D; index: number; config: CP }>;
  // Component?: Parameters<typeof React.createElement>[0]; // needs Prop type included
}

export type DynamicListProps<
  D extends {},
  CP extends {} = {}
> = JSX.IntrinsicElements['table'] & {
  data?: D[];
  columns: DynamicListColumn<D, CP>[];
  config?: CP | null;
  large?: boolean;
  className?: string;
  activeColName?: string;
  activeColOrder?: 'ASC' | 'DESC';
  // contentEmpty?: React.ReactNode;
  /**
   * More padding from sides
   */
  inContainer?: boolean;
  tBodyChildren?: React.ReactNode;
  tFooterChildren?: React.ReactNode;

  hideHead?: boolean;
  isLoading?: boolean;
  loadingRowsCount?: number;
  onColumnHeaderClick?: (value: string) => void;
  pagination?: {
    currentPage: number;
    setCurrentPage: (page: number) => void;
    totalPages: number;
  };
  onRowClick?: (data: D) => void;
  onRowClickAllowed?: (data: D) => boolean;
  contentEmpty?: React.ReactNode;
  wrapperProps?: Omit<JSX.IntrinsicElements['div'], 'ref'>;
  renderRowTooltipContent?: (d: D) => React.ReactNode;
};

const ListRow = React.memo(
  <D extends {}, CP extends {} = {}>({
    item,
    onRowClick,
    onRowClickAllowed,
    index,
    isHighlighted,
    handleActiveHover,
    columns,
    config,
    renderRowTooltipContent,
  }: {
    item: D;
    onRowClick?: (d: D) => void;
    index: number;
    isHighlighted: boolean;
    onRowClickAllowed?: (data: D) => boolean;
    handleActiveHover: (n: number) => void;
    columns: DynamicListColumn<D, CP>[];
    config: CP | null;
    renderRowTooltipContent?: (d: D) => React.ReactNode;
  }) => {
    const onMouseOver = React.useCallback(() => {
      handleActiveHover(index);
    }, [handleActiveHover, index]);
    const handleClick = React.useMemo(() => {
      if (onRowClick && (onRowClickAllowed ? onRowClickAllowed(item) : true)) {
        return () => onRowClick(item);
      }
      return undefined;
    }, [item, onRowClick, onRowClickAllowed]);

    const content = (
      <Table.Tr
        clickable={!!handleClick}
        onClick={handleClick}
        className={clx({
          highlighted: isHighlighted,
        })}
        onMouseOver={onMouseOver}
      >
        {columns.map((col, cindex) => {
          return (
            <Table.Td key={cindex} alignRight={col.alignRight}>
              <col.Component data={item} index={index} config={config as any} />
            </Table.Td>
          );
        })}
      </Table.Tr>
    );

    if (renderRowTooltipContent) {
      return (
        <>
          <Tooltip wrapIcon={false} placement="right" icon={content}>
            {renderRowTooltipContent(item)}
          </Tooltip>
        </>
      );
    }

    return content;
  }
);

export const DynamicList = <D extends {}, CP extends {}>(
  props: DynamicListProps<D, CP>
) => {
  const {
    data,
    columns,
    contentEmpty,
    tBodyChildren,
    tFooterChildren,
    hideHead,
    isLoading,
    loadingRowsCount = 5,
    pagination,
    onColumnHeaderClick,
    config = null,
    onRowClick,
    onRowClickAllowed,
    wrapperProps,
    renderRowTooltipContent,
  } = props;

  const [lastMouseOver, setLastMouseOver] = React.useState<{
    hoverIndex: number | null;
  }>({ hoverIndex: null });

  const headEl = React.useMemo(() => {
    return (
      !hideHead && (
        <thead>
          <tr>
            {columns &&
              columns.map((colProps, index) => {
                const { title, onClickValue } = colProps;

                const handleClick =
                  onClickValue && onColumnHeaderClick
                    ? () => {
                        onColumnHeaderClick(onClickValue);
                      }
                    : undefined;

                return (
                  <Table.Th
                    key={index}
                    alignRight={colProps.alignRight}
                    onClick={handleClick}
                    hoverable={!!handleClick}
                  >
                    {title}
                  </Table.Th>
                );
              })}
          </tr>
        </thead>
      )
    );
  }, [hideHead, columns, onColumnHeaderClick]);

  return (
    <ListWrapper {...wrapperProps}>
      <HorizontalScrollWrapepr>
        <Table.Container>
          {headEl}
          {isLoading && <LoaderOverlayWithin></LoaderOverlayWithin>}
          {(isLoading && (!data || data.length < 1) && (
            <tbody>
              {Array.apply(null, Array(loadingRowsCount)).map((_, index) => (
                <Table.Tr key={index}>
                  {columns.map((col, cindex) => {
                    return (
                      <Table.Td key={cindex} alignRight={col.alignRight}>
                        <Skeleton style={{ width: col.skeletonWidth }} />
                      </Table.Td>
                    );
                  })}
                </Table.Tr>
              ))}
            </tbody>
          )) || (
            <tbody
              onMouseEnter={() => setLastMouseOver({ hoverIndex: null })}
              onMouseLeave={() => setLastMouseOver({ ...lastMouseOver })}
            >
              {columns &&
                data &&
                data.length > 0 &&
                data.map((item, index) => {
                  return (
                    <ListRow
                      item={item}
                      onRowClick={onRowClick as any}
                      onRowClickAllowed={onRowClickAllowed as any}
                      index={index}
                      key={(item as any).name || index}
                      isHighlighted={index === lastMouseOver.hoverIndex}
                      handleActiveHover={(rowIndex) => {
                        lastMouseOver.hoverIndex = rowIndex;
                      }}
                      columns={columns as any}
                      config={config}
                      renderRowTooltipContent={renderRowTooltipContent as any}
                    />
                  );
                })}
              {tBodyChildren}
            </tbody>
          )}
          {tFooterChildren && <tfoot>{tFooterChildren}</tfoot>}
        </Table.Container>
        {!isLoading && (!data || data.length < 1) && contentEmpty ? (
          <DynamicListEmpty>{contentEmpty}</DynamicListEmpty>
        ) : null}
      </HorizontalScrollWrapepr>
      {pagination && <ListPagination {...pagination} />}
    </ListWrapper>
  );
};

export default DynamicList;

const EmptyContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4rem;
  flex-direction: column;
`;

const EmptyImg = styled(Img)`
  max-height: 180px;
  max-width: 300px;
  margin-bottom: 2rem;
`;

export const DynamicListEmpty: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <EmptyContainer>
      <EmptyImg src="/illustrations/stats.svg" alt="Empty chart" />
      {children}
    </EmptyContainer>
  );
};
//
