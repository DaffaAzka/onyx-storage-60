import { Input } from '@/components/ui/input';
import type { ChangeEventHandler } from 'react';
import ImagePreview from './image-preview';
import { Field, FieldDescription, FieldLabel } from './ui/field';

export default function InputFileForm({
    name,
    text,
    value = '',
    handleChange,
    error = null,
    usePlaceholder = false,
    isDisabled = false,
    accept = 'image/*',
    preview,
    existingImage,
    onRemoveImage,
}: {
    name: string;
    text: string;
    value?: string;
    handleChange: ChangeEventHandler<HTMLInputElement>;
    error?: string | null;
    usePlaceholder?: boolean;
    isDisabled?: boolean;
    accept?: string;
    preview?: string;
    existingImage?: string;
    onRemoveImage?: () => void;
}) {
    return usePlaceholder ? (
        <Field aria-invalid={error != null} className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
                <ImagePreview preview={preview} existingImage={existingImage} onRemove={onRemoveImage} disabled={isDisabled} />
                <Input
                    id={name}
                    name={name}
                    type="file"
                    onChange={handleChange}
                    disabled={isDisabled}
                    aria-invalid={error != null}
                    placeholder={text}
                    accept={accept}
                    className="bg-white text-black file:mr-2 file:rounded file:border file:border-slate-300 file:bg-slate-100 file:px-3 file:py-1 file:text-sm file:font-semibold hover:file:bg-slate-200"
                />
                {error && <FieldDescription className="text-xs">{error}</FieldDescription>}
            </div>
        </Field>
    ) : (
        <Field aria-invalid={error != null} className="flex flex-col gap-3">
            <FieldLabel htmlFor={name}>{text}</FieldLabel>
            <div className="flex flex-col gap-2">
                <ImagePreview preview={preview} existingImage={existingImage} onRemove={onRemoveImage} disabled={isDisabled} />
                <Input
                    id={name}
                    name={name}
                    type="file"
                    onChange={handleChange}
                    disabled={isDisabled}
                    aria-invalid={error != null}
                    accept={accept}
                    className="bg-white"
                />
                {error && <FieldDescription className="text-xs">{error}</FieldDescription>}
            </div>
        </Field>
    );
}
