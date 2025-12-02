import { Link } from '@inertiajs/react';
import { Pencil } from 'lucide-react';
interface Props {
    route: string;
}
const EditButton = ({ route }: Props) => {
    return (
        <Link
            href={route}
            className="inline-flex items-center justify-center rounded-md border border-input bg-background p-2 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
            title="Edit Item"
        >
            <Pencil className="size-4" />
        </Link>
    );
};

export default EditButton;
