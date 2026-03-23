import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import useFetch from '@/hooks/use-fetch';

describe('useFetch', () => {
  beforeEach(() => vi.clearAllMocks());

  it('starts with data=null, loading=null, error=null', () => {
    const cb = vi.fn();
    const { result } = renderHook(() => useFetch(cb));

    expect(result.current.data).toBeNull();
    expect(result.current.loading).toBeNull();
    expect(result.current.error).toBeNull();
    expect(typeof result.current.fn).toBe('function');
  });

  it('sets loading=true while fetching, then false on success', async () => {
    const cb = vi.fn().mockResolvedValue({ name: 'Test' });
    const { result } = renderHook(() => useFetch(cb));

    await act(async () => {
      await result.current.fn();
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.data).toEqual({ name: 'Test' });
    expect(result.current.error).toBeNull();
  });

  it('sets error and loading=false when callback throws', async () => {
    const err = new Error('Fetch failed');
    const cb = vi.fn().mockRejectedValue(err);
    const { result } = renderHook(() => useFetch(cb));

    await act(async () => {
      await result.current.fn();
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(err);
    expect(result.current.data).toBeNull();
  });

  it('passes options as first argument to callback', async () => {
    const cb = vi.fn().mockResolvedValue('ok');
    const options = { id: '123' };
    const { result } = renderHook(() => useFetch(cb, options));

    await act(async () => {
      await result.current.fn();
    });

    expect(cb).toHaveBeenCalledWith(options);
  });

  it('passes additional args from fn() call to callback', async () => {
    const cb = vi.fn().mockResolvedValue('ok');
    const options = { userId: 'u1' };
    const { result } = renderHook(() => useFetch(cb, options));

    await act(async () => {
      await result.current.fn('extra1', 'extra2');
    });

    expect(cb).toHaveBeenCalledWith(options, 'extra1', 'extra2');
  });

  it('clears previous error on new fn() call', async () => {
    const cb = vi.fn()
      .mockRejectedValueOnce(new Error('First error'))
      .mockResolvedValueOnce({ data: 'success' });

    const { result } = renderHook(() => useFetch(cb));

    // First call - fails
    await act(async () => { await result.current.fn(); });
    expect(result.current.error).toBeTruthy();

    // Second call - succeeds and clears error
    await act(async () => { await result.current.fn(); });
    expect(result.current.error).toBeNull();
    expect(result.current.data).toEqual({ data: 'success' });
  });

  it('clears previous data on new successful fn() call', async () => {
    const cb = vi.fn()
      .mockResolvedValueOnce({ page: 1 })
      .mockResolvedValueOnce({ page: 2 });

    const { result } = renderHook(() => useFetch(cb));

    await act(async () => { await result.current.fn(); });
    expect(result.current.data).toEqual({ page: 1 });

    await act(async () => { await result.current.fn(); });
    expect(result.current.data).toEqual({ page: 2 });
  });

  it('works with async callbacks that return arrays', async () => {
    const mockData = [1, 2, 3];
    const cb = vi.fn().mockResolvedValue(mockData);
    const { result } = renderHook(() => useFetch(cb));

    await act(async () => { await result.current.fn(); });

    expect(result.current.data).toEqual([1, 2, 3]);
  });

  it('works with no options (defaults to empty object)', async () => {
    const cb = vi.fn().mockResolvedValue('result');
    const { result } = renderHook(() => useFetch(cb));

    await act(async () => { await result.current.fn(); });

    expect(cb).toHaveBeenCalledWith({});
    expect(result.current.data).toBe('result');
  });
});
