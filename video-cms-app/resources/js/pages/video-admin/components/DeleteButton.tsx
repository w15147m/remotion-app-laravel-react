import { Link } from '@inertiajs/react';
import type { MouseEvent } from 'react';
import { Trash2 } from 'lucide-react';
interface Props {
    route: string;
}
const DeleteButton = ({route}: Props) => {
    return (
      <Link
        href={route}
        method="delete"
        preserveScroll
        className="inline-flex items-center justify-center rounded-md border border-transparent bg-red-600 p-2 text-sm font-medium text-white hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:outline-none"
        title="Delete Item"
        onClick={(e: MouseEvent) => {
          if (
            !confirm(
              'Are you sure you want to delete this item?',
            )
          ) {
            e.preventDefault();
          }
        }}
      >
        <Trash2 className="size-4" />
      </Link>
    );
};

export default DeleteButton;
