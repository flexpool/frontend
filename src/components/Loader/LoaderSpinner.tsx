import cls from './LoaderSpin.module.scss';

export const LoaderSpinner = () => (
  <svg className={cls.spinner} viewBox="0 0 50 50">
    <circle cx="25" cy="25" r="20" fill="none" stroke-width="5"></circle>
  </svg>
);
