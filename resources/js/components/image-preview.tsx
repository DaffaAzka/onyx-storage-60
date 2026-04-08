import { X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';

export default function ImagePreview({
    preview,
    existingImage,
    onRemove,
    disabled = false,
}: {
    preview?: string;
    existingImage?: string;
    onRemove?: () => void;
    disabled?: boolean;
}) {
    const [imageSrc, setImageSrc] = useState<string | null>(null);

    useEffect(() => {
        if (preview) {
            setImageSrc(preview);
        } else if (existingImage) {
            const imagePath = existingImage.startsWith('/') ? existingImage : `/storage/${existingImage}`;
            setImageSrc(imagePath);
        } else {
            setImageSrc(null);
        }
    }, [preview, existingImage]);

    if (!imageSrc) return null;

    return (
        <Card className="relative w-full overflow-hidden p-2">
            <div className="relative w-full">
                <img src={imageSrc} alt="Preview" className="max-h-64 w-full rounded object-contain" />
            </div>
        </Card>
    );
}
