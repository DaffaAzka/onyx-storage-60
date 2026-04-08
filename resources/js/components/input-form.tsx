import { Input } from '@/components/ui/input';
import type { ChangeEventHandler, HTMLInputTypeAttribute } from 'react';
import { Field, FieldDescription, FieldLabel } from './ui/field';

export default function InputForm({
    name,
    text,
    type,
    value = '',
    handleChange,
    error = null,
    usePlaceholder = false,
    isDisabled = false,
}: {
    name: string;
    text: string;
    type: HTMLInputTypeAttribute;
    value?: string;
    handleChange: ChangeEventHandler<HTMLInputElement>;
    error?: string | null;
    usePlaceholder?: boolean;
    isDisabled?: boolean;
}) {
    return usePlaceholder ? (
        <Field aria-invalid={error != null} className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
                <Input
                    id={name}
                    name={name}
                    type={type}
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
                    type={type}
                    value={value}
                    disabled={isDisabled}
                    onChange={handleChange}
                    aria-invalid={error != null}
                    className="bg-white text-black"
                />
                {error && <FieldDescription className="text-xs">{error}</FieldDescription>}
            </div>
        </Field>
    );
}
