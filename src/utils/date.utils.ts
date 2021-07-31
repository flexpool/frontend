import {
  format as dFormat,
  formatDistanceToNowStrict,
  intervalToDuration,
  formatDuration,
  differenceInSeconds,
  Locale,
  formatDistance as fD,
} from 'date-fns';

import React from 'react';
import { useTranslation } from 'next-i18next';
import * as locales from 'src/i18n-date-locales';

const getLocaleByKey = (key: string = 'en-US'): Locale => {
  // en-US => enUS
  const keyWithoutDash = key.replace('-', '');
  // en-US => en
  const keyPreOnly = key.split('-')[0];

  if (keyWithoutDash in locales) {
    return locales[keyWithoutDash as keyof typeof locales];
  }
  if (keyPreOnly in locales) {
    return locales[keyPreOnly as keyof typeof locales];
  }
  // default to enUS
  return locales.enUS;
};

type DateInput = Date | string | number;

const dateInputToDate = (date: DateInput) => new Date(date);

const dateIsValid = (date: Date) => !isNaN(new Date(date).getTime());

export const isValidDate = (date: DateInput) => {
  return date && dateIsValid(new Date(date));
};

const durationToParse = (duration: Duration) => {
  const { years, months, days, hours, minutes } = duration;
  if (years) {
    return {
      years,
      months,
      days,
    };
  } else if (months) {
    return {
      months,
      days,
      hours,
    };
  } else if (days) {
    return {
      days,
      hours,
      minutes,
    };
  } else {
    return duration;
  }
};

const DELIMITER = ', ';

/**
 * 1 hour, 7 minutes, 51 seconds => 1h, 7m, 51s
 * @param text
 */
const durationWordsShort = (text: string) => {
  const items = text.split(DELIMITER);

  const res = items
    .map((item) => {
      if (item) {
        const [value, unit] = item.split(' ');
        return `${value || 0}${unit?.charAt(0) || ''}`;
      }

      return '';
    })
    .filter((item) => !!item);
  return res.join(DELIMITER);
};

export const useLocalizedDateFormatter = () => {
  const { i18n, t } = useTranslation('common');

  const locale = React.useMemo(() => {
    return getLocaleByKey(i18n.language);
  }, [i18n.language]);

  const distanceFromNow = React.useCallback(
    (d: DateInput) => {
      const date = dateInputToDate(d);

      if (dateIsValid(date)) {
        const diff = Math.abs(differenceInSeconds(date, new Date()));

        if (diff < 1) {
          return t('date_time.now');
        }

        return formatDistanceToNowStrict(date, {
          addSuffix: true,
          locale,
        });
      }
      return '?';
    },
    [locale, t]
  );

  const format = React.useCallback(
    (d: DateInput, formatString: string) => {
      const date = dateInputToDate(d);

      if (dateIsValid(date)) {
        return dFormat(date, formatString, { locale });
      }
      return '?';
    },
    [locale]
  );

  const distance = React.useCallback(
    (a: number | Date, b: number | Date) => {
      return fD(a, b, { locale });
    },
    [locale]
  );

  const dateAndTime = React.useCallback(
    (d: DateInput) => {
      const date = dateInputToDate(d);
      if (dateIsValid(date)) {
        return dFormat(date, 'PPp', { locale });
      }

      return '?';
    },
    [locale]
  );

  const durationWords = React.useCallback(
    (
      seconds: number,
      options?: { includeSeconds: boolean; short?: boolean }
    ) => {
      const format = ['years', 'months', 'weeks', 'days', 'hours', 'minutes'];

      if (options?.includeSeconds) {
        format.push('seconds');
      }

      const intervalDuration = intervalToDuration({
        start: 0,
        end: new Date(seconds * 1000),
      });

      const res =
        seconds > 0
          ? formatDuration(durationToParse(intervalDuration), {
              delimiter: DELIMITER,
              format,
              locale,
            })
          : // will render 0 seconds, by default it returns empty string
            formatDuration(durationToParse(intervalDuration), {
              delimiter: DELIMITER,
              format: ['seconds'],
              zero: true,
              locale,
            });

      if (options?.short) {
        return durationWordsShort(res);
      }

      return res;
    },
    [locale]
  );

  return React.useMemo(
    () => ({ distance, format, durationWords, distanceFromNow, dateAndTime }),
    [distance, format, distanceFromNow, dateAndTime, durationWords]
  );
};
