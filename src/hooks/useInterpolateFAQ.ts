import _, { snakeCase } from 'lodash';
import { useTranslation } from 'next-i18next';

/**
 * Returns a function that interpolates variables from html(string)
 * loaded from FAQ markdown
 *
 * Commonly used variables:
 *  - reward_schema
 *  - pool_fee
 *  - payouts
 *
 *  for a complete list of variables,
 *  check 'detail_{COIN}.pool_details' in get-started.json
 *
 */
export const useInterpolateFAQ = ({ coin }: { coin: string }) => {
  const { t } = useTranslation('get-started');

  const poolDetails = t(`detail_${coin.toLowerCase()}.pool_details`, {
    returnObjects: true,
  }) as { key: string; value: string }[];

  const poolDetailsEn = t(`detail_${coin.toLowerCase()}.pool_details`, {
    returnObjects: true,
    lng: 'en-US',
  }) as { key: string; value: string }[];

  const mappedPoolDetails = poolDetailsEn?.reduce((prev, current, index) => {
    prev[snakeCase(current.key)] = poolDetails[index].value;
    return prev;
  }, {});

  const i = (html: string) => {
    return Object.keys(mappedPoolDetails).reduce((prev, current) => {
      prev = prev.replaceAll(
        new RegExp('{{' + current + '}}', 'gi'),
        mappedPoolDetails[current]
      );

      return prev;
    }, html);
  };

  return i;
};

export default useInterpolateFAQ;
