import singletonRouter, { useRouter } from 'next/router';
import useNextQueryParams from './useNextQueryParams';
import { act, renderHook } from '@testing-library/react-hooks';
import mockRouter from 'next-router-mock';

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
    const { result, rerender } = renderHook(() =>
      useNextQueryParams('foo', 'bar')
    );
    const { result: routerResult } = renderHook(() => useRouter());

    expect(result.current[0]).toEqual({ foo: undefined, bar: undefined });

    act(() => {
      result.current[1]({ foo: 'foo' });
    });

    expect(result.current[0]).toEqual({ foo: 'foo', bar: undefined });

    expect(routerResult.current.query).toEqual('foo=foo');

    rerender();

    act(() => {
      result.current[1]({ foo: 'baz', bar: 'bar' });
    });

    expect(result.current[0]).toEqual({ foo: 'baz', bar: 'bar' });

    expect(routerResult.current.query).toEqual('foo=baz&bar=bar');

    rerender();

    act(() => {
      result.current[1]({ foo: undefined, bar: 'bar' });
    });

    expect(routerResult.current.query).toEqual('bar=bar');
  });
});
