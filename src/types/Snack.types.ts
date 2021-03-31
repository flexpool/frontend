import React from 'react';

export type SnackOptions = {
  id: string | number;
  icon?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  variant: 'success' | 'start' | 'error' | 'default';
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
  variant?: 'success' | 'start' | 'error' | 'default';
  id?: string | number;
  icon?: React.ReactNode;
  description?: React.ReactNode;
  /**
   * milliseconds
   */
  autoHide?: number;
  url?: string;
};
