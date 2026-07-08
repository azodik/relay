export const timeRangeOptions = ['1h', '24h', '7d', '14d', '30d'] as const;

export type TimeRangeOption = (typeof timeRangeOptions)[number];
