import type { CSSProperties } from 'react';
import {
    ArrowUpRight,
    Copy,
    SlidersHorizontal,
    X,
} from 'lucide-react';
import EmptyState from '@/components/EmptyState';
import { cn } from '@/lib/utils';
import type { ActivityController } from '../useActivityController';

type ActivityFeedSectionProps = {
    ctx: ActivityController;
};

export default function ActivityFeedSection({ ctx }: ActivityFeedSectionProps) {
    const {
        s,
        statusClass,
        dotClass,
        eventToneClass,
        formatHeaders,
        recipientTitle,
        selectEmail,
        closeInspector,
        resendEmail,
        startInspectorResize,
        groupedEmails,
        statusFilters,
        statusFilterCounts,
        copyText,
        applySearch,
    } = ctx;

    return (
        <>
            <div
                className={cn('relay-feed-layout', Boolean(s.selected) && 'has-inspector')}
                style={
                    s.selected
                        ? ({
                              ['--inspector-width' as string]: `${s.inspectorWidth}px`,
                          } as CSSProperties)
                        : undefined
                }
            ><section className="flex min-h-0 min-w-0 flex-col overflow-hidden border-r border-border dark:border-border"><div className="flex shrink-0 items-center gap-1.5 overflow-x-auto border-b border-border px-2.5 py-2 sm:gap-2 sm:px-3.5 sm:py-2.5 dark:border-border" style={{ WebkitOverflowScrolling: 'touch' }}>{statusFilters.map((filter) => (<button key={filter} type="button" onClick={() => { s.selectedFilter = filter; }} className={cn("inline-flex h-6 shrink-0 items-center gap-1 rounded-full border border-border bg-card px-2 font-sans text-[11px] text-muted-foreground hover:text-foreground sm:h-[26px] sm:gap-1.5 sm:px-2.5 sm:text-[11.5px] dark:border-border dark:bg-card dark:text-muted-foreground dark:hover:text-foreground", {
                                    'border-border bg-muted text-foreground dark:border-border dark:bg-muted dark:text-foreground':
                                        s.selectedFilter === filter,
                                })}>{filter} <span className="border-l border-border pl-1.5 font-mono text-[10px] text-muted-foreground sm:text-[10.5px] dark:border-border dark:text-muted-foreground">{statusFilterCounts[filter] ?? 0}</span></button>))}<button type="button" onClick={() => { 
                                    s.selectedFilter = 'All';
                                    s.searchQuery = '';
                                    applySearch();
                                }} className="ml-auto inline-flex h-6 shrink-0 items-center gap-1 rounded-full border border-border bg-card px-2 font-sans text-[11px] text-muted-foreground hover:text-foreground sm:h-[26px] sm:gap-1.5 sm:px-2.5 sm:text-[11.5px] dark:border-border dark:bg-card dark:text-muted-foreground dark:hover:text-foreground"><SlidersHorizontal className="size-3.5" /> <span className="hidden sm:inline">Clear</span></button></div><div className="relay-col-head"><div></div><div>Subject · Recipient</div><div>Engagement</div><div>Status</div><div className="text-right">Time</div></div><div className="relay-table-scroll bg-background">{groupedEmails.length === 0 ? (<EmptyState label="No messages" body="Nothing matched this filter and time range. Try clearing filters or widening the window." />) : groupedEmails.map((group) => (<><div className="border-t border-border px-3.5 pt-3.5 pb-1.5 font-mono text-[10.5px] tracking-widest text-muted-foreground uppercase first:border-t-0 dark:border-border dark:text-muted-foreground">{group.label} · {group.rows.length}</div>{group.rows.map((email) => (<button key={email.id} onClick={(e) => { selectEmail(email); }} className={cn("relay-row", {
                                        'bg-muted before:absolute before:top-0 before:bottom-0 before:left-0 before:w-0.5 before:bg-signal dark:bg-muted':
                                            s.selected?.id === email.id,
                                    })}><span className={cn("size-2 rounded-full", dotClass(email.status))} /><span className="min-w-0 font-sans leading-tight"><span className="flex min-w-0 items-baseline gap-2 truncate text-[12.5px] font-medium text-foreground dark:text-foreground"><span className="min-w-0 truncate text-foreground dark:text-foreground">{email.subject}</span></span><span title={recipientTitle(email)} className="mt-0.5 block truncate font-mono text-[11px] text-muted-foreground dark:text-muted-foreground">{email.recipient}</span></span><span className="relay-row-engagement"><span className={cn({
                                                'text-foreground dark:text-foreground':
                                                    email.opens,
                                            })}>◎ {email.opens}</span><span className={cn({
                                                'text-foreground dark:text-foreground':
                                                    email.clicks,
                                            })}>↗ {email.clicks}</span></span><span><span className={cn("inline-flex items-center gap-1.5 rounded px-1.5 py-0.5 font-mono text-[10.5px]", statusClass(email.status))}><span className="size-1.5 rounded-full bg-current" />{email.status}</span></span><span className="relay-row-time">{email.time}</span></button>))}</>))}</div></section>
                      {s.selected ? (<aside className="relay-inspector"><button type="button" title="Resize details panel" onPointerDown={startInspectorResize} className={cn("absolute top-0 bottom-0 left-0 z-10 hidden w-2 cursor-col-resize border-l border-transparent hover:border-signal focus-visible:border-signal focus-visible:outline-none lg:block", {
                                'border-signal bg-signal/10':
                                    s.isResizingInspector,
                            })} /><div className="border-b border-border px-3.5 py-3 dark:border-border"><div className="flex items-center gap-2 text-[12px]"><div className="flex min-w-0 flex-1 items-center gap-2"><span className={cn("inline-flex shrink-0 items-center gap-1.5 rounded px-2 py-0.5 font-mono", 
                                            statusClass(
                                                s.selected.status || 'sent',
                                            )
                                        )}><span className="size-1.5 rounded-full bg-current" />{s.selected.status}</span><span className="min-w-0 truncate font-mono text-muted-foreground">{s.selected.id}</span></div><div className="ml-auto flex shrink-0 items-center gap-1"><button title="Copy message ID" onClick={(e) => { copyText(s.selected?.id || ''); }} className="inline-flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground dark:hover:bg-muted dark:hover:text-foreground"><Copy className="size-4" /></button>
                                {s.selected.previewUrl ? (<a href={s.selected.previewUrl} target="_blank" rel="noopener noreferrer" title="Open full email" className="inline-flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground dark:hover:bg-muted dark:hover:text-foreground"><ArrowUpRight className="size-4" /></a>) : null}
                                <button onClick={resendEmail} className="inline-flex h-7 items-center rounded-md px-2 text-[12px] font-semibold text-muted-foreground hover:bg-muted hover:text-foreground dark:hover:bg-muted dark:hover:text-foreground"> Resend </button><button title="Close details" onClick={closeInspector} className="inline-flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground dark:hover:bg-muted dark:hover:text-foreground"><X className="size-4" /></button></div></div><h2 className="mt-3 text-[15px] leading-6 font-semibold">{s.selected?.subject}</h2><dl className="mt-3 grid grid-cols-[64px_1fr] gap-x-4 gap-y-2 text-[12px]"><dt className="font-mono tracking-widest text-muted-foreground uppercase"> From </dt><dd className="truncate">{s.selected.from || 'Stored sender'}</dd><dt className="font-mono tracking-widest text-muted-foreground uppercase"> To </dt><dd className="truncate">{s.selected.to || s.selected.recipientEmail}</dd>
                              {s.selected.cc ? (<><dt className="font-mono tracking-widest text-muted-foreground uppercase"> Cc </dt><dd className="truncate">{s.selected.cc}</dd></>) : null}
                              
                              {s.selected.bcc ? (<><dt className="font-mono tracking-widest text-muted-foreground uppercase"> Bcc </dt><dd className="truncate">{s.selected.bcc}</dd></>) : null}
                              <dt className="font-mono tracking-widest text-muted-foreground uppercase"> Sent </dt><dd>{s.selected.time} ago</dd>
                              {s.selected.template ? (<dt className="font-mono tracking-widest text-muted-foreground uppercase"> Template </dt>) : null}
                              
                              {s.selected.template ? (<dd className="truncate">{s.selected.template}</dd>) : null}
                              </dl></div><div className="flex gap-5 border-b border-border px-3.5 dark:border-border">{(['timeline', 'preview', 'headers', 'metrics'] as const).map((tab) => (
                                <button key={tab} onClick={() => { s.activeTab = tab; }} className={cn("py-2.5 text-[12px] font-semibold text-muted-foreground capitalize", {
                                    'border-b-2 border-signal text-foreground dark:text-foreground':
                                        s.activeTab === tab,
                                })}>{tab}
                              {tab === 'timeline' ? (<span className="ml-1 rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground dark:bg-muted">{s.selected?.events?.length || 0}</span>) : null}
                              </button>))}</div><div className="min-h-0 flex-1 overflow-auto p-3.5">
                            {s.activeTab === 'preview' ? (<div className="overflow-hidden rounded-lg border border-border bg-muted dark:border-border dark:bg-card"><div className="flex items-center border-b border-border px-3 py-2 text-[11px] text-muted-foreground dark:border-border"><span className="mr-1 size-2.5 rounded-full bg-muted-foreground/40" /><span className="mr-1 size-2.5 rounded-full bg-muted-foreground/40" /><span className="size-2.5 rounded-full bg-muted-foreground/40" /><span className="ml-auto">HTML · {(
                                                (s.selected.mimeSize || 0) / 1000
                                            ).toFixed(1)} KB</span></div><iframe title="Email preview" sandbox="" srcDoc={
                                        s.selected.html || s.selected.text || ''
                                    } className="h-[520px] w-full bg-card" /></div>) : (s.activeTab === 'timeline' ? (<div className="divide-y divide-border overflow-hidden rounded-lg border border-border dark:divide-border dark:border-border">{s.selected?.events?.map((event) => (<div key={`${event.type}-${event.occurredAt}`} className="grid grid-cols-[18px_74px_minmax(0,1fr)] gap-3 px-3 py-3 text-[12px]"><span className={cn("mt-1.5 size-2 rounded-full", eventToneClass(event.type))} /><span className="font-mono text-[11px] text-muted-foreground">{event.occurredAt}</span><div className="min-w-0"><div className="font-semibold text-foreground capitalize dark:text-foreground">{event.type}</div><div className="mt-0.5 truncate font-mono text-[11px] text-muted-foreground">{event.recipient}</div></div></div>))}</div>) : (s.activeTab === 'headers' ? (<pre className="max-h-[520px] overflow-auto rounded-lg border border-border bg-card p-3 font-mono text-[11px] leading-5 text-muted-foreground dark:border-border dark:bg-background dark:text-muted-foreground">{formatHeaders(s.selected)}</pre>) : ((<div className="grid grid-cols-2 overflow-hidden rounded-lg border border-border dark:border-border"><div className="border-r border-border p-3 dark:border-border"><span className="font-mono text-[11px] tracking-widest text-muted-foreground uppercase">Opens</span><strong className="mt-2 block text-xl">{s.selected.opens}</strong></div><div className="p-3"><span className="font-mono text-[11px] tracking-widest text-muted-foreground uppercase">Clicks</span><strong className="mt-2 block text-xl">{s.selected.clicks}</strong></div></div>))))}
                            </div></aside>) : null}
                      </div>
        </>
    );
}

