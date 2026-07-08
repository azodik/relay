import type { CSSProperties } from 'react';
import { setupSteps } from './constants';

export default function WelcomeSetup() {
    return (
        <section id="setup" className="section container">
            <div className="section-head reveal">
                <span>Deploy path</span>
                <h2>From Compose file to first verified domain.</h2>
                <p>
                    Relay is self-hosted by design. You bring Postgres or MySQL,
                    an AWS account with SES access, and the domain you already
                    own for transactional mail.
                </p>
            </div>

            <div className="steps reveal">
                {setupSteps.map((step, index) => (
                    <article
                        key={step[0]}
                        className="step"
                        style={
                            {
                                '--card-delay': `${index * 90}ms`,
                            } as CSSProperties
                        }
                    >
                        <code>{step[0]}</code>
                        <h3>{step[1]}</h3>
                        <p>{step[2]}</p>
                    </article>
                ))}
            </div>
        </section>
    );
}
