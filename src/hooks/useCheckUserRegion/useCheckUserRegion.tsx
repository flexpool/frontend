import useIsMounted from '../useIsMounted';
import { useTranslation } from 'react-i18next';

const useCheckUserRegion = (regionCode: string) => {
  const { i18n } = useTranslation();
  const isMounted = useIsMounted();

  const regex = new RegExp(`^${regionCode}\\b`);

  const isChineseUser =
    typeof window !== 'undefined'
      ? regex.test(window.navigator.language) || regex.test(i18n.language)
      : false;

  return isMounted && isChineseUser;
};

export default useCheckUserRegion;
