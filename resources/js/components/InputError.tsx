type InputErrorProps = {
    message?: string;
};

export default function InputError({ message }: InputErrorProps) {
    if (!message) {
        return null;
    }

    return (
        <div>
            <p className="text-sm text-red-600 dark:text-red-500">{message}</p>
        </div>
    );
}
