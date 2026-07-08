import { Link } from '@inertiajs/react';
import AppLogoIcon from '@/components/AppLogoIcon';
import type { PrimaryCta } from './constants';
import { installCommand, repoUrl } from './constants';

type WelcomeOssProps = {
    primaryCta: PrimaryCta;
    primaryCtaAnchorHref: string;
};

export function WelcomeOss({
    primaryCta,
    primaryCtaAnchorHref,
}: WelcomeOssProps) {
    return (
        <section id="open-source" className="section oss reveal container">
            <div>
                <span className="section-kicker">Open source</span>
                <h2>
                    Inspect the mail path before it touches customer inboxes.
                </h2>
                <p>
                    Azodik Relay ships under MIT so platform teams can review
                    signing, key storage, and SES wiring on their terms—then run
                    the same binary in production on Docker Compose or their own
                    Kubernetes layout.
                </p>
                <div className="cta-row">
                    <a
                        className="btn primary big"
                        href={repoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Browse GitHub
                    </a>
                    {primaryCta.kind === 'inertia' ? (
                        <Link className="btn big" href={primaryCta.href}>
                            {primaryCta.label}
                        </Link>
                    ) : (
                        <a className="btn big" href={primaryCtaAnchorHref}>
                            {primaryCta.label}
                        </a>
                    )}
                </div>
            </div>
            <div className="repo-card">
                <div>
                    <span className="mark">
                        <AppLogoIcon className="brand-mark-icon" />
                    </span>
                    <b>azodik / relay</b>
                </div>
                <p>
                    SES dashboard, sending API, webhook router, and Laravel
                    mail package—one repository.
                </p>
                <ul>
                    <li>
                        <span></span> React + Inertia console
                    </li>
                    <li>
                        <span></span> Amazon SES v2 sending
                    </li>
                    <li>
                        <span></span> Docker Compose install
                    </li>
                    <li>
                        <span></span> Laravel Composer package
                    </li>
                </ul>
            </div>
        </section>
    );
}

type WelcomeFinalCtaProps = {
    primaryCta: PrimaryCta;
    primaryCtaAnchorHref: string;
    installCopied: boolean;
    onCopyInstall: () => void;
};

export function WelcomeFinalCta({
    primaryCta,
    primaryCtaAnchorHref,
    installCopied,
    onCopyInstall,
}: WelcomeFinalCtaProps) {
    return (
        <section id="cta" className="final-cta reveal container">
            <h2>Stand up Relay where your SES already lives.</h2>
            <p>
                Copy the Compose snippet, attach credentials, verify a domain,
                and start logging transactional mail with the same AWS bill you
                already understand.
            </p>
            <div className="install-cmd">
                <code>{installCommand}</code>
                <button
                    type="button"
                    className="btn ghost"
                    onClick={onCopyInstall}
                >
                    {installCopied ? 'Copied' : 'Copy'}
                </button>
            </div>
            <div className="cta-row">
                {primaryCta.kind === 'inertia' ? (
                    <Link className="btn primary big" href={primaryCta.href}>
                        {primaryCta.label}
                        <span aria-hidden="true">→</span>
                    </Link>
                ) : (
                    <a className="btn primary big" href={primaryCtaAnchorHref}>
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
        </section>
    );
}
