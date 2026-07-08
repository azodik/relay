import { azodikUrl, codeSnippet } from './constants';

export default function WelcomeCode() {
    return (
        <>
            <section id="code" className="section two-col reveal container">
                <div className="copy-panel">
                    <div className="section-kicker">Laravel mail transport</div>
                    <h2>
                        Drop-in for <code>Mail::send</code> — not a rewrite.
                    </h2>
                    <p>
                        Flip <code>MAIL_MAILER=relay</code> and keep your
                        mailables, notifications, and queues. Relay captures
                        each attempt as it hits Amazon SES so support and
                        security share one timeline.
                    </p>
                    <ul>
                        <li>Hashed API keys with one-time plaintext reveal.</li>
                        <li>Symfony Mailer transport wired for Laravel.</li>
                        <li>HTTP client for direct transactional API sends.</li>
                        <li>
                            Explicit SES throttle and rejection surfaces in the
                            UI.
                        </li>
                    </ul>
                </div>

                <div className="code-card reveal">
                    <div className="code-tabs">
                        <span></span>
                        <span>Laravel</span>
                    </div>
                    <pre>
                        <code>
                            <span className="code-cursor"></span>
                            {codeSnippet}
                        </code>
                    </pre>
                </div>
            </section>

            <section id="story" className="section reveal container">
                <div className="story-card">
                    <span className="section-kicker">Why Relay exists</span>
                    <h2>We needed SES with a cockpit, not another ESP.</h2>
                    <p>
                        At{' '}
                        <a
                            href={azodikUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Azodik
                        </a>
                        , transactional mail had to stay inside AWS accounts we
                        operate. Hosted email APIs put recipient content on
                        someone else&apos;s disks. Raw SES left us staring at
                        CloudWatch when a password reset failed.
                    </p>
                    <p>
                        Azodik Relay is the missing cockpit: same SES pricing,
                        Docker-friendly install, and a Laravel-native path from{' '}
                        <code>Mail::to()</code> to a verifiable delivery story.
                    </p>
                </div>
            </section>
        </>
    );
}
