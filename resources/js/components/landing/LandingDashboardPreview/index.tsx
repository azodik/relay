import type { CSSProperties, PointerEvent as ReactPointerEvent } from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import Chrome from './Chrome';
import type { InspectorTab, PreviewMetric, PreviewRow } from './data';
import { earlierRows, rangeOptions, rows } from './data';
import MainPane from './MainPane';
import Sidebar from './Sidebar';
import '../LandingDashboardPreview.css';

type RangeOption = (typeof rangeOptions)[number];

export default function LandingDashboardPreview() {
    const [sentCount, setSentCount] = useState(18420);
    const [visibleCount, setVisibleCount] = useState(1);
    const [selectedId, setSelectedId] = useState(rows[0].id);
    const [activeTab, setActiveTab] = useState<InspectorTab>('preview');
    const [range, setRange] = useState<RangeOption>('14d');
    const [isInspectorOpen, setIsInspectorOpen] = useState(true);
    const [isSearching, setIsSearching] = useState(false);
    const [tiltX, setTiltX] = useState(2);
    const [tiltY, setTiltY] = useState(-1.2);
    const [isTilting, setIsTilting] = useState(false);

    const metrics = useMemo<PreviewMetric[]>(
        () => [
            {
                label: 'Sent',
                value: sentCount.toLocaleString('en-US'),
                delta: '+12.4%',
                tone: 'up',
            },
            {
                label: 'Delivery rate',
                value: '98.71%',
                delta: '+0.12%',
                tone: 'up',
            },
            {
                label: 'Open rate',
                value: '56.4%',
                delta: '+2.1%',
                tone: 'up',
            },
            {
                label: 'Click rate',
                value: '14.8%',
                delta: '-0.4%',
                tone: 'down',
            },
            {
                label: 'Bounce rate',
                value: '1.18%',
                delta: '+0.06%',
                tone: 'down',
            },
        ],
        [sentCount],
    );

    const visibleRows = useMemo(
        () => rows.slice(0, visibleCount),
        [visibleCount],
    );

    const selectedRow = useMemo(
        () =>
            [...rows, ...earlierRows].find((row) => row.id === selectedId) ??
            rows[0],
        [selectedId],
    );

    const deliveredCount = useMemo(
        () =>
            visibleRows.filter((row) =>
                ['delivered', 'opened', 'clicked'].includes(row.status),
            ).length,
        [visibleRows],
    );

    const shellStyle = useMemo(
        () =>
            ({
                '--tilt-x': `${tiltX}deg`,
                '--tilt-y': `${tiltY}deg`,
            }) as CSSProperties,
        [tiltX, tiltY],
    );

    const selectRow = useCallback((row: PreviewRow): void => {
        setSelectedId(row.id);
        setIsInspectorOpen(true);
    }, []);

    const closeInspector = useCallback((): void => {
        setIsInspectorOpen(false);
    }, []);

    const replay = useCallback((): void => {
        setVisibleCount(1);
        setSelectedId(rows[0].id);
        setIsInspectorOpen(true);
    }, []);

    const handleShellPointerMove = useCallback(
        (event: ReactPointerEvent<HTMLDivElement>): void => {
            if (
                window.matchMedia('(pointer: coarse)').matches ||
                window.matchMedia('(prefers-reduced-motion: reduce)').matches
            ) {
                return;
            }

            const rect = event.currentTarget.getBoundingClientRect();
            const relativeX = (event.clientX - rect.left) / rect.width - 0.5;
            const relativeY = (event.clientY - rect.top) / rect.height - 0.5;

            setTiltX(relativeY * -3.5);
            setTiltY(relativeX * 4.5);
            setIsTilting(true);
        },
        [],
    );

    const resetShellTilt = useCallback((): void => {
        setTiltX(2);
        setTiltY(-1.2);
        setIsTilting(false);
    }, []);

    useEffect(() => {
        const timer = window.setInterval(() => {
            setSentCount((current) => current + 1 + Math.floor(Math.random() * 3));

            setVisibleCount((currentVisible) => {
                if (currentVisible < rows.length) {
                    const next = currentVisible + 1;
                    setSelectedId(rows[next - 1].id);

                    return next;
                }

                setSelectedId((currentSelected) => {
                    const index = rows.findIndex(
                        (row) => row.id === currentSelected,
                    );

                    return rows[(index + 1) % rows.length].id;
                });

                return currentVisible;
            });
        }, 1650);

        return () => {
            window.clearInterval(timer);
        };
    }, []);

    return (
        <div
            className={`preview-shell${isTilting ? ' is-tilting' : ''}`}
            style={shellStyle}
            aria-label="Animated Azodik Relay dashboard preview"
            onPointerMove={handleShellPointerMove}
            onPointerLeave={resetShellTilt}
        >
            <div className="preview-glass"></div>

            <Chrome
                isSearching={isSearching}
                range={range}
                onToggleSearch={() => setIsSearching((current) => !current)}
                onReplay={replay}
                onRangeChange={setRange}
            />

            <div className="preview-body">
                <Sidebar />
                <MainPane
                    metrics={metrics}
                    visibleRows={visibleRows}
                    deliveredCount={deliveredCount}
                    selectedRow={selectedRow}
                    isInspectorOpen={isInspectorOpen}
                    activeTab={activeTab}
                    onSelectRow={selectRow}
                    onTabChange={setActiveTab}
                    onCloseInspector={closeInspector}
                />
            </div>
        </div>
    );
}
