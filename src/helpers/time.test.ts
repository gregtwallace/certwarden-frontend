import { afterEach, describe, expect, test, vi } from 'vitest';

import { dateToStandardizedString } from './time.ts';

// test getLocale() function that deduces the user's locale
describe('getLocale', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  // use UTC for all of these
  vi.stubEnv('TZ', 'UTC');

  // use relatively recent time: Sun Jan 04 2026 20:32:59 GMT+0000
  const d = new Date(1767558779 * 1000);

  test('navigator.languages multiple values', () => {
    vi.spyOn(navigator, 'languages', 'get').mockReturnValue([
      'en-US',
      'en-GB',
      'de-DE',
    ]);

    expect(dateToStandardizedString(d)).toBe('01/04/2026, 08:32:59 PM GMT+0');
  });

  test('navigator.languages single value', () => {
    vi.spyOn(navigator, 'languages', 'get').mockReturnValue(['en-GB']);

    expect(dateToStandardizedString(d)).toBe('04/01/2026, 20:32:59 GMT+0');
  });

  test('navigator.languages empty, use language', () => {
    vi.spyOn(navigator, 'languages', 'get').mockReturnValue([]);
    vi.spyOn(navigator, 'language', 'get').mockReturnValue('de-DE');

    expect(dateToStandardizedString(d)).toBe('04.01.2026, 20:32:59 GMT+0');
  });

  test('navigator.languages & language empty, use fallback default', () => {
    vi.spyOn(navigator, 'languages', 'get').mockReturnValue([]);
    vi.spyOn(navigator, 'language', 'get').mockReturnValue('');

    expect(dateToStandardizedString(d)).toBe('01/04/2026, 08:32:59 PM GMT+0');
  });
});

// test 'dateToStandardizedString' under various time zone and locale conditions
describe('dateToStandardizedString', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  // use relatively recent time: Sun Jan 04 2026 20:32:59 GMT+0000
  const d = new Date(1767558779 * 1000);

  test('timezone: EST, locale: en-US', () => {
    vi.stubEnv('TZ', 'EST');
    vi.spyOn(navigator, 'languages', 'get').mockReturnValue(['en-US']);

    expect(dateToStandardizedString(d)).toBe('01/04/2026, 03:32:59 PM GMT-5');
  });

  test('timezone: CET, locale: de-DE', () => {
    vi.stubEnv('TZ', 'CET');
    vi.spyOn(navigator, 'languages', 'get').mockReturnValue(['de-DE']);

    expect(dateToStandardizedString(d)).toBe('04.01.2026, 21:32:59 GMT+1');
  });

  test('timezone: UTC, locale: gb-EN', () => {
    vi.stubEnv('TZ', 'UTC');
    vi.spyOn(navigator, 'languages', 'get').mockReturnValue(['en-GB']);

    expect(dateToStandardizedString(d)).toBe('04/01/2026, 20:32:59 GMT+0');
  });
});
