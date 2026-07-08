import { Link } from '@inertiajs/react';
import { Archive, ArrowUpRight, Pencil, Trash2 } from 'lucide-react';
import { fieldClassName } from '@/lib/form-classes';
import { cn } from '@/lib/utils';
import type { WorkspaceMemberRole } from '../types';
import type { ActivityController } from '../useActivityController';

type ProjectsSectionProps = {
    ctx: ActivityController;
};

const PROJECT_TABLE_COLS =
    'grid-cols-[minmax(280px,1fr)_120px_120px_120px_130px_220px]';

const MEMBER_TABLE_COLS =
    'grid-cols-[minmax(220px,1fr)_minmax(220px,1fr)_220px_52px]';

export default function ProjectsSection({ ctx }: ProjectsSectionProps) {
    const {
        s,
        workspace,
        workspaceMembers,
        projects,
        archivedProjects,
        startProjectEdit,
        cancelProjectEdit,
        updateProject,
        archiveProject,
        restoreProject,
        deleteProject,
        projectEditForm,
        workspaceMemberForm,
        addWorkspaceMember,
        handleWorkspaceMemberRoleChange,
        removeWorkspaceMember,
        roleLabel,
        workspaceRoleOptions,
    } = ctx;

    return (
        <div className="grid gap-4">
            <div className="relay-section-head max-w-6xl">
                <div className="min-w-0">
                    <h2 className="text-lg font-semibold">Workspace</h2>
                    <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
                        Manage project boundaries and workspace access. Projects
                        isolate domains, sources, API keys, templates, webhooks,
                        and activity.
                    </p>
                </div>
                <button
                    type="button"
                    onClick={() => {
                        s.showProjectForm = true;
                    }}
                    className="w-full rounded-lg bg-signal px-3 py-2 text-sm font-bold text-signal-foreground sm:ml-auto sm:w-auto"
                >
                    + New project
                </button>
            </div>

            <div className="grid max-w-6xl gap-3">
                {/* Mobile: project cards */}
                <div className="grid gap-2 lg:hidden">
                    {projects.length === 0 ? (
                        <div className="rounded-xl border border-border px-4 py-10 text-center text-sm text-muted-foreground">
                            No projects yet.
                        </div>
                    ) : (
                        projects.map((item) => (
                            <div
                                key={item.slug}
                                className={cn(
                                    'rounded-xl border border-border bg-card p-3',
                                    item.is_current &&
                                        'bg-signal/5 dark:bg-signal/10',
                                )}
                            >
                                {s.editingProjectSlug === item.slug ? (
                                    <form
                                        onSubmit={(e) => {
                                            e.preventDefault();
                                            updateProject(item);
                                        }}
                                        className="grid grid-cols-1 gap-2"
                                    >
                                        <div>
                                            <input
                                                required
                                                className={cn(
                                                    fieldClassName,
                                                    'w-full text-sm',
                                                )}
                                                value={projectEditForm.data.name}
                                                onChange={(e) => {
                                                    projectEditForm.setData(
                                                        'name',
                                                        e.target.value,
                                                    );
                                                }}
                                            />
                                            {projectEditForm.errors.name ? (
                                                <p className="mt-1 text-xs text-red-500">
                                                    {projectEditForm.errors.name}
                                                </p>
                                            ) : null}
                                        </div>
                                        <div>
                                            <input
                                                required
                                                className={cn(
                                                    fieldClassName,
                                                    'w-full font-mono text-sm',
                                                )}
                                                value={projectEditForm.data.slug}
                                                onChange={(e) => {
                                                    projectEditForm.setData(
                                                        'slug',
                                                        e.target.value,
                                                    );
                                                }}
                                            />
                                            {projectEditForm.errors.slug ? (
                                                <p className="mt-1 text-xs text-red-500">
                                                    {projectEditForm.errors.slug}
                                                </p>
                                            ) : null}
                                        </div>
                                        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                                            <button
                                                type="button"
                                                onClick={cancelProjectEdit}
                                                className="h-9 rounded-lg border border-border px-3 text-sm font-semibold text-muted-foreground hover:text-foreground dark:border-border dark:text-muted-foreground dark:hover:text-foreground"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={
                                                    projectEditForm.processing
                                                }
                                                className="h-9 rounded-lg bg-signal px-3 text-sm font-bold text-foreground disabled:cursor-wait disabled:opacity-60"
                                            >
                                                Save
                                            </button>
                                        </div>
                                    </form>
                                ) : (
                                    <>
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="min-w-0">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <Link
                                                        href={item.href}
                                                        className="truncate font-semibold text-foreground hover:text-signal dark:text-foreground dark:hover:text-signal"
                                                    >
                                                        {item.name}
                                                    </Link>
                                                    {item.is_current ? (
                                                        <span className="rounded bg-signal/12 px-1.5 py-0.5 font-mono text-[10px] text-signal dark:text-signal">
                                                            current
                                                        </span>
                                                    ) : null}
                                                </div>
                                                <div className="mt-0.5 font-mono text-[11px] text-muted-foreground">
                                                    {item.slug}
                                                </div>
                                            </div>
                                            <Link
                                                href={item.href}
                                                title="Open project"
                                                className="inline-flex size-8 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground dark:hover:bg-muted dark:hover:text-foreground"
                                            >
                                                <ArrowUpRight className="size-4" />
                                            </Link>
                                        </div>

                                        <div className="mt-3 flex flex-wrap gap-3 font-mono text-[12px] text-muted-foreground">
                                            <span>{item.environment}</span>
                                            <span>{item.region}</span>
                                            <span>
                                                {item.emails_count.toLocaleString()}{' '}
                                                sends
                                            </span>
                                            <span>
                                                {item.domains_count.toLocaleString()}{' '}
                                                domains
                                            </span>
                                        </div>

                                        {workspace.can_manage_members ? (
                                            <div className="mt-3 flex flex-wrap gap-1">
                                                <button
                                                    type="button"
                                                    title="Rename project"
                                                    onClick={() => {
                                                        startProjectEdit(item);
                                                    }}
                                                    className="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground dark:hover:bg-muted dark:hover:text-foreground"
                                                >
                                                    <Pencil className="size-4" />
                                                </button>
                                                <button
                                                    type="button"
                                                    title="Archive project"
                                                    disabled={
                                                        s.archivingProjectSlug ===
                                                        item.slug
                                                    }
                                                    onClick={() => {
                                                        archiveProject(item);
                                                    }}
                                                    className="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-amber-50 hover:text-amber-600 disabled:cursor-wait disabled:opacity-60 dark:hover:bg-amber-500/10 dark:hover:text-amber-300"
                                                >
                                                    <Archive
                                                        className={cn(
                                                            'size-4',
                                                            {
                                                                'animate-pulse':
                                                                    s.archivingProjectSlug ===
                                                                    item.slug,
                                                            },
                                                        )}
                                                    />
                                                </button>
                                                <button
                                                    type="button"
                                                    title={
                                                        item.can_delete
                                                            ? 'Delete empty project'
                                                            : item.delete_block_reason ||
                                                              'Archive instead'
                                                    }
                                                    disabled={
                                                        s.deletingProjectSlug ===
                                                        item.slug
                                                    }
                                                    onClick={() => {
                                                        deleteProject(item);
                                                    }}
                                                    className="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-red-50 hover:text-red-600 disabled:cursor-wait disabled:opacity-60 dark:hover:bg-red-500/10 dark:hover:text-red-300"
                                                >
                                                    <Trash2
                                                        className={cn(
                                                            'size-4',
                                                            {
                                                                'animate-pulse':
                                                                    s.deletingProjectSlug ===
                                                                    item.slug,
                                                            },
                                                        )}
                                                    />
                                                </button>
                                            </div>
                                        ) : null}
                                    </>
                                )}
                            </div>
                        ))
                    )}
                </div>

                {/* Desktop: projects table */}
                <div className="hidden lg:block">
                    <div className="relay-wide-table">
                        <div className="min-w-[990px]">
                            <div
                                className={cn(
                                    'grid border-b border-border bg-muted px-3 py-2 font-mono text-[11px] tracking-widest text-muted-foreground uppercase dark:border-border dark:bg-card',
                                    PROJECT_TABLE_COLS,
                                )}
                            >
                                <div>Project</div>
                                <div>Environment</div>
                                <div>Region</div>
                                <div className="text-right">Sends</div>
                                <div className="text-right">Domains</div>
                                <div className="text-right">Actions</div>
                            </div>
                            {projects.map((item) => (
                                <div
                                    key={item.slug}
                                    className={cn(
                                        'grid min-h-14 items-center gap-2 border-b border-border px-3 py-2 text-sm last:border-b-0 dark:border-border',
                                        PROJECT_TABLE_COLS,
                                        {
                                            'bg-signal/5 dark:bg-signal/10':
                                                item.is_current,
                                        },
                                    )}
                                >
                                    {s.editingProjectSlug === item.slug ? (
                                        <form
                                            onSubmit={(e) => {
                                                e.preventDefault();
                                                updateProject(item);
                                            }}
                                            className="col-span-6 grid grid-cols-1 items-start gap-2 sm:grid-cols-[minmax(0,1fr)_minmax(0,260px)_auto]"
                                        >
                                            <div>
                                                <input
                                                    required
                                                    className={cn(
                                                        fieldClassName,
                                                        'w-full text-sm',
                                                    )}
                                                    value={
                                                        projectEditForm.data.name
                                                    }
                                                    onChange={(e) => {
                                                        projectEditForm.setData(
                                                            'name',
                                                            e.target.value,
                                                        );
                                                    }}
                                                />
                                                {projectEditForm.errors.name ? (
                                                    <p className="mt-1 text-xs text-red-500">
                                                        {
                                                            projectEditForm
                                                                .errors.name
                                                        }
                                                    </p>
                                                ) : null}
                                            </div>
                                            <div>
                                                <input
                                                    required
                                                    className={cn(
                                                        fieldClassName,
                                                        'w-full font-mono text-sm',
                                                    )}
                                                    value={
                                                        projectEditForm.data.slug
                                                    }
                                                    onChange={(e) => {
                                                        projectEditForm.setData(
                                                            'slug',
                                                            e.target.value,
                                                        );
                                                    }}
                                                />
                                                {projectEditForm.errors.slug ? (
                                                    <p className="mt-1 text-xs text-red-500">
                                                        {
                                                            projectEditForm
                                                                .errors.slug
                                                        }
                                                    </p>
                                                ) : null}
                                            </div>
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    type="button"
                                                    onClick={cancelProjectEdit}
                                                    className="h-9 rounded-lg border border-border px-3 text-sm font-semibold text-muted-foreground hover:text-foreground dark:border-border dark:text-muted-foreground dark:hover:text-foreground"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    type="submit"
                                                    disabled={
                                                        projectEditForm.processing
                                                    }
                                                    className="h-9 rounded-lg bg-signal px-3 text-sm font-bold text-foreground disabled:cursor-wait disabled:opacity-60"
                                                >
                                                    Save
                                                </button>
                                            </div>
                                        </form>
                                    ) : (
                                        <>
                                            <div className="min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <Link
                                                        href={item.href}
                                                        className="truncate font-semibold text-foreground hover:text-signal dark:text-foreground dark:hover:text-signal"
                                                    >
                                                        {item.name}
                                                    </Link>
                                                    {item.is_current ? (
                                                        <span className="rounded bg-signal/12 px-1.5 py-0.5 font-mono text-[10px] text-signal dark:text-signal">
                                                            current
                                                        </span>
                                                    ) : null}
                                                </div>
                                                <div className="mt-0.5 font-mono text-[11px] text-muted-foreground">
                                                    {item.slug}
                                                </div>
                                            </div>
                                            <div className="font-mono text-muted-foreground">
                                                {item.environment}
                                            </div>
                                            <div className="font-mono text-muted-foreground">
                                                {item.region}
                                            </div>
                                            <div className="text-right font-mono">
                                                {item.emails_count.toLocaleString()}
                                            </div>
                                            <div className="text-right font-mono">
                                                {item.domains_count.toLocaleString()}
                                            </div>
                                            <div className="flex items-center justify-end gap-1">
                                                <Link
                                                    href={item.href}
                                                    title="Open project"
                                                    className="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground dark:hover:bg-muted dark:hover:text-foreground"
                                                >
                                                    <ArrowUpRight className="size-4" />
                                                </Link>
                                                {workspace.can_manage_members ? (
                                                    <button
                                                        type="button"
                                                        title="Rename project"
                                                        onClick={() => {
                                                            startProjectEdit(
                                                                item,
                                                            );
                                                        }}
                                                        className="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground dark:hover:bg-muted dark:hover:text-foreground"
                                                    >
                                                        <Pencil className="size-4" />
                                                    </button>
                                                ) : null}
                                                {workspace.can_manage_members ? (
                                                    <button
                                                        type="button"
                                                        title="Archive project"
                                                        disabled={
                                                            s.archivingProjectSlug ===
                                                            item.slug
                                                        }
                                                        onClick={() => {
                                                            archiveProject(item);
                                                        }}
                                                        className="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-amber-50 hover:text-amber-600 disabled:cursor-wait disabled:opacity-60 dark:hover:bg-amber-500/10 dark:hover:text-amber-300"
                                                    >
                                                        <Archive
                                                            className={cn(
                                                                'size-4',
                                                                {
                                                                    'animate-pulse':
                                                                        s.archivingProjectSlug ===
                                                                        item.slug,
                                                                },
                                                            )}
                                                        />
                                                    </button>
                                                ) : null}
                                                {workspace.can_manage_members ? (
                                                    <button
                                                        type="button"
                                                        title={
                                                            item.can_delete
                                                                ? 'Delete empty project'
                                                                : item.delete_block_reason ||
                                                                  'Archive instead'
                                                        }
                                                        disabled={
                                                            s.deletingProjectSlug ===
                                                            item.slug
                                                        }
                                                        onClick={() => {
                                                            deleteProject(item);
                                                        }}
                                                        className="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-red-50 hover:text-red-600 disabled:cursor-wait disabled:opacity-60 dark:hover:bg-red-500/10 dark:hover:text-red-300"
                                                    >
                                                        <Trash2
                                                            className={cn(
                                                                'size-4',
                                                                {
                                                                    'animate-pulse':
                                                                        s.deletingProjectSlug ===
                                                                        item.slug,
                                                                },
                                                            )}
                                                        />
                                                    </button>
                                                ) : null}
                                            </div>
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-950 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-100">
                    Archive keeps email history, domains, API keys, and webhooks
                    for audit. Delete is only for empty projects.
                </div>

                <div className="rounded-lg border border-border bg-card dark:border-border dark:bg-card">
                    <button
                        type="button"
                        onClick={() => {
                            s.showingArchivedProjects =
                                !s.showingArchivedProjects;
                        }}
                        className="flex w-full items-center justify-between px-3 py-2.5 text-left text-sm font-semibold"
                    >
                        <span>
                            Archived projects{' '}
                            <span className="ml-1 font-mono text-xs text-muted-foreground">
                                {archivedProjects.length}
                            </span>
                        </span>
                        <span className="font-mono text-xs text-muted-foreground">
                            {s.showingArchivedProjects ? 'hide' : 'show'}
                        </span>
                    </button>

                    {s.showingArchivedProjects ? (
                        <div className="border-t border-border dark:border-border">
                            {archivedProjects.length === 0 ? (
                                <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                                    No archived projects.
                                </div>
                            ) : (
                                <>
                                    {/* Mobile archived cards */}
                                    <div className="grid gap-0 lg:hidden">
                                        {archivedProjects.map((item) => (
                                            <div
                                                key={item.slug}
                                                className="border-b border-border p-3 last:border-b-0 dark:border-border"
                                            >
                                                <div className="min-w-0">
                                                    <div className="truncate font-semibold">
                                                        {item.name}
                                                    </div>
                                                    <div className="mt-0.5 font-mono text-[11px] text-muted-foreground">
                                                        {item.slug} · archived{' '}
                                                        {item.archived_at ||
                                                            'recently'}
                                                    </div>
                                                </div>
                                                <div className="mt-2 flex flex-wrap gap-3 font-mono text-[12px] text-muted-foreground">
                                                    <span>
                                                        {item.environment}
                                                    </span>
                                                    <span>{item.region}</span>
                                                    <span>
                                                        {item.emails_count.toLocaleString()}{' '}
                                                        sends
                                                    </span>
                                                </div>
                                                {workspace.can_manage_members ? (
                                                    <div className="mt-3">
                                                        <button
                                                            type="button"
                                                            disabled={
                                                                s.restoringProjectSlug ===
                                                                item.slug
                                                            }
                                                            onClick={() => {
                                                                restoreProject(
                                                                    item,
                                                                );
                                                            }}
                                                            className="w-full rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground disabled:cursor-wait disabled:opacity-60 sm:w-auto dark:border-border dark:text-muted-foreground dark:hover:text-foreground"
                                                        >
                                                            {s.restoringProjectSlug ===
                                                            item.slug
                                                                ? 'Restoring...'
                                                                : 'Restore'}
                                                        </button>
                                                    </div>
                                                ) : null}
                                            </div>
                                        ))}
                                    </div>

                                    {/* Desktop archived list with horizontal scroll */}
                                    <div className="hidden lg:block">
                                        <div className="overflow-x-auto">
                                            <div className="min-w-[770px]">
                                                {archivedProjects.map(
                                                    (item) => (
                                                        <div
                                                            key={item.slug}
                                                            className="grid min-h-12 grid-cols-[minmax(280px,1fr)_120px_120px_120px_130px] items-center gap-2 border-b border-border px-3 py-2 text-sm last:border-b-0 dark:border-border"
                                                        >
                                                            <div className="min-w-0">
                                                                <div className="truncate font-semibold">
                                                                    {item.name}
                                                                </div>
                                                                <div className="mt-0.5 font-mono text-[11px] text-muted-foreground">
                                                                    {item.slug}{' '}
                                                                    · archived{' '}
                                                                    {item.archived_at ||
                                                                        'recently'}
                                                                </div>
                                                            </div>
                                                            <div className="font-mono text-muted-foreground">
                                                                {
                                                                    item.environment
                                                                }
                                                            </div>
                                                            <div className="font-mono text-muted-foreground">
                                                                {item.region}
                                                            </div>
                                                            <div className="text-right font-mono">
                                                                {item.emails_count.toLocaleString()}
                                                            </div>
                                                            <div className="text-right">
                                                                {workspace.can_manage_members ? (
                                                                    <button
                                                                        type="button"
                                                                        disabled={
                                                                            s.restoringProjectSlug ===
                                                                            item.slug
                                                                        }
                                                                        onClick={() => {
                                                                            restoreProject(
                                                                                item,
                                                                            );
                                                                        }}
                                                                        className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground disabled:cursor-wait disabled:opacity-60 dark:border-border dark:text-muted-foreground dark:hover:text-foreground"
                                                                    >
                                                                        {s.restoringProjectSlug ===
                                                                        item.slug
                                                                            ? 'Restoring...'
                                                                            : 'Restore'}
                                                                    </button>
                                                                ) : null}
                                                            </div>
                                                        </div>
                                                    ),
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    ) : null}
                </div>
            </div>

            <div className="grid max-w-6xl gap-3 pt-2">
                <div>
                    <h2 className="text-lg font-semibold">
                        Workspace members
                    </h2>
                    <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
                        Members can access every project in {workspace.name}.
                    </p>
                </div>

                {workspace.can_manage_members ? (
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            addWorkspaceMember();
                        }}
                        className="grid grid-cols-1 gap-2 rounded-lg border border-border bg-card p-3 sm:grid-cols-[minmax(0,1fr)_180px_auto] dark:border-border dark:bg-card"
                    >
                        <div className="min-w-0">
                            <input
                                type="email"
                                required
                                placeholder="teammate@example.com"
                                className={cn(
                                    fieldClassName,
                                    'w-full min-w-0 text-sm',
                                    {
                                        'border-red-400 dark:border-red-500':
                                            workspaceMemberForm.errors.email,
                                    },
                                )}
                                value={workspaceMemberForm.data.email}
                                onChange={(e) => {
                                    workspaceMemberForm.setData(
                                        'email',
                                        e.target.value,
                                    );
                                }}
                            />
                            {workspaceMemberForm.errors.email ? (
                                <p className="mt-1 text-xs text-red-500">
                                    {workspaceMemberForm.errors.email}
                                </p>
                            ) : null}
                        </div>
                        <div>
                            <select
                                className={cn(fieldClassName, 'w-full text-sm', {
                                    'border-red-400 dark:border-red-500':
                                        workspaceMemberForm.errors.role,
                                })}
                                value={workspaceMemberForm.data.role}
                                onChange={(e) => {
                                    workspaceMemberForm.setData(
                                        'role',
                                        e.target.value as WorkspaceMemberRole,
                                    );
                                }}
                            >
                                {workspaceRoleOptions.map((role) => (
                                    <option
                                        key={role.value}
                                        value={role.value}
                                    >
                                        {role.label}
                                    </option>
                                ))}
                            </select>
                            {workspaceMemberForm.errors.role ? (
                                <p className="mt-1 text-xs text-red-500">
                                    {workspaceMemberForm.errors.role}
                                </p>
                            ) : null}
                        </div>
                        <button
                            type="submit"
                            disabled={workspaceMemberForm.processing}
                            className="h-9 w-full rounded-lg bg-signal px-4 text-sm font-bold text-foreground disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                        >
                            {workspaceMemberForm.processing
                                ? 'Adding...'
                                : 'Add member'}
                        </button>
                    </form>
                ) : null}

                {/* Mobile: member cards */}
                <div className="grid gap-2 lg:hidden">
                    {workspaceMembers.map((member) => (
                        <div
                            key={member.id}
                            className="rounded-xl border border-border bg-card p-3"
                        >
                            <div className="flex items-start justify-between gap-2">
                                <div className="min-w-0">
                                    <div className="truncate font-semibold text-foreground dark:text-foreground">
                                        {member.name}
                                    </div>
                                    {member.is_owner ? (
                                        <div className="mt-0.5 font-mono text-[11px] text-muted-foreground">
                                            workspace owner
                                        </div>
                                    ) : null}
                                    <div className="mt-1 truncate font-mono text-[12px] text-muted-foreground">
                                        {member.email}
                                    </div>
                                </div>
                                {workspace.can_manage_members &&
                                !member.is_owner ? (
                                    <button
                                        type="button"
                                        title="Remove member"
                                        onClick={() => {
                                            removeWorkspaceMember(member.id);
                                        }}
                                        className="inline-flex size-8 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10 dark:hover:text-red-300"
                                    >
                                        <Trash2 className="size-4" />
                                    </button>
                                ) : null}
                            </div>
                            <div className="mt-3">
                                {workspace.can_manage_members &&
                                !member.is_owner ? (
                                    <select
                                        value={member.role}
                                        onChange={(e) => {
                                            handleWorkspaceMemberRoleChange(
                                                member.id,
                                                e,
                                            );
                                        }}
                                        className="w-full rounded-md border border-border bg-card px-2 py-1.5 text-sm dark:border-border dark:bg-card"
                                    >
                                        {workspaceRoleOptions.map((role) => (
                                            <option
                                                key={`${member.id}-${role.value}`}
                                                value={role.value}
                                            >
                                                {role.label}
                                            </option>
                                        ))}
                                    </select>
                                ) : (
                                    <span className="inline-flex rounded bg-muted px-2 py-1 font-mono text-[11px] text-muted-foreground capitalize dark:bg-muted dark:text-muted-foreground">
                                        {roleLabel(member.role)}
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Desktop: members table */}
                <div className="hidden lg:block">
                    <div className="relay-wide-table">
                        <div className="min-w-[720px]">
                            <div
                                className={cn(
                                    'grid border-b border-border bg-muted px-3 py-2 font-mono text-[11px] tracking-widest text-muted-foreground uppercase dark:border-border dark:bg-card',
                                    MEMBER_TABLE_COLS,
                                )}
                            >
                                <div>Name</div>
                                <div>Email</div>
                                <div>Role</div>
                                <div></div>
                            </div>
                            {workspaceMembers.map((member) => (
                                <div
                                    key={member.id}
                                    className={cn(
                                        'grid min-h-12 items-center border-b border-border px-3 text-sm last:border-b-0 dark:border-border',
                                        MEMBER_TABLE_COLS,
                                    )}
                                >
                                    <div className="min-w-0">
                                        <div className="truncate font-semibold text-foreground dark:text-foreground">
                                            {member.name}
                                        </div>
                                        {member.is_owner ? (
                                            <div className="mt-0.5 font-mono text-[11px] text-muted-foreground">
                                                workspace owner
                                            </div>
                                        ) : null}
                                    </div>
                                    <div className="truncate font-mono text-[12px] text-muted-foreground">
                                        {member.email}
                                    </div>
                                    <div>
                                        {workspace.can_manage_members &&
                                        !member.is_owner ? (
                                            <select
                                                value={member.role}
                                                onChange={(e) => {
                                                    handleWorkspaceMemberRoleChange(
                                                        member.id,
                                                        e,
                                                    );
                                                }}
                                                className="w-full rounded-md border border-border bg-card px-2 py-1.5 text-sm dark:border-border dark:bg-card"
                                            >
                                                {workspaceRoleOptions.map(
                                                    (role) => (
                                                        <option
                                                            key={`${member.id}-${role.value}`}
                                                            value={role.value}
                                                        >
                                                            {role.label}
                                                        </option>
                                                    ),
                                                )}
                                            </select>
                                        ) : (
                                            <span className="inline-flex rounded bg-muted px-2 py-1 font-mono text-[11px] text-muted-foreground capitalize dark:bg-muted dark:text-muted-foreground">
                                                {roleLabel(member.role)}
                                            </span>
                                        )}
                                    </div>
                                    <div className="text-right">
                                        {workspace.can_manage_members &&
                                        !member.is_owner ? (
                                            <button
                                                type="button"
                                                title="Remove member"
                                                onClick={() => {
                                                    removeWorkspaceMember(
                                                        member.id,
                                                    );
                                                }}
                                                className="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10 dark:hover:text-red-300"
                                            >
                                                <Trash2 className="size-4" />
                                            </button>
                                        ) : null}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
