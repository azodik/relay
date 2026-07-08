import AppLogoIcon from '@/components/AppLogoIcon';
import { azodikUrl, repoUrl } from './constants';

const productLinks = [
    { href: '#features', label: 'Features' },
    { href: '#setup', label: 'Deploy' },
    { href: '#code', label: 'Laravel mailer' },
    { href: '#open-source', label: 'Open source' },
] as const;

const resourceLinks = [
    { href: repoUrl, label: 'GitHub repository', external: true },
    { href: `${repoUrl}#readme`, label: 'Install guide', external: true },
    { href: azodikUrl, label: 'Azodik', external: true },
] as const;

export default function WelcomeFooter() {
    return (
        <footer>
            <div className="footer-shell container">
                <div className="footer-brand-block">
                    <div className="brand footer-brand">
                        <span className="mark">
                            <AppLogoIcon className="brand-mark-icon" />
                        </span>
                        <span className="brand-wordmark">Relay</span>
                    </div>
                    <p>
                        Self-hosted Amazon SES control plane for Laravel —
                        delivery visibility, domain trust, and API keys without
                        a hosted mail broker in the middle.
                    </p>
                </div>

                <div className="footer-columns">
                    <div className="footer-col">
                        <span className="footer-col-label">Product</span>
                        {productLinks.map((item) => (
                            <a key={item.href} href={item.href}>
                                {item.label}
                            </a>
                        ))}
                    </div>
                    <div className="footer-col">
                        <span className="footer-col-label">Resources</span>
                        {resourceLinks.map((item) => (
                            <a
                                key={item.href}
                                href={item.href}
                                {...(item.external
                                    ? {
                                          target: '_blank',
                                          rel: 'noopener noreferrer',
                                      }
                                    : {})}
                            >
                                {item.label}
                            </a>
                        ))}
                    </div>
                </div>
            </div>

            <div className="legal container">
                <span>
                    © {new Date().getFullYear()} Azodik Relay ·{' '}
                    <a
                        href={azodikUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Azodik Consulting Pvt Ltd
                    </a>
                </span>
                <span>MIT · Docker · Laravel · Amazon SES</span>
            </div>
        </footer>
    );
}
