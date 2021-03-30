import React from 'react';
import { BsArrowRight, BsArrowLeft } from 'react-icons/bs';
import { Button } from 'src/components/Button';
import { clx } from 'src/utils/clx';
import styled from 'styled-components';

const PageButton = styled(Button)`
  min-width: 46px;
  height: 46px;
  font-weight: 500;
  line-height: 46px;
  min-height: 46px;
  text-align: center;
  justify-content: center;
  &:disabled {
    border-color: transparent;
    color: var(--text-secondary);
    background: transparent;
  }
  &.active {
    background: var(--primary);
    color: var(--text-on-bg);
  }
`;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem 1.5rem;
  border-top: 1px solid var(--border-color);
  & > * {
    margin: 0 0.25rem;
  }
  @media screen and (max-width: 560px) {
    justify-content: space-between;
  }
`;

const PageNumbers = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  & > * {
    margin: 0 0.25rem;
  }

  @media screen and (max-width: 560px) {
    display: none;
  }
`;

const PaginationSpacer = styled.span`
  color: var(--text-tertiary);
`;

export const ListPagination: React.FC<{
  totalPages: number;
  currentPage: number;
  setCurrentPage: (page: number) => void;
}> = (props) => {
  const { totalPages, currentPage, setCurrentPage } = props;

  var pagesShown = 3;
  if (totalPages <= pagesShown) {
    pagesShown = totalPages - 1;
  }

  let selectionsAvailable = [];
  let firstSelectionShown: null | number = null;
  let lastSelectionShown: null | number = null;

  let pagesShownTmp = pagesShown;

  const setPage = React.useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      const page = Number((e.target as HTMLButtonElement).value);
      setCurrentPage(page);
    },
    [setCurrentPage]
  );

  for (var i = 0; i < pagesShownTmp; i++) {
    const page = currentPage + i - (currentPage === totalPages ? 2 : 1);
    if (page >= totalPages) {
      break;
    }

    if (page < 0) {
      pagesShownTmp++;
      continue;
    }

    if (firstSelectionShown === null) {
      firstSelectionShown = page;
    }

    selectionsAvailable.push(
      <PageButton
        key={page}
        className={clx({ active: page === currentPage })}
        onClick={setPage}
        value={page}
      >
        {page + 1}
      </PageButton>
    );
    lastSelectionShown = page;
  }

  if (totalPages < 1) {
    return null;
  }

  return (
    <Wrapper>
      <PageButton
        disabled={currentPage <= 0}
        value={currentPage - 1}
        onClick={setPage}
      >
        <BsArrowLeft style={{ marginRight: '10px' }} />
        Previous
      </PageButton>
      <PageNumbers>
        {/* First page (enabled only if not available via regular selection) */}
        {firstSelectionShown !== null && firstSelectionShown > 0 ? (
          <>
            <PageButton onClick={setPage} value={0}>
              1
            </PageButton>
            <PaginationSpacer>—</PaginationSpacer>
          </>
        ) : undefined}
        {selectionsAvailable}
        {/* Last page (enabled only if not available via regular selection) */}
        {currentPage <= totalPages - pagesShown ? (
          <>
            {lastSelectionShown !== totalPages && totalPages !== 1 ? (
              <PaginationSpacer>—</PaginationSpacer>
            ) : null}
            <PageButton onClick={setPage} value={totalPages - 1}>
              {totalPages}
            </PageButton>
          </>
        ) : null}
      </PageNumbers>
      <PageButton
        disabled={currentPage + 1 >= totalPages || totalPages === 1}
        value={currentPage + 1}
        onClick={setPage}
      >
        Next <BsArrowRight style={{ marginLeft: '10px' }} />
      </PageButton>
    </Wrapper>
  );
};
