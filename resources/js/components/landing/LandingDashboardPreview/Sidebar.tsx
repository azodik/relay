import { configItems, navItems } from './data';

export default function Sidebar() {
    return (
        <aside className="preview-sidebar">
            <div className="nav-group">
                <span>Mail</span>
                {navItems.map((item) => {
                    const Icon = item.icon;

                    return (
                        <button
                            key={item.label}
                            type="button"
                            className={
                                item.label === 'Activity' ? 'active' : undefined
                            }
                        >
                            <Icon />
                            <b>{item.label}</b>
                            <em>{item.count}</em>
                        </button>
                    );
                })}
            </div>
            <div className="nav-group config">
                <span>Configuration</span>
                {configItems.map((item) => {
                    const Icon = item.icon;

                    return (
                        <button key={item.label} type="button">
                            <Icon />
                            <b>{item.label}</b>
                        </button>
                    );
                })}
            </div>
            <div className="quota-card">
                <span>Stored sends</span>
                <strong>209,340</strong>
                <div>
                    <i></i>
                </div>
                <small>Last 30 days · SES quota sync optional</small>
            </div>
        </aside>
    );
}
