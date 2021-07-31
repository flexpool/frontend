import React from 'react';
import { StyledDocument, LoadingContainer } from './components';
import { Page, pdfjs } from 'react-pdf';
import workerSrc from '../../../../../pdf-worker';

pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;

const PdfViewer = ({ src, onDocumentLoad, totalPages, bound }) => (
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
      <Page loading="" key={index} width={bound?.width} pageIndex={index} />
    ))}
  </StyledDocument>
);

export default PdfViewer;
