import '@testing-library/jest-dom';

// Mock window.location.href (jsdom doesn't support navigation)
Object.defineProperty(window, 'location', {
  writable: true,
  value: { href: '', origin: 'https://arisewebx.com', protocol: 'https:' },
});

// Mock navigator properties
Object.defineProperty(navigator, 'language', { value: 'en-US', configurable: true });
Object.defineProperty(navigator, 'userAgent', {
  value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
  configurable: true,
});
Object.defineProperty(navigator, 'onLine', { value: true, configurable: true });

// Mock Intl.DateTimeFormat
const mockIntl = { resolvedOptions: () => ({ timeZone: 'Asia/Kolkata' }) };
vi.spyOn(Intl, 'DateTimeFormat').mockReturnValue(mockIntl);
