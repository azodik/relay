import { RefreshCw, Search, Send } from 'lucide-react';
import AppLogoIcon from '@/components/AppLogoIcon';
import { rangeOptions } from './data';

type ChromeProps = {
    isSearching: boolean;
    range: (typeof rangeOptions)[number];
    onToggleSearch: () => void;
    onReplay: () => void;
    onRangeChange: (range: (typeof rangeOptions)[number]) => void;
};

export default function Chrome({
    isSearching,
    range,
    onToggleSearch,
    onReplay,
    onRangeChange,
}: ChromeProps) {
    return (
        <header className="preview-topbar">
            <div className="preview-brand">
                <span>
                    <AppLogoIcon className="preview-brand-icon" />
                </span>
                <b>Relay</b>
                <code>prod · us-east-1</code>
            </div>
            <div className="preview-crumb">
                <span>Project</span>
                <i>/</i>
                <b>harborlight</b>
                <i>/</i>
                <strong>Activity</strong>
            </div>
            <button
                className={`preview-search${isSearching ? ' is-searching' : ''}`}
                type="button"
                onClick={onToggleSearch}
            >
                <Search />
                <span>
                    {isSearching
                        ? 'Filtering: receipt, opened, clicked...'
                        : 'Search messages, recipients, message IDs...'}
                </span>
                <kbd>⌘K</kbd>
            </button>
            <button className="icon-button" type="button" onClick={onReplay}>
                <RefreshCw />
            </button>
            <div className="range-toggle">
                {rangeOptions.map((item) => (
                    <button
                        key={item}
                        type="button"
                        className={range === item ? 'active' : undefined}
                        onClick={() => onRangeChange(item)}
                    >
                        {item}
                    </button>
                ))}
            </div>
            <button className="send-button" type="button">
                <Send /> Send
            </button>
            <div className="avatar">GH</div>
        </header>
    );
}
