import { inputClassName, monoInputClassName } from '@/lib/form-classes';
import type { OnboardingForm } from './types';

type StepBasicsProps = {
    form: OnboardingForm;
};

export default function StepBasics({ form }: StepBasicsProps) {
    return (
        <div className="grid gap-4 md:grid-cols-3">
            <label className="grid gap-1.5">
                <span className="text-muted-foreground">Workspace</span>
                <input
                    value={form.data.workspace_name}
                    onChange={(event) =>
                        form.setData('workspace_name', event.target.value)
                    }
                    required
                    className={inputClassName}
                />
                {form.errors.workspace_name ? (
                    <span className="text-xs text-red-500">
                        {form.errors.workspace_name}
                    </span>
                ) : null}
            </label>
            <label className="grid gap-1.5">
                <span className="text-muted-foreground">Project</span>
                <input
                    value={form.data.project_name}
                    onChange={(event) =>
                        form.setData('project_name', event.target.value)
                    }
                    required
                    className={inputClassName}
                />
                {form.errors.project_name ? (
                    <span className="text-xs text-red-500">
                        {form.errors.project_name}
                    </span>
                ) : null}
            </label>
            <label className="grid gap-1.5">
                <span className="text-muted-foreground">Project slug</span>
                <input
                    value={form.data.project_slug}
                    onChange={(event) =>
                        form.setData('project_slug', event.target.value)
                    }
                    required
                    className={monoInputClassName}
                />
                {form.errors.project_slug ? (
                    <span className="text-xs text-red-500">
                        {form.errors.project_slug}
                    </span>
                ) : null}
            </label>
        </div>
    );
}
