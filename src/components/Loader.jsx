export default function Loader({ text = 'Loading...' }) {
    return (
        <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
            <div className="relative">
                <div className="w-12 h-12 rounded-full border-[3px] border-[var(--color-border-light)]" />
                <div className="absolute inset-0 w-12 h-12 rounded-full border-[3px] border-transparent border-t-[var(--color-primary)] animate-spin" />
            </div>
            <p className="mt-4 text-sm font-medium text-[var(--color-text-muted)]">{text}</p>
        </div>
    );
}
