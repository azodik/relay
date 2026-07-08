import type { SharedPageProps } from '@inertiajs/core';
import { Head, usePage } from '@inertiajs/react';
import type { CSSProperties, PointerEvent as ReactPointerEvent } from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { copyText } from '@/lib/clipboard';
import {
    installCommand,
    pageDescription,
    pageTitle,
    resolvePrimaryCta,
} from './welcome/constants';
import WelcomeCode from './welcome/WelcomeCode';
import WelcomeCompare from './welcome/WelcomeCompare';
import WelcomeFeatures from './welcome/WelcomeFeatures';
import WelcomeFooter from './welcome/WelcomeFooter';
import WelcomeHero from './welcome/WelcomeHero';
import WelcomeNav from './welcome/WelcomeNav';
import { WelcomeFinalCta, WelcomeOss } from './welcome/WelcomeOss';
import WelcomeSetup from './welcome/WelcomeSetup';
import './Welcome.css';

type Props = {
    canRegister?: boolean;
};

export default function Welcome({ canRegister = true }: Props) {
    const page = usePage<SharedPageProps>();
    const isSignedIn = Boolean(page.props.auth?.user);
    const [pointerX, setPointerX] = useState(52);
    const [pointerY, setPointerY] = useState(18);
    const [installCopied, setInstallCopied] = useState(false);

    const primaryCta = useMemo(
        () => resolvePrimaryCta(isSignedIn, canRegister),
        [canRegister, isSignedIn],
    );

    const primaryCtaAnchorHref =
        primaryCta.kind === 'anchor' ? primaryCta.href : '#setup';

    const landingStyle = useMemo(
        () =>
            ({
                '--pointer-x': `${pointerX}%`,
                '--pointer-y': `${pointerY}%`,
            }) as CSSProperties,
        [pointerX, pointerY],
    );

    const copyInstallCommand = useCallback(async (): Promise<void> => {
        const ok = await copyText(installCommand);

        if (!ok) {
            return;
        }

        setInstallCopied(true);
        window.setTimeout(() => {
            setInstallCopied(false);
        }, 2000);
    }, []);

    const handleCopyInstall = useCallback((): void => {
        void copyInstallCommand();
    }, [copyInstallCommand]);

    const handlePointerMove = useCallback(
        (event: ReactPointerEvent<HTMLDivElement>): void => {
            if (window.matchMedia('(pointer: coarse)').matches) {
                return;
            }

            setPointerX(Math.round((event.clientX / window.innerWidth) * 100));
            setPointerY(Math.round((event.clientY / window.innerHeight) * 100));
        },
        [],
    );

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        observer.unobserve(entry.target);
                    }
                });
            },
            { rootMargin: '0px 0px -12% 0px', threshold: 0.16 },
        );

        document
            .querySelectorAll<HTMLElement>('.reveal')
            .forEach((element) => observer.observe(element));

        return () => {
            observer.disconnect();
        };
    }, []);

    return (
        <>
            <Head title={pageTitle}>
                <meta name="description" content={pageDescription} />
                <meta property="og:title" content={pageTitle} />
                <meta property="og:description" content={pageDescription} />
                <meta name="twitter:title" content={pageTitle} />
                <meta name="twitter:description" content={pageDescription} />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link
                    rel="preconnect"
                    href="https://fonts.gstatic.com"
                    crossOrigin="anonymous"
                />
                <link
                    href="https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700&family=Geist+Mono:wght@400;500;600&display=swap"
                    rel="stylesheet"
                />
            </Head>

            <div
                className="landing"
                style={landingStyle}
                onPointerMove={handlePointerMove}
            >
                <div className="bg-field" aria-hidden="true">
                    <div className="grid"></div>
                    <div className="grain"></div>
                    <div className="spotlight"></div>
                    <div className="glow glow-one"></div>
                </div>

                <WelcomeNav
                    isSignedIn={isSignedIn}
                    canRegister={canRegister}
                />

                <main id="top">
                    <WelcomeHero
                        primaryCta={primaryCta}
                        primaryCtaAnchorHref={primaryCtaAnchorHref}
                        installCopied={installCopied}
                        onCopyInstall={handleCopyInstall}
                    />
                    <WelcomeFeatures />
                    <WelcomeCode />
                    <WelcomeSetup />
                    <WelcomeCompare />
                    <WelcomeOss
                        primaryCta={primaryCta}
                        primaryCtaAnchorHref={primaryCtaAnchorHref}
                    />
                    <WelcomeFinalCta
                        primaryCta={primaryCta}
                        primaryCtaAnchorHref={primaryCtaAnchorHref}
                        installCopied={installCopied}
                        onCopyInstall={handleCopyInstall}
                    />
                </main>

                <WelcomeFooter />
            </div>
        </>
    );
}
