import { Link } from '@inertiajs/react';
import type { CSSProperties } from 'react';
import AppLogoIcon from '@/components/AppLogoIcon';
import LandingDashboardPreview from '@/components/landing/LandingDashboardPreview';
import type { PrimaryCta } from './constants';
import { installCommand, marqueeItems, repoUrl } from './constants';

type WelcomeHeroProps = {
    primaryCta: PrimaryCta;
    primaryCtaAnchorHref: string;
    installCopied: boolean;
    onCopyInstall: () => void;
};

export default function WelcomeHero({
    primaryCta,
    primaryCtaAnchorHref,
    installCopied,
    onCopyInstall,
}: WelcomeHeroProps) {
    return (
        <>
            <section className="hero container">
                <div
                    className="brand hero-brand reveal"
                    aria-label="Azodik Relay"
                >
                    <span className="mark">
                        <AppLogoIcon className="brand-mark-icon" />
                    </span>
                    <span className="brand-wordmark">Relay</span>
                </div>

                <h1 className="reveal hero-title">
                    <span className="line">Own your SES pipeline.</span>
                    <span className="line accent-line">
                        See every send land.
                    </span>
                </h1>

                <p className="lede reveal">
                    Azodik Relay is the open-source Laravel control plane for
                    Amazon SES—activity logs, verified domains, API keys, and
                    webhooks running entirely on infrastructure you control.
                </p>

                <div className="cta-row reveal">
                    {primaryCta.kind === 'inertia' ? (
                        <Link
                            className="btn primary big"
                            href={primaryCta.href}
                        >
                            {primaryCta.label}
                            <span aria-hidden="true">→</span>
                        </Link>
                    ) : (
                        <a
                            className="btn primary big"
                            href={primaryCtaAnchorHref}
                        >
                            {primaryCta.label}
                            <span aria-hidden="true">→</span>
                        </a>
                    )}
                    <a
                        className="btn big"
                        href={repoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        View source
                    </a>
                </div>

                <div
                    className="hero-visual reveal"
                    aria-label="Azodik Relay dashboard preview"
                >
                    <LandingDashboardPreview />
                </div>
            </section>

            <section
                className="post-hero container"
                aria-label="Install and stats"
            >
                <div className="install-cmd reveal">
                    <code>{installCommand}</code>
                    <button
                        type="button"
                        className="btn ghost"
                        onClick={onCopyInstall}
                    >
                        {installCopied ? 'Copied' : 'Copy'}
                    </button>
                </div>

                <div className="hero-stats reveal">
                    <div style={{ '--stagger': '0ms' } as CSSProperties}>
                        <strong>SES rates</strong>
                        <span>
                            Pay Amazon for delivery—Relay adds no per-send tax
                        </span>
                    </div>
                    <div style={{ '--stagger': '70ms' } as CSSProperties}>
                        <strong>~5 min</strong>
                        <span>
                            Compose up → owner account → first verified domain
                        </span>
                    </div>
                    <div style={{ '--stagger': '140ms' } as CSSProperties}>
                        <strong>Your VPC</strong>
                        <span>
                            Message bodies and keys stay on hosts you operate
                        </span>
                    </div>
                    <div style={{ '--stagger': '210ms' } as CSSProperties}>
                        <strong>MIT</strong>
                        <span>
                            Audit the Relay codepath before it touches prod mail
                        </span>
                    </div>
                </div>
            </section>

            <section
                className="marquee reveal container"
                aria-label="Use cases"
            >
                <div className="marquee-track">
                    {[...marqueeItems, ...marqueeItems].map((item, index) => (
                        <span key={`${item}-${index}`}>{item}</span>
                    ))}
                </div>
            </section>
        </>
    );
}
