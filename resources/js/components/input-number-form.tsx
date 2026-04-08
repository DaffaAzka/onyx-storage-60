import { Input } from '@/components/ui/input';
import type { ChangeEventHandler } from 'react';
import { Field, FieldDescription, FieldLabel } from './ui/field';

export default function InputNumberForm({
    name,
    text,
    value = '',
    handleChange,
    error = null,
    usePlaceholder = false,
    isDisabled = false,
    min = 0,
}: {
    name: string;
    text: string;
    value?: string | number;
    handleChange: ChangeEventHandler<HTMLInputElement>;
    error?: string | null;
    usePlaceholder?: boolean;
    isDisabled?: boolean;
    min?: string | number;
}) {
    return usePlaceholder ? (
        <Field aria-invalid={error != null} className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
                <Input
                    id={name}
                    name={name}
                    type={`number`}
                    min={min}
                    value={value}
                    onChange={handleChange}
                    disabled={isDisabled}
                    aria-invalid={error != null}
                    placeholder={text}
                    className="bg-white text-black"
                />
                {error && <FieldDescription className="text-xs">{error}</FieldDescription>}
            </div>
        </Field>
    ) : (
        <Field aria-invalid={error != null} className="flex flex-col gap-3">
            <FieldLabel htmlFor={name}>{text}</FieldLabel>
            <div className="flex flex-col gap-1">
                <Input
                    id={name}
                    name={name}
                    value={value}
                    disabled={isDisabled}
                    onChange={handleChange}
                    aria-invalid={error != null}
                    className="bg-white text-black"
                    type={`number`}
                    min={min}
                />
                {error && <FieldDescription className="text-xs">{error}</FieldDescription>}
            </div>
        </Field>
    );
}
