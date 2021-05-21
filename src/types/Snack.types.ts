import React from 'react';
export type SnackVariant = 'success' | 'start' | 'error' | 'default';
export type SnackOptions = {
  id: string | number;
  icon?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  variant: SnackVariant;
  /**
   * milliseconds
   */
  autoHide?: number;
  createdAt: Date;
  actionType?: string;
  url?: string;
};

export type SnackOptionsInput = {
  title: React.ReactNode;
  variant?: SnackVariant;
  id?: string | number;
  icon?: React.ReactNode;
  description?: React.ReactNode;
  /**
   * milliseconds
   */
  autoHide?: number;
  url?: string;
};
