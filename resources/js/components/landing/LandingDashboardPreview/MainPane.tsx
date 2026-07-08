import { SlidersHorizontal } from 'lucide-react';
import type { CSSProperties } from 'react';
import type { InspectorTab, PreviewMetric, PreviewRow } from './data';
import { earlierRows } from './data';
import EmailRowButton from './EmailRowButton';
import Inspector from './Inspector';

type MainPaneProps = {
    metrics: PreviewMetric[];
    visibleRows: PreviewRow[];
    deliveredCount: number;
    selectedRow: PreviewRow;
    isInspectorOpen: boolean;
    activeTab: InspectorTab;
    onSelectRow: (row: PreviewRow) => void;
    onTabChange: (tab: InspectorTab) => void;
    onCloseInspector: () => void;
};

export default function MainPane({
    metrics,
    visibleRows,
    deliveredCount,
    selectedRow,
    isInspectorOpen,
    activeTab,
    onSelectRow,
    onTabChange,
    onCloseInspector,
}: MainPaneProps) {
    return (
        <main className="preview-main">
            <section className="preview-titlebar">
                <h3>Activity</h3>
                <span>
                    <i></i> live
                </span>
                <button type="button">Export</button>
            </section>

            <section className="preview-metrics">
                {metrics.map((metric, index) => (
                    <button
                        key={metric.label}
                        type="button"
                        style={
                            {
                                '--metric-delay': `${index * 90}ms`,
                            } as CSSProperties
                        }
                    >
                        <span>{metric.label}</span>
                        <strong>{metric.value}</strong>
                        <em className={metric.tone}>
                            {metric.delta} vs prior
                        </em>
                        <svg viewBox="0 0 90 34" preserveAspectRatio="none">
                            <path d="M0 23 L10 18 L20 21 L30 12 L40 16 L50 8 L60 11 L70 5 L80 13 L90 7" />
                            <path
                                className="fill"
                                d="M0 23 L10 18 L20 21 L30 12 L40 16 L50 8 L60 11 L70 5 L80 13 L90 7 L90 34 L0 34 Z"
                            />
                        </svg>
                    </button>
                ))}
            </section>

            <section className="preview-workspace">
                <div className="preview-table">
                    <div className="filter-row">
                        <button type="button" className="active">
                            All <span>{visibleRows.length}</span>
                        </button>
                        <button type="button">
                            Delivered <span>{deliveredCount}</span>
                        </button>
                        <button type="button">
                            Opened <span>3</span>
                        </button>
                        <button type="button">
                            Clicked <span>2</span>
                        </button>
                        <button type="button" className="filter">
                            <SlidersHorizontal /> Clear
                        </button>
                    </div>

                    <div className="table-head">
                        <span></span>
                        <span>Recipient · Subject</span>
                        <span>Template</span>
                        <span>Engagement</span>
                        <span>Status</span>
                        <span>Time</span>
                    </div>

                    <div className="table-scroll">
                        <div className="group-label">
                            Last hour · {visibleRows.length}
                        </div>
                        {visibleRows.map((row) => (
                            <EmailRowButton
                                key={row.id}
                                row={row}
                                selected={
                                    isInspectorOpen && selectedRow.id === row.id
                                }
                                entering
                                onSelect={onSelectRow}
                            />
                        ))}

                        <div className="group-label">
                            Earlier today · {earlierRows.length}
                        </div>
                        {earlierRows.map((row) => (
                            <EmailRowButton
                                key={row.id}
                                row={row}
                                selected={
                                    isInspectorOpen && selectedRow.id === row.id
                                }
                                onSelect={onSelectRow}
                            />
                        ))}
                    </div>
                </div>

                {isInspectorOpen ? (
                    <Inspector
                        selectedRow={selectedRow}
                        activeTab={activeTab}
                        onTabChange={onTabChange}
                        onClose={onCloseInspector}
                    />
                ) : null}
            </section>
        </main>
    );
}
