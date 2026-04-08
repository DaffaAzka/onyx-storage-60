import { ChangeEventHandler } from 'react';
import { Field, FieldDescription, FieldLabel } from './ui/field';
import { Textarea } from './ui/textarea';

export default function TextareaForm({
    name,
    text,
    value = '',
    handleChange,
    error = null,
    usePlaceholder = false,
    isDisabled = false,
}: {
    name: string;
    text: string;
    value?: string;
    handleChange: ChangeEventHandler<HTMLTextAreaElement>;
    error?: string | null;
    usePlaceholder?: boolean;
    isDisabled?: boolean;
}) {
    return usePlaceholder ? (
        <Field aria-invalid={error != null} className="flex w-full flex-col gap-3">
            <div className="flex w-full flex-col gap-1">
                <Textarea
                    id={name}
                    name={name}
                    value={value}
                    onChange={handleChange}
                    aria-invalid={error != null}
                    placeholder={text}
                    className="w-full resize-none overflow-auto bg-background wrap-break-word text-black"
                    rows={4}
                    disabled={isDisabled}
                />
                {error && <FieldDescription className="text-xs">{error}</FieldDescription>}
            </div>
        </Field>
    ) : (
        <Field aria-invalid={error != null} className="flex w-full flex-col gap-3">
            <FieldLabel htmlFor={name}>{text}</FieldLabel>
            <div className="flex w-full flex-col gap-1">
                <Textarea
                    id={name}
                    name={name}
                    value={value}
                    onChange={handleChange}
                    aria-invalid={error != null}
                    className="w-full resize-none overflow-auto bg-background wrap-break-word text-black"
                    rows={4}
                    disabled={isDisabled}
                />
                {error && <FieldDescription className="text-xs">{error}</FieldDescription>}
            </div>
        </Field>
    );
}
