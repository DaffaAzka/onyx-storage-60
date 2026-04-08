import { Spinner } from '@/components/ui/spinner';
import { Button } from './ui/button';

type ButtonType = 'button' | 'submit' | 'reset';

export default function LoadingButton({
    text,
    type = 'button',
    variant = 'default',
    loading = false,
}: {
    text: string;
    type?: ButtonType;
    variant?: 'default' | 'link' | 'destructive' | 'outline' | 'secondary' | 'ghost' | null | undefined;
    loading?: boolean;
}) {
    return (
        <Button disabled={loading} type={type} variant={variant} className="w-full">
            {loading && <Spinner />}
            {text}
        </Button>
    );
}
