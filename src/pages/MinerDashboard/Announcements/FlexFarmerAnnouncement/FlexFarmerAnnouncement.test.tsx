import React from 'react';
import FlexFarmerAnnouncement from './FlexFarmerAnnouncement';
import { render, screen, waitFor } from '@/utils/test-utils';
import '@testing-library/jest-dom';

class LocalStorageMock {
  private store: { [key: string]: string };

  constructor() {
    this.store = {};
  }

  clear() {
    this.store = {};
  }

  getItem(key) {
    return this.store[key] || null;
  }

  setItem(key, value) {
    this.store[key] = String(value);
  }

  removeItem(key) {
    delete this.store[key];
  }
}

describe('<FlexFarmerAnnouncement />', () => {
  beforeEach(() => {
    global.localStorage = new LocalStorageMock() as unknown as Storage;
  });

  afterEach(() => {
    global.localStorage.clear();
  });

  it('should render correctly.', () => {
    render(<FlexFarmerAnnouncement />);
    expect(
      screen.getByRole('link', { name: /learn more about flexfarmer/i })
    ).toBeInTheDocument();
  });

  it('should disappear when x is clicked.', async () => {
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

  it("should re-appear after two days when 'Maybe later' is clicked.", async () => {
    jest.useFakeTimers('modern');

    const mockTime = new Date('2020-01-01T00:00:00.000Z').getTime();

    jest.setSystemTime(mockTime);

    const { rerender } = render(<FlexFarmerAnnouncement />);

    screen.getByRole('button', { name: /maybe later/i }).click();

    await waitFor(() => {
      expect(
        screen.queryByRole('link', { name: /learn more about flexfarmer/i })
      ).not.toBeInTheDocument();
    });

    jest.advanceTimersByTime(1000 * 60 * 60 * 24 * 2);

    rerender(<FlexFarmerAnnouncement />);

    expect(
      screen.getByRole('link', { name: /learn more about flexfarmer/i })
    ).toBeVisible();
  });
});
