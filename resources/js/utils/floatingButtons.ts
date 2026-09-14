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
    md: { diameter: 56, gap: 14 },
    lg: { diameter: 64, gap: 16 },
}

// Fixed base offset from the bottom of the screen before any stacking is
// applied. On mobile, the bottom tab-bar nav (Home/Men/Women/Kids/Login)
// occupies real space here that this never accounted for — floating
// buttons were positioned as if that nav didn't exist, causing them to
// sit too low and visually collide with each other and the nav. Desktop
// has no such bar, so it keeps the original small offset.
function getBaseBottom(): number {
    if (typeof window === 'undefined') return 24
    // Matches the bottom nav's own breakpoint (lg:hidden, 1024px) —
    // below that, ~92px clears the nav bar's real height + safe area.
    return window.innerWidth < 1024 ? 92 : 24
}

// WhatsApp is now the innermost/base button (closest to the bottom nav),
// with Cart stacking above it — chat removed from this order entirely
// per direct request, since no chat widget exists to occupy that slot.
const DEFAULT_ORDER: FloatKey[] = ['whatsapp', 'cart']

export interface FloatSettings {
    enabled: boolean
    corner: FloatCorner
    size: FloatSize
}

export function readFloatSettings(settings: Record<string, string> | undefined, key: FloatKey, defaultEnabled: boolean): FloatSettings {
    const s = settings ?? {}
    const rawSize = s[`${key}_float_size`]
    const validSize: FloatSize = (rawSize === 'sm' || rawSize === 'md' || rawSize === 'lg') ? rawSize : 'md'
    const rawCorner = s[`${key}_float_position`]
    const validCorner: FloatCorner = (rawCorner === 'left' || rawCorner === 'right') ? rawCorner : 'right'
    return {
        enabled: (s[`${key}_float_enabled`] ?? (defaultEnabled ? '1' : '0')) === '1',
        corner: validCorner,
        size: validSize,
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
    let bottom = getBaseBottom()
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
