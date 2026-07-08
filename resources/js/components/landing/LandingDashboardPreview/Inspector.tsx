import { Copy, X } from 'lucide-react';
import type { CSSProperties } from 'react';
import {
    inspectorTabs,
    statusClass,
    timelineDescription,
    timelineEvents,
    type InspectorTab,
    type PreviewRow,
} from './data';

type InspectorProps = {
    selectedRow: PreviewRow;
    activeTab: InspectorTab;
    onTabChange: (tab: InspectorTab) => void;
    onClose: () => void;
};

export default function Inspector({
    selectedRow,
    activeTab,
    onTabChange,
    onClose,
}: InspectorProps) {
    return (
        <aside className="preview-inspector">
            <div className="inspector-actions">
                <span
                    className={`status-pill ${statusClass(selectedRow.status)}`}
                >
                    <i></i>
                    {selectedRow.status}
                </span>
                <code>{selectedRow.id}</code>
                <button type="button">
                    <Copy />
                </button>
                <button type="button">Retry</button>
                <button type="button" onClick={onClose}>
                    <X />
                </button>
            </div>
            <h4>{selectedRow.subject}</h4>
            <dl>
                <dt>From</dt>
                <dd>
                    Azodik Relay Receipts &lt;receipts@relay.azodik.com&gt;
                </dd>
                <dt>To</dt>
                <dd>
                    {selectedRow.recipient} &lt;{selectedRow.email}&gt;
                </dd>
                <dt>Sent</dt>
                <dd>{selectedRow.time} ago</dd>
                <dt>Template</dt>
                <dd>{selectedRow.template}</dd>
            </dl>

            <div className="tabs">
                {inspectorTabs.map((tab) => (
                    <button
                        key={tab}
                        type="button"
                        className={activeTab === tab ? 'active' : undefined}
                        onClick={() => onTabChange(tab)}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <div className="tab-panel">
                {activeTab === 'timeline' ? (
                    <div className="timeline">
                        {timelineEvents.map((event, index) => (
                            <div
                                key={event}
                                style={
                                    {
                                        '--timeline-delay': `${index * 120}ms`,
                                    } as CSSProperties
                                }
                            >
                                <span></span>
                                <b>{event}</b>
                                <small>{timelineDescription(event)}</small>
                                <em>{index + 1}m</em>
                            </div>
                        ))}
                    </div>
                ) : null}

                {activeTab === 'preview' ? (
                    <div className="mail-preview">
                        <span>Northwind</span>
                        <h5>Thanks for your order, Maya.</h5>
                        <p>Order #INV-4821 · delivered May 12, 2026</p>
                        <div>
                            <span>Saltspring chef&apos;s knife</span>
                            <b>$184.00</b>
                            <span>Honing rod, 10&quot;</span>
                            <b>$42.00</b>
                            <span>Total charged</span>
                            <b>$290.00</b>
                        </div>
                    </div>
                ) : null}

                {activeTab === 'headers' ? (
                    <pre>{`Message-ID: ${selectedRow.id}
X-SES-Message-ID: 010f018f...
List-Unsubscribe-Post: List-Unsubscribe=One-Click
X-Relay-Project: harborlight`}</pre>
                ) : null}

                {activeTab === 'metrics' ? (
                    <div className="mini-metrics">
                        <div>
                            <span>Opens</span>
                            <strong>{selectedRow.opens}</strong>
                        </div>
                        <div>
                            <span>Clicks</span>
                            <strong>{selectedRow.clicks}</strong>
                        </div>
                    </div>
                ) : null}
            </div>
        </aside>
    );
}
