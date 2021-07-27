import React from 'react';
import qs from 'query-string';
import { useRouter } from 'next/router';
import { createSnack } from 'src/rdx/snacks/snack.utils';
import { useDispatch } from 'react-redux';
import { snackActions } from 'src/rdx/snacks/snack.actions';
import { SnackVariant } from 'src/types/Snack.types';
import { useTranslation } from 'next-i18next';

// title: React.ReactNode;
// variant?: 'success' | 'start' | 'error' | 'default';
// id?: string | number;
// icon?: React.ReactNode;
// description?: React.ReactNode;
// /**
//  * milliseconds
//  */
// autoHide?: number;
// url?: string;

export const getSnackBodyByKey = (
  key: 'emailConfirmed' | 'emailUnsubscribed'
) => {
  switch (key) {
    case 'emailConfirmed':
      return createSnack({
        title: 'snacks.emailConfirm.title',
        id: key,
      });
    case 'emailUnsubscribed':
      return createSnack({
        title: 'snacks.emailUnsubscribed.title',
        id: key,
      });
    default:
      return null;
  }
};

/**
 * ?snack=[key&snackAutoHide=[time in ms]&snackVariant=['success' | 'start' | 'error' | 'default']
 */
export const useDisplaySnackOnSearchParams = () => {
  // const { search } = useLocation();
  // const { replace } = useHistory();
  const d = useDispatch();
  const { t } = useTranslation('common');
  const router = useRouter();

  React.useEffect(
    () => {
      // console.log(router.query);
      // const params = qs.parse(router.query);
      // const { snack, snackAutoHide, snackVariant, ...rest } = params;
      // const snacksToDisplay = typeof snack === 'string' ? [snack] : snack;
      // // default autoHide is 5s
      // const autoHide = Number(snackAutoHide) || 5000;
      // // default variant is success (green)
      // const variant: SnackVariant =
      //   typeof snackVariant === 'string'
      //     ? (snackVariant as SnackVariant)
      //     : 'success';
      // if (snacksToDisplay) {
      //   const snacksToPush = snacksToDisplay.map((key) => {
      //     const title = t(`snacks.${key}.title`);
      //     const description = t(`snacks.${key}.description`);
      //     const snack = createSnack({
      //       title,
      //       ...(description !== `snacks.${key}.description`
      //         ? { description }
      //         : {}),
      //       id: key,
      //       autoHide,
      //       variant,
      //     });
      //     return snack;
      //   });
      //   snacksToPush.forEach((snack) => d(snackActions.create(snack)));
      // }
      /**
       * remove snack info from the URL
       */
      // replace({
      //   search: qs.stringify(rest),
      // });
    },
    [
      /* search, d, replace, t */
    ]
  );

  return null;
};
