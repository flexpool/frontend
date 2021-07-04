import styled from 'styled-components';
import { IoMdDownload } from 'react-icons/io';
import { Button } from 'src/components/Button';

export const DownloadButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 15px;
`;

export const DownloadCsvButton = styled(Button)`
  align-self: flex-end;
  font-size: 1rem;
  font-weight: 600;
`;

export const FaDownloadIcon = styled(IoMdDownload)`
  font-weight: 700;
`;
