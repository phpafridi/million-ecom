import { ReactNode } from 'react'

interface Props {
    children: [ReactNode, ReactNode]
}

// Mobile-only side-by-side pattern from the reference: two sections sit
// next to each other, each taking most of the screen width so the next
// one peeks in at the edge, with scroll-snap so it settles cleanly on
// whichever one you land on rather than stopping mid-scroll. On desktop
// (lg+) this reverts to normal full-width stacking — the horizontal
// pairing is specifically a small-screen space-saving trick, not
// something that makes sense on a wide viewport.
export default function MobilePairRow({ children }: Props) {
    const [first, second] = children

    return (
        <>
            {/* Mobile — side-by-side, horizontally scrollable */}
            <div className="lg:hidden flex overflow-x-auto" style={{ scrollSnapType: 'x mandatory', scrollbarWidth: 'none' }}>
                <div className="flex-shrink-0" style={{ width: '88vw', scrollSnapAlign: 'start' }}>{first}</div>
                <div className="flex-shrink-0" style={{ width: '88vw', scrollSnapAlign: 'start' }}>{second}</div>
            </div>
            {/* Desktop — normal stacked, full-width, one after the other */}
            <div className="hidden lg:block">{first}</div>
            <div className="hidden lg:block">{second}</div>
        </>
    )
}
