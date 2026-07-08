import type { CSSProperties } from 'react';
import { featureCards } from './constants';

export default function WelcomeFeatures() {
    return (
        <section id="features" className="section container">
            <div className="section-head reveal">
                <span>Operational clarity</span>
                <h2>What SES leaves blank, Relay fills in.</h2>
                <p>
                    Amazon SES ships scale and price. Azodik Relay adds the
                    product layer Laravel teams actually debug against—keys,
                    previews, DNS status, and webhook postmortem—without routing
                    mail through a third-party mailbox.
                </p>
            </div>

            <div className="features-grid reveal">
                {featureCards.map((feature, index) => (
                    <article
                        key={feature.title}
                        className={`feature-card ${feature.accent}`}
                        style={
                            {
                                '--card-delay': `${index * 90}ms`,
                            } as CSSProperties
                        }
                    >
                        <div className="feature-icon"></div>
                        <h3>{feature.title}</h3>
                        <p>{feature.body}</p>
                    </article>
                ))}
            </div>
        </section>
    );
}
