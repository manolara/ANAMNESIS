import * as Tone from 'tone';
import { describe, it, vi } from 'vitest';
import {
  getCurrentBar,
  getCurrentBeat,
  getNextSubdivision,
  mapLog,
  mapLogInv,
} from './utils';

vi.mock('tone', () => {
  const mockTransport = {
    position: {
      toString: vi.fn(() => '10:3:0'),
    },
  };
  return {
    Transport: mockTransport,
  };
});

describe('getCurrentBar', async () => {
  it('returns the current bar', () => {
    vi.spyOn(Tone.Transport, 'position', 'get').mockReturnValue('2:0:0');

    const result = getCurrentBar();

    expect(result).toEqual(2);
  });
});

describe('getCurrentBeat', async () => {
  it('returns the current beat', () => {
    vi.spyOn(Tone.Transport, 'position', 'get').mockReturnValue('1:3:0');
    expect(getCurrentBeat()).toEqual(3);
  });
});

describe('getNextSubdivision', async () => {
  it('should return the next bar when given a "m" subdivision', () => {
    vi.spyOn(Tone.Transport, 'position', 'get').mockReturnValue('1:0:0');
    const result = getNextSubdivision('m');
    expect(result).toBe('2:0:0');
  });

  it('should return the next beat in the same bar when given an "n" subdivision', () => {
    vi.spyOn(Tone.Transport, 'position', 'get').mockReturnValue('1:0:0');
    const result = getNextSubdivision('n');
    expect(result).toBe('1:1:0');
  });

  it('should return the first beat in the next bar when given an "n" subdivision and current beat is 3', () => {
    vi.spyOn(Tone.Transport, 'position', 'get').mockReturnValue('1:3:0');
    const result = getNextSubdivision('n');
    expect(result).toBe('2:0:0');
  });
  it('should return the time after 2 bars given a "2m" input', () => {
    vi.spyOn(Tone.Transport, 'position', 'get').mockReturnValue('1:3:0');
    const result = getNextSubdivision('2m');
    expect(result).toBe('3:0:0');
  });
  it('should give time 2 beats ahead if 2n passed', () => {
    vi.spyOn(Tone.Transport, 'position', 'get').mockReturnValue('1:1:0');
    const result = getNextSubdivision('2n');
    expect(result).toBe('1:3:0');
  });

  it('should go to next beat if available beats exceeded', () => {
    vi.spyOn(Tone.Transport, 'position', 'get').mockReturnValue('1:3:0');
    const result = getNextSubdivision('2n');
    expect(result).toBe('2:1:0');
  });
});

describe('mapLog', () => {
  it('should map a value from one range to another using a logarithmic scale', () => {
    expect(Math.floor(mapLog(0, 0, 10, 100, 1000))).toEqual(100);
    expect(Math.round(mapLog(5, 0, 10, 100, 1000))).toEqual(316);
    expect(Math.round(mapLog(10, 0, 10, 100, 1000))).toEqual(1000);
  });

  it('should handle the edge case where minv is 0', () => {
    expect(mapLog(0, 0, 10, 0, 1000)).toEqual(0.2);
  });
});

describe('mapLogInv', () => {
  it('should map a value from one range to another using an inverted logarithmic scale', () => {
    expect(mapLogInv(100, 0, 10, 100, 1000)).toEqual(0);
    expect(Math.round(mapLogInv(316.22, 0, 10, 100, 1000))).toEqual(5);
    expect(mapLogInv(1000, 0, 10, 100, 1000)).toEqual(10);
  });

  it('should handle the edge case where minv is 0', () => {
    expect(mapLogInv(0.2, 0, 10, 0, 1000)).toEqual(0);
  });
});
