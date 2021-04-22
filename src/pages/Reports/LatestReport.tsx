import { Page, Document } from 'react-pdf/dist/esm/entry.webpack';

export const LatestReport = () => {
  return (
    <Document
      file={`https://static.flexpool.io/opendata/opendata_report_2021_03.pdf`}
    >
      <Page pageNumber={1} />
    </Document>
  );
};
