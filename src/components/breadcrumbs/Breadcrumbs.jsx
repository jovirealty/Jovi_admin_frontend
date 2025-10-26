import { Link } from "react-router-dom";

export default function Breadcrumbs ({ items = [], className = "" }) {
    return (
        <nav aria-label="Breadcrumb" className={`text-sm ${className}`}>
            <ol className="flex flex-wrap items-center gap-1 text-neutral-500 dark:text-neutral-400">
                {items.map((it, i) => {
                    const last = i === items.length - 1;
                    return (
                        <li key={i} className="inline-flex items-center gap-1">
                            {last ? (
                                <span className="text-neutral-700 dark:text-neutral-200">
                                    {it.label}
                                </span>
                            ) : (
                                <>
                                    <Link to={it.to} className="hover:underline">
                                        {it.label}
                                    </Link>
                                    <span className="px-1 text-neutral-400">/</span>
                                </>
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
}