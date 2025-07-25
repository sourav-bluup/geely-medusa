import { Input, Label } from "@medusajs/ui"

interface QuantityInputProps {
    quantity: number
    maxQuantity: number
    onQuantityChange: (quantity: number) => void
    disabled?: boolean
    error?: string
}

export const QuantityInput = ({
    quantity,
    maxQuantity,
    onQuantityChange,
    disabled = false,
    error
}: QuantityInputProps) => {
    return (
        <div className="flex flex-col gap-y-1">
            <Label>Quantity</Label>
            <Input
                type="number"
                min={1}
                max={maxQuantity}
                value={quantity}
                onChange={(e) => {
                    const value = parseInt(e.target.value)
                    if (value >= 1 && value <= maxQuantity) {
                        onQuantityChange(value)
                    }
                }}
                disabled={disabled || maxQuantity === 0}
            />
            {error && (
                <span className="text-ui-fg-error text-xs">
                    {error}
                </span>
            )}
            {!disabled && maxQuantity > 0 && (
                <span className="text-ui-fg-subtle text-xs">
                    Max available: {maxQuantity}
                </span>
            )}
        </div>
    )
} 