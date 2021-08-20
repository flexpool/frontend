import type { NextApiRequest, NextApiResponse } from 'next';
import manifest from '../../public/manifest.json';

const dynamicManifest = (req: NextApiRequest, res: NextApiResponse) => {
  const manifestData = {
    ...manifest,
    start_url: req?.query?.url || '/',
  };

  res.status(200).json(manifestData);
};

export default dynamicManifest;
