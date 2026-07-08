import type { SVGProps } from 'react';

export default function AppLogoIcon({
    className,
    ...props
}: SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 48 48"
            className={className}
            aria-hidden="true"
            {...props}
        >
            <path
                fill="currentColor"
                d="M12 8h17.5c7.3 0 12 4.1 12 10.4 0 4.8-2.6 8.4-7.2 9.7L41.5 40H33l-8.5-9.2H20V40h-8V8Zm8.2 6.2v10.8h8.6c3.6 0 5.8-1.9 5.8-5.4s-2.2-5.4-5.8-5.4h-8.6Z"
            />
        </svg>
    );
}
