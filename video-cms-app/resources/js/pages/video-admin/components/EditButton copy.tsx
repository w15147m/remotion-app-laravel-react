import { Link } from '@inertiajs/react';
import { Eye } from 'lucide-react';
interface Props {
    route: string;
}
const EyeButton = ({ route }: Props) => {
    return (
        <Link
            href={route}
            className="inline-flex items-center justify-center rounded-md border border-input bg-background p-2 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-neutral-100 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 dark:hover:bg-neutral-800"
            title="View Item"
        >
            <Eye className="size-4" />
        </Link>
    );
};

export default EyeButton;
