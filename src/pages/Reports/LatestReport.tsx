import React from 'react';
import { useTranslation } from 'react-i18next';
import { Page, Document } from 'react-pdf/dist/esm/entry.webpack';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import { ListPagination } from 'src/components/layout/List/ListPagination';
import { LoaderOverlayWithin } from 'src/components/Loader/LoaderOverlayWithin';
import { useRefBound } from 'src/hooks/useRefWidth';
import { useLocalizedDateFormatter } from 'src/utils/date.utils';
import styled from 'styled-components/macro';

const StyledDocument = styled(Document)`
  position: relative;
  display: flex;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  padding: 4rem;
`;

const PageContainer = styled.div`
  overflow: hidden;
`;
const PageContainerInner = styled.div`
  transition: 0.4s all;
  flex-shrink: 0;
`;

const Container = styled.div`
  border: 1px solid var(--border-color);
  position: relative;
  border-radius: 4px;
`;

export const LatestReport: React.FC<{ src: string; date: Date }> = ({
  src,
  date,
}) => {
  const [wrapperRef, bound] = useRefBound<HTMLDivElement>();
  const [totalPages, setTotalPages] = React.useState<number>(0);
  const [activePage, setActivePage] = React.useState<number>(0);
  const [isLoading, setIsLoading] = React.useState(true);
  const { t } = useTranslation('reports');
  const dateFormatter = useLocalizedDateFormatter();

  const onDocumentLoad = (pdf: any) => {
    setTotalPages(pdf.numPages);
    setIsLoading(false);
  };

  return (
    <>
      <h2>
        {t('latest')} ({dateFormatter.format(date, 'LLLL y')})
      </h2>
      <Container ref={wrapperRef}>
        {isLoading && <LoaderOverlayWithin />}
        <PageContainer>
          <PageContainerInner
            style={{
              transform: `translateX(${
                activePage * (bound?.width || 0) * -1
              }px)`,
            }}
          >
            <StyledDocument
              file={src}
              onLoadSuccess={onDocumentLoad}
              externalLinkTarget="_blank"
              loading={
                <LoadingContainer>
                  <br />
                </LoadingContainer>
              }
            >
              {Array.apply(null, Array(totalPages)).map((item, index) => (
                <Page
                  loading=""
                  key={index}
                  width={bound?.width}
                  pageIndex={index}
                />
              ))}
            </StyledDocument>
          </PageContainerInner>
        </PageContainer>
        <ListPagination
          totalPages={totalPages}
          currentPage={activePage}
          setCurrentPage={setActivePage}
        />
      </Container>
    </>
  );
};
