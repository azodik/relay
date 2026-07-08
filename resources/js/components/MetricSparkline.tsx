import {
    CategoryScale,
    Chart as ChartJS,
    Filler,
    LinearScale,
    LineController,
    LineElement,
    PointElement,
} from 'chart.js';
import type { ChartConfiguration } from 'chart.js';
import { useEffect, useRef } from 'react';

ChartJS.register(
    CategoryScale,
    Filler,
    LinearScale,
    LineController,
    LineElement,
    PointElement,
);

type MetricSparklineProps = {
    points: number[];
    trend: 'up' | 'down';
};

export default function MetricSparkline({
    points,
    trend,
}: MetricSparklineProps) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const chartRef = useRef<ChartJS<'line'> | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;

        if (!canvas) {
            return;
        }

        const color =
            trend === 'up' ? 'rgb(45, 212, 191)' : 'rgb(248, 113, 113)';
        const fillColor =
            trend === 'up'
                ? 'rgba(45, 212, 191, 0.12)'
                : 'rgba(248, 113, 113, 0.12)';

        const config: ChartConfiguration<'line'> = {
            type: 'line',
            data: {
                labels: points.map((_, index) => index.toString()),
                datasets: [
                    {
                        data: points,
                        borderColor: color,
                        backgroundColor: fillColor,
                        borderWidth: 2,
                        cubicInterpolationMode: 'monotone',
                        fill: true,
                        pointRadius: 0,
                        pointHoverRadius: 0,
                        tension: 0.38,
                    },
                ],
            },
            options: {
                animation: false,
                events: [],
                maintainAspectRatio: false,
                normalized: true,
                responsive: true,
                plugins: {
                    legend: { display: false },
                    tooltip: { enabled: false },
                },
                scales: {
                    x: { display: false },
                    y: {
                        display: false,
                        grace: '18%',
                    },
                },
            },
        };

        chartRef.current?.destroy();
        chartRef.current = new ChartJS(canvas, config);

        return () => {
            chartRef.current?.destroy();
            chartRef.current = null;
        };
    }, [points, trend]);

    return <canvas ref={canvasRef} aria-hidden="true" />;
}
