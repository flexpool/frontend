import React, { useState } from 'react';
import { useTranslation } from 'next-i18next';
import dynamic from 'next/dynamic';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';

import { PageContainer, PageContainerInner, Container } from './components';
import { ListPagination } from 'src/components/layout/List/ListPagination';
import { LoaderOverlayWithin } from 'src/components/Loader/LoaderOverlayWithin';
import { useRefBound } from 'src/hooks/useRefWidth';
import { useLocalizedDateFormatter } from 'src/utils/date.utils';
import { LoaderSpinner } from 'src/components/Loader/LoaderSpinner';

const PDFViewer = dynamic(() => import('./PDFViewer'), {
  loading: () => (
    <LoaderSpinner style={{ minHeight: '26rem', display: 'flex' }} />
  ),
  ssr: false,
});

export const LatestReport: React.FC<{ src: string; date: Date }> = ({
  src,
  date,
}) => {
  const [wrapperRef, bound] = useRefBound<HTMLDivElement>();
  const [totalPages, setTotalPages] = useState<number>(0);
  const [activePage, setActivePage] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
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
            <PDFViewer
              src={src}
              onDocumentLoad={onDocumentLoad}
              totalPages={totalPages}
              bound={bound}
            />
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
