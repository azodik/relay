import { statusClass, type PreviewRow } from './data';

type EmailRowButtonProps = {
    row: PreviewRow;
    selected: boolean;
    entering?: boolean;
    onSelect: (row: PreviewRow) => void;
};

export default function EmailRowButton({
    row,
    selected,
    entering,
    onSelect,
}: EmailRowButtonProps) {
    return (
        <button
            type="button"
            className={`email-row${selected ? ' selected' : ''}${entering ? ' is-entering' : ''}`}
            onClick={() => onSelect(row)}
        >
            <span className={`status-dot ${statusClass(row.status)}`}></span>
            <span className="recipient-cell">
                <b>{row.recipient}</b>
                <i>›</i>
                <strong>{row.subject}</strong>
                <small>
                    {row.email} · {row.id}
                </small>
            </span>
            <code>{row.template}</code>
            <span className="engagement">
                ◎ {row.opens} ↗ {row.clicks}
            </span>
            <span className={`status-pill ${statusClass(row.status)}`}>
                <i></i>
                {row.status}
            </span>
            <time>{row.time}</time>
        </button>
    );
}
