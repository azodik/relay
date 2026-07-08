import type { InertiaLinkProps } from '@inertiajs/react';
import { usePage } from '@inertiajs/react';
import { useMemo } from 'react';
import { toUrl } from '@/lib/utils';

export type UseCurrentUrlReturn = {
    currentUrl: string;
    isCurrentUrl: (
        urlToCheck: NonNullable<InertiaLinkProps['href']>,
        currentUrl?: string,
        startsWith?: boolean,
    ) => boolean;
    isCurrentOrParentUrl: (
        urlToCheck: NonNullable<InertiaLinkProps['href']>,
        currentUrl?: string,
    ) => boolean;
    whenCurrentUrl: <T, F = null>(
        urlToCheck: NonNullable<InertiaLinkProps['href']>,
        ifTrue: T,
        ifFalse?: F,
    ) => T | F;
};

export function useCurrentUrl(): UseCurrentUrlReturn {
    const page = usePage();

    const currentUrl = useMemo(
        () =>
            new URL(
                page.url,
                typeof window !== 'undefined'
                    ? window.location.origin
                    : 'http://localhost',
            ).pathname,
        [page.url],
    );

    function isCurrentUrl(
        urlToCheck: NonNullable<InertiaLinkProps['href']>,
        urlToCompare: string = currentUrl,
        startsWith: boolean = false,
    ) {
        const urlString = toUrl(urlToCheck);

        const comparePath = (path: string): boolean =>
            startsWith ? urlToCompare.startsWith(path) : path === urlToCompare;

        if (!urlString.startsWith('http')) {
            return comparePath(urlString);
        }

        try {
            const absoluteUrl = new URL(urlString);

            return comparePath(absoluteUrl.pathname);
        } catch {
            return false;
        }
    }

    function isCurrentOrParentUrl(
        urlToCheck: NonNullable<InertiaLinkProps['href']>,
        urlToCompare?: string,
    ) {
        return isCurrentUrl(urlToCheck, urlToCompare, true);
    }

    function whenCurrentUrl<T, F = null>(
        urlToCheck: NonNullable<InertiaLinkProps['href']>,
        ifTrue: T,
        ifFalse: F = null as F,
    ): T | F {
        return isCurrentUrl(urlToCheck) ? ifTrue : ifFalse;
    }

    return {
        currentUrl,
        isCurrentUrl,
        isCurrentOrParentUrl,
        whenCurrentUrl,
    };
}
