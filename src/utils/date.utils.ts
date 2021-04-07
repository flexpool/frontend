import {
  format,
  formatRelative,
  formatDistanceToNowStrict,
  intervalToDuration,
  formatDuration,
} from 'date-fns';

// export const isValidDate = (date: any) => {
//   return (
//     date &&
//     Object.prototype.toString.call(date) === "[object Date]" &&
//     !isNaN(date)
//   );
// };

type DateInput = Date | string | number;

const dateInputToDate = (date: DateInput) => new Date(date);

const dateIsValid = (date: Date) => !isNaN(new Date(date).getTime());

export const isValidDate = (date: DateInput) => {
  return date && dateIsValid(new Date(date));
};

const dateFormat = (d: DateInput, formatString: string) => {
  const date = dateInputToDate(d);

  if (dateIsValid(date)) {
    return format(date, formatString);
  }
  return '?';
};

const relativeNow = (d: DateInput) => {
  const date = dateInputToDate(d);

  if (dateIsValid(date)) {
    return formatRelative(date, new Date());
  }
  return '?';
};

const formatDistance = (d: DateInput) => {
  const date = dateInputToDate(d);

  if (dateIsValid(date)) {
    return formatDistanceToNowStrict(date, {
      addSuffix: true,
    });
  }
  return '?';
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

const durationWords = (
  seconds: number,
  options?: { includeSeconds: boolean }
) => {
  const format = ['years', 'months', 'weeks', 'days', 'hours', 'minutes'];

  if (options?.includeSeconds) {
    format.push('seconds');
  }

  console.log(
    intervalToDuration({
      start: 0,
      end: new Date(seconds * 1000),
    })
  );

  const intervalDuration = intervalToDuration({
    start: 0,
    end: new Date(seconds * 1000),
  });

  return formatDuration(durationToParse(intervalDuration), {
    delimiter: ', ',
    format,
  });
};

export const dateUtils = {
  dateInputToDate,
  isValidDate,
  short: (d: DateInput) => dateFormat(d, 'PP'),
  shortWithTime: (d: DateInput) => dateFormat(d, 'Pp'),
  format: dateFormat,
  relativeNow,
  formatDistance,
  durationWords,
};
