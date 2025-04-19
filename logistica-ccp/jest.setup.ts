import "@testing-library/jest-dom";
import fetchMock from 'jest-fetch-mock'
fetchMock.enableMocks()

jest.mock('next-intl', () => ({
    useTranslations: () => (key: string) => {
        const translations: Record<string, string> = {
            'common.language': 'Español (Latinoamérica)'
        };
        return translations[key] || key;
    },
    useFormatter: () => ({
        format: (value: any) => value
    }),
    useLocale: () => 'es',
    useMessages: () => ({}),
    hasLocale: (locales: string[], locale: string) => locales.includes(locale),
    NextIntlClientProvider: ({ children }: any) => children
}));

jest.mock('next-intl/routing', () => ({
    defineRouting: () => ({
        locales: ['es', 'en'], // Add any locales you support
        defaultLocale: 'es'
    })
}));

jest.mock('next/navigation', () => ({
    useRouter: () => ({
      push: jest.fn(),
      replace: jest.fn(),
      forward: jest.fn(),
      back: jest.fn(),
      refresh: jest.fn(),
      prefetch: jest.fn()
    }),
    usePathname: () => '/some-path', // Or whatever makes sense in your test
    useSearchParams: () => new URLSearchParams(),
    notFound: () => {
      throw new Error('notFound called');
    },
    useServerInsertedHTML: () => () => {}
  }));