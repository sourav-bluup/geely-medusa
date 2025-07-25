import { Label, Select } from "@medusajs/ui"

interface LocationSelectorProps {
    selectedLocationId: string | undefined
    onLocationChange: (locationId: string) => void
    availableLocationIds?: string[]
    locationMap: Map<string, string>
    isLoading: boolean
    disabled?: boolean
    showAvailableOnly?: boolean
    error?: string
}

export const LocationSelector = ({
    selectedLocationId,
    onLocationChange,
    availableLocationIds,
    locationMap,
    isLoading,
    disabled = false,
    showAvailableOnly = false,
    error
}: LocationSelectorProps) => {
    const locations = Array.from(locationMap.entries())
        .filter(([id]) => !showAvailableOnly || !availableLocationIds || availableLocationIds.includes(id))
        .map(([id, name]) => ({
            id,
            name
        }))

    const isDisabled = disabled || isLoading

    return (
        <div className="flex flex-col gap-y-1">
            <Label>Location</Label>
            <Select
                disabled={isDisabled}
                value={selectedLocationId}
                onValueChange={onLocationChange}
                size="base"
            >
                <Select.Trigger>
                    <Select.Value placeholder={isDisabled ? "No locations available" : "Select a location"} />
                </Select.Trigger>
                <Select.Content>
                    {locations.map((location) => (
                        <Select.Item key={location.id} value={location.id}>
                            {location.name}
                        </Select.Item>
                    ))}
                </Select.Content>
            </Select>
            {error && (
                <span className="text-ui-fg-error text-xs">
                    {error}
                </span>
            )}
            {locations.length === 0 && !isLoading && (
                <span className="text-ui-fg-subtle text-xs">
                    No locations available
                </span>
            )}
            <span className="text-ui-fg-subtle text-xs mt-1">
                {disabled ?
                    "Select an inventory item first to see available locations" :
                    showAvailableOnly ?
                        "Only showing locations with available quantity for the selected item" :
                        "Select a location to store the item"
                }
            </span>
        </div>
    )
} 