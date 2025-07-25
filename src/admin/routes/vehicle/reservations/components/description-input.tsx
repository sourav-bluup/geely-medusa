import { Label, Textarea } from "@medusajs/ui"

interface DescriptionInputProps {
    value: string
    onChange: (value: string) => void
    error?: string
}

export const DescriptionInput = ({
    value,
    onChange,
    error
}: DescriptionInputProps) => {
    return (
        <div className="flex flex-col gap-y-1">
            <Label>Description</Label>
            <Textarea
                placeholder="Add notes or details about this reservation..."
                value={value}
                onChange={(e) => onChange(e.target.value)}
                rows={3}
                className="resize-none"
            />
            {error && (
                <span className="text-ui-fg-error text-xs">
                    {error}
                </span>
            )}
            <span className="text-ui-fg-subtle text-xs mt-1">
                Optional: Add any relevant notes or details about this reservation
            </span>
        </div>
    )
} 