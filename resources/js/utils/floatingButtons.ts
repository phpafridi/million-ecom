// Shared by the Chat widget, Floating Cart, and WhatsApp button — these are
// three independent components that previously had no way to coordinate
// with each other, which is exactly how the WhatsApp button ended up sitting
// at the identical bottom:24px/right:24px coordinates as the chat bubble,
// hidden behind it by z-index. Each button now computes its own offset by
// asking "how many other ENABLED buttons in my same corner come before me
// in the stacking order, and how tall are they" — so disabling any one of
// them automatically closes the gap for the others, and admin-configured
// sizes are reflected in the stacking math instead of being hardcoded.

export type FloatSize = 'sm' | 'md' | 'lg'
export type FloatCorner = 'right' | 'left'
export type FloatKey = 'chat' | 'cart' | 'whatsapp'

// Diameter of each size tier, plus the gap kept above the next button in
// the same stack.
const SIZE_PX: Record<FloatSize, { diameter: number; gap: number }> = {
    sm: { diameter: 48, gap: 12 },
    md: { diameter: 56, gap: 16 },
    lg: { diameter: 64, gap: 20 },
}

// Fixed base offset from the bottom of the screen before any stacking is
// applied — keeps the first button in a corner clear of the mobile bottom
// nav bar.
const BASE_BOTTOM = 24

// Default stacking order within a shared corner when sizes are otherwise
// equal — matches the pre-existing default layout (chat innermost, then
// cart, then WhatsApp outermost) so upgrading doesn't visually reshuffle
// anyone who hasn't touched these settings.
const DEFAULT_ORDER: FloatKey[] = ['chat', 'cart', 'whatsapp']

export interface FloatSettings {
    enabled: boolean
    corner: FloatCorner
    size: FloatSize
}

export function readFloatSettings(settings: Record<string, string> | undefined, key: FloatKey, defaultEnabled: boolean): FloatSettings {
    const s = settings ?? {}
    return {
        enabled: (s[`${key}_float_enabled`] ?? (defaultEnabled ? '1' : '0')) === '1',
        corner: (s[`${key}_float_position`] as FloatCorner) || 'right',
        size: (s[`${key}_float_size`] as FloatSize) || 'md',
    }
}

// Returns the pixel offset (bottom + side) for `key`, given the full
// settings object. Buttons that are disabled or in a different corner are
// ignored when computing how far up the stack this one sits.
export function getFloatOffset(
    settings: Record<string, string> | undefined,
    key: FloatKey,
    defaultEnabledMap: Record<FloatKey, boolean> = { chat: true, cart: true, whatsapp: false }
): { bottom: number; side: number; corner: FloatCorner; enabled: boolean; diameter: number } {
    const all: Record<FloatKey, FloatSettings> = {
        chat: readFloatSettings(settings, 'chat', defaultEnabledMap.chat),
        cart: readFloatSettings(settings, 'cart', defaultEnabledMap.cart),
        whatsapp: readFloatSettings(settings, 'whatsapp', defaultEnabledMap.whatsapp),
    }
    const self = all[key]
    let bottom = BASE_BOTTOM
    for (const otherKey of DEFAULT_ORDER) {
        if (otherKey === key) break
        const other = all[otherKey]
        if (other.enabled && other.corner === self.corner) {
            const dims = SIZE_PX[other.size]
            bottom += dims.diameter + dims.gap
        }
    }
    return {
        bottom,
        side: 24,
        corner: self.corner,
        enabled: self.enabled,
        diameter: SIZE_PX[self.size].diameter,
    }
}
