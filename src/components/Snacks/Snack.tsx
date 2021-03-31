import React from 'react';
import { SnackOptions } from 'src/types/Snack.types';
import cls from './Snack.module.scss';
import { useDispatch } from 'react-redux';
import { snackActions } from 'src/rdx/snacks/snack.actions';
import { clx } from 'src/utils/clx';
import { Link } from 'react-router-dom';
import { FaTimes } from 'react-icons/fa';

type SnackProps = {
  data: SnackOptions;
};

export const Snack = (props: SnackProps) => {
  const { data } = props;
  const d = useDispatch();

  const handleClose = React.useCallback(
    (e?: React.MouseEvent) => {
      if (e) {
        e.preventDefault();
      }
      d(snackActions.remove(data.id));
    },
    [d, data.id]
  );
  /**
   * authide
   */
  React.useEffect(() => {
    if (data.autoHide && data.autoHide > 0) {
      const timeout = setTimeout(handleClose, data.autoHide);
      return () => {
        clearTimeout(timeout);
      };
    }

    return;
  }, [data.autoHide, handleClose]);

  const linkProps = data.url
    ? {
        as: Link,
        to: data.url,
      }
    : {};

  return (
    <div
      className={clx(cls.snack, {
        [cls[data.variant]]: data.variant,
      })}
      {...linkProps}
    >
      <FaTimes className={cls.close} name="close" onClick={handleClose} />
      {data.icon && <div className={cls.iconContainer}>{data.icon}</div>}
      <div className={cls.content}>
        <span className={cls.title}>{data.title}</span>
        {data.description && <p className={cls.desc}>{data.description}</p>}
      </div>
    </div>
  );
};
