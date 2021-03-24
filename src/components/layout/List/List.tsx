import React from 'react';
import { clx } from 'src/utils/clx';
import { HorizontalScrollWrapepr, Skeleton, Table } from './components';

export interface DynamicListColumn<D extends {}, CP extends {}> {
  title: React.ReactNode;
  name?: string;
  alignRight?: boolean;
  config?: CP;
  skeletonWidth?: number;
  // TODO - not sure how to type this so that React.createElement likes it
  Component: React.ComponentType<{ data: D; index: number; config?: CP }>;
  // Component?: Parameters<typeof React.createElement>[0]; // needs Prop type included
}

export type DynamicListProps<
  D extends {},
  CP extends {}
> = JSX.IntrinsicElements['table'] & {
  data?: D[];
  columns: DynamicListColumn<D, CP>[];
  large?: boolean;
  className?: string;
  activeColName?: string;
  activeColOrder?: 'ASC' | 'DESC';
  contentEmpty?: React.ReactNode;
  /**
   * More padding from sides
   */
  inContainer?: boolean;
  tBodyChildren?: React.ReactNode;
  tFooterChildren?: React.ReactNode;

  hideHead?: boolean;
  isLoading?: boolean;
  loadingRowsCount?: number;
};

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
  } = props;

  return (
    <Table.Container>
      {!hideHead && (
        <thead>
          <tr>
            {columns &&
              columns.map((colProps, index) => {
                const { title } = colProps;

                return (
                  <Table.Th
                    key={index}
                    className={clx(props && props.className)}
                    alignRight={colProps.alignRight}
                  >
                    {title}
                  </Table.Th>
                );
              })}
          </tr>
        </thead>
      )}
      {(isLoading && (
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
        <tbody>
          {columns &&
            data &&
            data.length > 0 &&
            data.map((item, index) => {
              return (
                <Table.Tr key={index}>
                  {columns.map((col, cindex) => {
                    return (
                      <Table.Td key={cindex} alignRight={col.alignRight}>
                        <col.Component
                          data={item}
                          index={index}
                          config={col.config}
                        />
                      </Table.Td>
                    );
                  })}
                </Table.Tr>
              );
            })}
          {tBodyChildren}
        </tbody>
      )}
      {tFooterChildren && <tfoot>{tFooterChildren}</tfoot>}
    </Table.Container>
  );
};

export default DynamicList;
