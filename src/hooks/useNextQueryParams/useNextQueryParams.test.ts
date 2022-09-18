import singletonRouter, { useRouter } from 'next/router';
import useNextQueryParams from './useNextQueryParams';
import { act, renderHook } from '@testing-library/react-hooks';
import mockRouter from 'next-router-mock';
import { waitFor } from '@testing-library/dom';

jest.mock('next/router', () => require('next-router-mock'));

describe('useNextQueryParams', () => {
  beforeEach(() => {
    mockRouter.setCurrentUrl('/example');
  });

  it('should set all query params as undefined by default', () => {
    const { result } = renderHook(() => useNextQueryParams('foo', 'bar'));
    expect(result.current[0]).toEqual({ foo: undefined, bar: undefined });
  });

  it('should always sync query params in the url', async () => {
    const { result } = renderHook(() => useNextQueryParams('foo', 'bar'));
    const { result: routerResult } = renderHook(() => useRouter());

    expect(result.current[0]).toEqual({ foo: undefined, bar: undefined });

    act(() => {
      result.current[1]({ foo: 'foo' });
    });

    expect(result.current[0]).toEqual({ foo: 'foo', bar: undefined });

    await act(async () => {
      await waitFor(() =>
        expect(routerResult.current.query).toEqual('foo=foo')
      );
    });

    act(() => {
      result.current[1]({ foo: 'baz', bar: 'bar' });
    });

    expect(result.current[0]).toEqual({ foo: 'baz', bar: 'bar' });

    await act(async () => {
      await waitFor(() =>
        expect(routerResult.current.query).toEqual('foo=baz&bar=bar')
      );
    });

    act(() => {
      result.current[1]({ foo: undefined, bar: 'bar' });
    });

    await act(async () => {
      await waitFor(() =>
        expect(routerResult.current.query).toEqual('bar=bar')
      );
    });
  });
});
