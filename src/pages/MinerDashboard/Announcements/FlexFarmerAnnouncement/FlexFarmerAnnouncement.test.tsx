import React from 'react';
import FlexFarmerAnnouncement from './FlexFarmerAnnouncement';
import { render, screen, waitFor } from '@/utils/test-utils';
import '@testing-library/jest-dom';

describe('<FlexFarmerAnnouncement />', () => {
  it('should render correctly', () => {
    render(<FlexFarmerAnnouncement />);
    expect(
      screen.getByRole('link', { name: /learn more about flexfarmer/i })
    ).toBeInTheDocument();
  });

  it('should disappear when x is clicked', async () => {
    render(<FlexFarmerAnnouncement />);

    expect(
      screen.getByRole('link', { name: /learn more about flexfarmer/i })
    ).toBeVisible();

    screen.getByRole('button', { name: /close/i }).click();

    await waitFor(() => {
      expect(
        screen.queryByRole('link', { name: /learn more about flexfarmer/i })
      ).not.toBeInTheDocument();
    });
  });
});
