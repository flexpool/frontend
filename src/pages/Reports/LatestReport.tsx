import React from 'react';
import { Page, Document } from 'react-pdf/dist/esm/entry.webpack';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import { ListPagination } from 'src/components/layout/List/ListPagination';
import { LoaderSpinner } from 'src/components/Loader/LoaderSpinner';
import { useRefBound } from 'src/hooks/useRefWidth';
import styled from 'styled-components/macro';

const StyledDocument = styled(Document)`
  border: 1px solid var(--border-color);
  overflow: hidden;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  padding: 4rem;
`;

export const LatestReport = () => {
  const [wrapperRef, bound] = useRefBound<HTMLDivElement>();
  const [totalPages, setTotalPages] = React.useState<number>(0);
  const [activePage, setActivePage] = React.useState<number>(0);

  const onDocumentLoad = (pdf: any) => {
    setTotalPages(pdf.numPages);
  };

  return (
    <>
      <h2>Latest report (2021 March)</h2>
      <div ref={wrapperRef}>
        <StyledDocument
          className="asdasdqweqwe"
          options={{ width: bound?.width }}
          // renderMode="svg"
          file={`/reports/opendata_report_2021_03.pdf`}
          onLoadSuccess={onDocumentLoad}
          externalLinkTarget="_blank"
          loading={
            <LoadingContainer>
              <LoaderSpinner />
            </LoadingContainer>
          }
        >
          <Page width={bound?.width} pageIndex={activePage} />
          <ListPagination
            totalPages={totalPages}
            currentPage={activePage}
            setCurrentPage={setActivePage}
          />
        </StyledDocument>
      </div>
    </>
  );
};
