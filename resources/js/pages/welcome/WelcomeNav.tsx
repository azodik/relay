import { Link } from '@inertiajs/react';
import { Menu, X } from 'lucide-react';
import { useEffect, useId, useState } from 'react';
import AppLogoIcon from '@/components/AppLogoIcon';
import { dashboard, login, register } from '@/routes';
import { repoUrl } from './constants';

type WelcomeNavProps = {
    isSignedIn: boolean;
    canRegister: boolean;
};

const navAnchors = [
    { href: '#features', label: 'Features' },
    { href: '#setup', label: 'Deploy' },
    { href: '#code', label: 'Laravel' },
    { href: '#open-source', label: 'Open source' },
] as const;

export default function WelcomeNav({
    isSignedIn,
    canRegister,
}: WelcomeNavProps) {
    const [menuOpen, setMenuOpen] = useState(false);
    const menuId = useId();

    useEffect(() => {
        if (!menuOpen) {
            return;
        }

        const onKeyDown = (event: KeyboardEvent): void => {
            if (event.key === 'Escape') {
                setMenuOpen(false);
            }
        };

        document.addEventListener('keydown', onKeyDown);
        document.body.style.overflow = 'hidden';

        return () => {
            document.removeEventListener('keydown', onKeyDown);
            document.body.style.overflow = '';
        };
    }, [menuOpen]);

    const closeMenu = (): void => {
        setMenuOpen(false);
    };

    return (
        <nav className={`nav${menuOpen ? ' is-open' : ''}`}>
            <div className="nav-inner">
                <a
                    className="brand"
                    href="#top"
                    aria-label="Azodik Relay home"
                    onClick={closeMenu}
                >
                    <span className="mark">
                        <AppLogoIcon className="brand-mark-icon" />
                    </span>
                    <span className="brand-wordmark">Relay</span>
                </a>

                <div className="nav-links" aria-hidden={menuOpen}>
                    {navAnchors.map((item) => (
                        <a key={item.href} href={item.href}>
                            {item.label}
                        </a>
                    ))}
                </div>

                <div className="nav-cta">
                    <a
                        className="github-pill nav-cta-desktop"
                        href={repoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <span>GitHub</span>
                    </a>
                    {isSignedIn ? (
                        <Link
                            className="btn ghost nav-cta-desktop"
                            href={dashboard()}
                        >
                            Dashboard
                        </Link>
                    ) : (
                        <Link
                            className="btn ghost nav-cta-desktop"
                            href={login()}
                        >
                            Sign in
                        </Link>
                    )}
                    {!isSignedIn && canRegister ? (
                        <Link
                            className="btn primary nav-cta-desktop"
                            href={register()}
                        >
                            Deploy
                            <span aria-hidden="true">→</span>
                        </Link>
                    ) : null}

                    <button
                        type="button"
                        className="nav-toggle"
                        aria-expanded={menuOpen}
                        aria-controls={menuId}
                        aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                        onClick={() => setMenuOpen((open) => !open)}
                    >
                        {menuOpen ? (
                            <X className="size-5" />
                        ) : (
                            <Menu className="size-5" />
                        )}
                    </button>
                </div>
            </div>

            <div
                id={menuId}
                className="nav-drawer"
                hidden={!menuOpen}
                aria-hidden={!menuOpen}
            >
                <div className="nav-drawer-links">
                    {navAnchors.map((item) => (
                        <a
                            key={item.href}
                            href={item.href}
                            onClick={closeMenu}
                        >
                            {item.label}
                        </a>
                    ))}
                    <a
                        href={repoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={closeMenu}
                    >
                        GitHub
                    </a>
                </div>
                <div className="nav-drawer-actions">
                    {isSignedIn ? (
                        <Link
                            className="btn primary"
                            href={dashboard()}
                            onClick={closeMenu}
                        >
                            Open dashboard
                        </Link>
                    ) : (
                        <>
                            <Link
                                className="btn ghost"
                                href={login()}
                                onClick={closeMenu}
                            >
                                Sign in
                            </Link>
                            {canRegister ? (
                                <Link
                                    className="btn primary"
                                    href={register()}
                                    onClick={closeMenu}
                                >
                                    Deploy Relay
                                    <span aria-hidden="true">→</span>
                                </Link>
                            ) : null}
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}
