import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export default function Custom404() {
  const router = useRouter();

  useEffect(() => {
    router.push('/not-found');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}
