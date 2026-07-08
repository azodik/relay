import { fieldClassName, fieldCompactClassName } from '@/lib/form-classes';
import { cn } from '@/lib/utils';
import type { ActivityController } from '../useActivityController';

type TemplatesSectionProps = {
    ctx: ActivityController;
};

export default function TemplatesSection({ ctx }: TemplatesSectionProps) {
    const { s, templates, templateStats, saveTemplate } = ctx;

    return (
        <div className="grid gap-4">
            <section className="relay-stat-strip cols-4">
                {templateStats.map((stat) => (
                    <div key={stat.label}>
                        <div className="font-mono text-[11px] tracking-widest text-muted-foreground uppercase">
                            {stat.label}
                        </div>
                        <div className="mt-3 text-xl font-semibold">
                            {stat.value}
                        </div>
                        <div className="mt-1 font-mono text-[12px] text-muted-foreground">
                            {stat.meta}
                        </div>
                    </div>
                ))}
            </section>

            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    saveTemplate();
                }}
                className="grid gap-3 rounded-xl border border-border bg-card p-3 sm:p-4"
            >
                <div className="relay-section-head">
                    <div className="min-w-0">
                        <h2 className="text-base font-semibold">
                            Create or update template
                        </h2>
                        <p className="mt-0.5 text-[12px] text-muted-foreground">
                            Versioned HTML/text templates for API and Laravel
                            mail sends.
                        </p>
                    </div>
                    <button
                        type="submit"
                        className="w-full rounded-lg bg-signal px-3 py-2 text-[12px] font-bold text-signal-foreground sm:ml-auto sm:w-auto"
                    >
                        Save template
                    </button>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <label className="grid gap-1.5 text-[12px]">
                        <span className="text-muted-foreground">Slug</span>
                        <input
                            placeholder="tx.receipt.v1"
                            required
                            className={fieldCompactClassName}
                            value={s.templateForm.slug}
                            onChange={(e) => {
                                s.templateForm.slug = e.target.value;
                            }}
                        />
                    </label>
                    <label className="grid gap-1.5 text-[12px]">
                        <span className="text-muted-foreground">Name</span>
                        <input
                            required
                            className={fieldCompactClassName}
                            value={s.templateForm.name}
                            onChange={(e) => {
                                s.templateForm.name = e.target.value;
                            }}
                        />
                    </label>
                    <label className="grid gap-1.5 text-[12px]">
                        <span className="text-muted-foreground">Variables</span>
                        <input
                            placeholder="name, invoice"
                            className={fieldCompactClassName}
                            value={s.templateForm.variables}
                            onChange={(e) => {
                                s.templateForm.variables = e.target.value;
                            }}
                        />
                    </label>
                </div>

                <label className="grid gap-1.5 text-[12px]">
                    <span className="text-muted-foreground">Subject</span>
                    <input
                        required
                        className={fieldCompactClassName}
                        value={s.templateForm.subject}
                        onChange={(e) => {
                            s.templateForm.subject = e.target.value;
                        }}
                    />
                </label>

                <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
                    <label className="grid gap-1.5 text-[12px]">
                        <span className="text-muted-foreground">HTML</span>
                        <textarea
                            className={cn(
                                fieldClassName,
                                'min-h-28 font-mono text-[12px]',
                            )}
                            value={s.templateForm.html}
                            onChange={(e) => {
                                s.templateForm.html = e.target.value;
                            }}
                        />
                    </label>
                    <label className="grid gap-1.5 text-[12px]">
                        <span className="text-muted-foreground">Text</span>
                        <textarea
                            className={cn(
                                fieldClassName,
                                'min-h-28 font-mono text-[12px]',
                            )}
                            value={s.templateForm.text}
                            onChange={(e) => {
                                s.templateForm.text = e.target.value;
                            }}
                        />
                    </label>
                </div>
            </form>

            {/* Mobile: stack as cards */}
            <div className="grid gap-2 lg:hidden">
                {templates.length === 0 ? (
                    <div className="rounded-xl border border-border px-4 py-10 text-center text-sm text-muted-foreground">
                        No templates yet.
                    </div>
                ) : (
                    templates.map((template) => (
                        <button
                            key={template.slug}
                            type="button"
                            onClick={() => {
                                s.templateForm.slug = template.slug;
                                s.templateForm.name = template.name;
                                s.templateForm.subject = template.subject;
                                s.templateForm.variables = Array.isArray(
                                    template.variables,
                                )
                                    ? template.variables.join(', ')
                                    : '';
                                s.templateForm.html = template.html || '';
                                s.templateForm.text = template.text || '';
                            }}
                            className="rounded-xl border border-border bg-card p-3 text-left hover:bg-muted"
                        >
                            <div className="flex items-start justify-between gap-2">
                                <div className="min-w-0">
                                    <div className="truncate font-semibold">
                                        {template.name}
                                    </div>
                                    <div className="truncate font-mono text-[11px] text-muted-foreground">
                                        {template.slug}
                                    </div>
                                </div>
                                <span className="shrink-0 text-[12px] text-muted-foreground">
                                    Edit
                                </span>
                            </div>
                            <div className="mt-2 truncate text-[13px] text-muted-foreground">
                                {template.subject}
                            </div>
                            <div className="mt-1 font-mono text-[11px] text-muted-foreground">
                                {template.updated_at}
                            </div>
                        </button>
                    ))
                )}
            </div>

            {/* Desktop: wide table */}
            <div className="hidden lg:block">
                <div className="relay-wide-table">
                    <div className="min-w-[890px]">
                        <div className="grid grid-cols-[260px_minmax(360px,1fr)_180px_90px] border-b border-border bg-muted px-3 py-2 font-mono text-[11px] tracking-widest text-muted-foreground uppercase">
                            <div>Template</div>
                            <div>Subject</div>
                            <div>Updated</div>
                            <div></div>
                        </div>
                        {templates.map((template) => (
                            <button
                                key={template.slug}
                                type="button"
                                onClick={() => {
                                    s.templateForm.slug = template.slug;
                                    s.templateForm.name = template.name;
                                    s.templateForm.subject = template.subject;
                                    s.templateForm.variables = Array.isArray(
                                        template.variables,
                                    )
                                        ? template.variables.join(', ')
                                        : '';
                                    s.templateForm.html = template.html || '';
                                    s.templateForm.text = template.text || '';
                                }}
                                className="grid h-12 w-full grid-cols-[260px_minmax(360px,1fr)_180px_90px] items-center border-b border-border px-3 text-left text-[13px] last:border-b-0 hover:bg-muted"
                            >
                                <div className="min-w-0">
                                    <div className="truncate font-semibold">
                                        {template.name}
                                    </div>
                                    <div className="truncate font-mono text-[11px] text-muted-foreground">
                                        {template.slug}
                                    </div>
                                </div>
                                <div className="truncate text-muted-foreground">
                                    {template.subject}
                                </div>
                                <div className="font-mono text-[12px] text-muted-foreground">
                                    {template.updated_at}
                                </div>
                                <div className="text-right text-muted-foreground">
                                    Edit
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
