import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SelectItems } from '@/lib/types';
import { Field, FieldDescription, FieldLabel } from './ui/field';

export default function SelectForm({
    name,
    text,
    handleChange,
    items,
    error = null,
    usePlaceholder = false,
    value = null,
    isDisabled = false,
    withAll = false,
}: {
    name: string;
    text: string;
    handleChange: (value: string) => void;
    items: SelectItems[];
    error?: string | null;
    value?: string | null;
    usePlaceholder?: boolean;
    isDisabled?: boolean;
    withAll?: boolean;
}) {
    return usePlaceholder ? (
        <Field aria-invalid={error != null} className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
                <Select onValueChange={handleChange} name={name} value={value ?? ''}>
                    <SelectTrigger className="w-full" disabled={isDisabled}>
                        <SelectValue placeholder={text} />
                    </SelectTrigger>
                    <SelectContent>
                        {withAll && <SelectItem value="all">All</SelectItem>}
                        {items.map((item) => (
                            <SelectItem key={item.id} value={item.id.toString()}>
                                {item.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                {error && <FieldDescription className="text-xs">{error}</FieldDescription>}
            </div>
        </Field>
    ) : (
        <Field aria-invalid={error != null} className="flex flex-col gap-3">
            <FieldLabel htmlFor={name}>{text}</FieldLabel>
            <Select onValueChange={handleChange} name={name} value={value ?? ''}>
                <SelectTrigger className="w-full" disabled={isDisabled}>
                    <SelectValue placeholder={text} />
                </SelectTrigger>
                <SelectContent>
                    {items.map((item) => (
                        <SelectItem key={item.id} value={item.id.toString()}>
                            {item.name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <div className="flex flex-col gap-1">{error && <FieldDescription className="text-xs">{error}</FieldDescription>}</div>
        </Field>
    );
}
