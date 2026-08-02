import React, { useState, useEffect, useRef } from 'react'

interface IntroAnimationProps {
    onComplete?: () => void
}

// Individual animated letter component
const AnimatedLetter = ({
    letter,
    delay,
    isVisible,
}: {
    letter: string
    delay: number
    isVisible: boolean
}) => (
    <span style={{ overflow: 'hidden', display: 'inline-block', lineHeight: 0.9 }}>
        <span
            style={{
                display: 'inline-block',
                transform: isVisible ? 'translateY(0%)' : 'translateY(115%)',
                opacity: isVisible ? 1 : 0,
                transition: `transform 900ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, opacity 500ms ease ${delay}ms`,
                willChange: 'transform',
                fontFamily: "'Playpen Sans', sans-serif",
            }}
        >
            {letter === ' ' ? '\u00A0' : letter}
        </span>
    </span>
)

const WORD1 = 'TRENDY'
const WORD2 = 'DECOR'

const IntroAnimation: React.FC<IntroAnimationProps> = ({ onComplete }) => {
    const [phase, setPhase] = useState<'idle' | 'loading' | 'complete' | 'curtain-out' | 'done'>('idle')
    const [progress, setProgress] = useState(0)
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

    useEffect(() => {
        document.body.style.overflow = 'hidden'

        // Short delay then start loading animation
        const startDelay = setTimeout(() => {
            setPhase('loading')

            let count = 0
            // Total duration ~2.4s for counter (0 → 100)
            intervalRef.current = setInterval(() => {
                // Ease-out: slow down near the end
                const step = count < 60 ? 2 : count < 88 ? 1.2 : 0.6
                count = Math.min(count + step, 100)
                setProgress(Math.floor(count))

                if (count >= 100) {
                    if (intervalRef.current) clearInterval(intervalRef.current)
                    // Brief hold at 100%
                    setTimeout(() => setPhase('complete'), 100)
                    setTimeout(() => setPhase('curtain-out'), 600)
                    setTimeout(() => {
                        setPhase('done')
                        document.body.style.overflow = ''
                        onComplete?.()
                    }, 1800)
                }
            }, 24)
        }, 150)

        return () => {
            clearTimeout(startDelay)
            if (intervalRef.current) clearInterval(intervalRef.current)
            document.body.style.overflow = ''
        }
    }, [onComplete])

    if (phase === 'done') return null

    const textVisible = phase === 'loading' || phase === 'complete' || phase === 'curtain-out'
    const curtainOut = phase === 'curtain-out'

    return (
        <div
            aria-hidden="true"
            className="fixed inset-0 z-[99999] overflow-hidden select-none"
            style={{ fontFamily: "'Playpen Sans', sans-serif" }}
        >
            {/* ── LEFT CURTAIN ── */}
            <div
                className="absolute inset-y-0 left-0 w-1/2 will-change-transform"
                style={{
                    backgroundColor: '#1c1c1c',
                    transform: curtainOut ? 'translateX(-100%)' : 'translateX(0%)',
                    transition: curtainOut
                        ? 'transform 1050ms cubic-bezier(0.76, 0, 0.24, 1)'
                        : 'none',
                    zIndex: 2,
                }}
            />

            {/* ── RIGHT CURTAIN ── */}
            <div
                className="absolute inset-y-0 right-0 w-1/2 will-change-transform"
                style={{
                    backgroundColor: '#1c1c1c',
                    transform: curtainOut ? 'translateX(100%)' : 'translateX(0%)',
                    transition: curtainOut
                        ? 'transform 1050ms cubic-bezier(0.76, 0, 0.24, 1)'
                        : 'none',
                    zIndex: 2,
                }}
            />

            {/* ── CONTENT LAYER (above curtains) ── */}
            <div
                className="absolute inset-0 flex flex-col items-center justify-center"
                style={{
                    zIndex: 10,
                    opacity: curtainOut ? 0 : 1,
                    transition: curtainOut ? 'opacity 300ms ease-out 80ms' : 'none',
                    pointerEvents: 'none',
                }}
            >

                {/* ── TRENDY — staggered letter drop ── */}
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'flex-end',
                        fontSize: 'clamp(3.2rem, 12.5vw, 10.5rem)',
                        fontWeight: 200,
                        letterSpacing: '0.24em',
                        color: '#f4f1ea',
                        lineHeight: 0.9,
                        gap: '0.01em',
                        paddingRight: '0.24em', /* compensate letter-spacing at end */
                    }}
                >
                    {WORD1.split('').map((letter, i) => (
                        <AnimatedLetter
                            key={i}
                            letter={letter}
                            delay={i * 65}
                            isVisible={textVisible}
                        />
                    ))}
                </div>

                {/* ── Divider rule with italic tagline ── */}
                <div
                    style={{
                        width: 'clamp(14rem, 46vw, 44rem)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.9rem',
                        margin: '1.8vh 0',
                        opacity: textVisible ? 1 : 0,
                        transform: textVisible ? 'scaleX(1)' : 'scaleX(0)',
                        transition: 'opacity 800ms ease 380ms, transform 900ms cubic-bezier(0.16,1,0.3,1) 380ms',
                        transformOrigin: 'center',
                    }}
                >
                    <span style={{
                        flex: 1, height: '1px',
                        background: 'linear-gradient(to right, transparent, #b6ac9f 70%)',
                    }} />
                    <span
                        style={{
                            fontWeight: 300,
                            fontStyle: 'italic',
                            fontSize: 'clamp(0.58rem, 1.1vw, 0.78rem)',
                            letterSpacing: '0.2em',
                            color: '#b6ac9f',
                            whiteSpace: 'nowrap',
                        }}
                    >
                        Atelier &amp; Event Styling
                    </span>
                    <span style={{
                        flex: 1, height: '1px',
                        background: 'linear-gradient(to left, transparent, #b6ac9f 70%)',
                    }} />
                </div>

                {/* ── DECOR — staggered letter drop, outline style ── */}
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'flex-end',
                        fontSize: 'clamp(3.2rem, 12.5vw, 10.5rem)',
                        fontWeight: 200,
                        letterSpacing: '0.24em',
                        lineHeight: 0.9,
                        gap: '0.01em',
                        paddingRight: '0.24em',
                        WebkitTextStroke: '1.2px #b6ac9f',
                        color: 'transparent',
                    }}
                >
                    {WORD2.split('').map((letter, i) => (
                        <AnimatedLetter
                            key={i}
                            letter={letter}
                            delay={360 + i * 65}
                            isVisible={textVisible}
                        />
                    ))}
                </div>

                {/* ── PROGRESS COUNTER ── */}
                <div
                    style={{
                        position: 'absolute',
                        bottom: '8vh',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '0.6rem',
                        opacity: textVisible ? 1 : 0,
                        transition: 'opacity 600ms ease 200ms',
                    }}
                >
                    {/* Percentage number */}
                    <span
                        style={{
                            fontWeight: 300,
                            fontSize: 'clamp(0.7rem, 1.4vw, 1rem)',
                            letterSpacing: '0.3em',
                            color: '#f4f1ea',
                            fontVariantNumeric: 'tabular-nums',
                            minWidth: '4ch',
                            textAlign: 'center',
                            display: 'block',
                        }}
                    >
                        {progress}&nbsp;%
                    </span>

                    {/* Progress bar track */}
                    <div
                        style={{
                            width: 'clamp(5rem, 12vw, 9rem)',
                            height: '1px',
                            background: 'rgba(182,172,159,0.2)',
                            borderRadius: '1px',
                            overflow: 'hidden',
                            position: 'relative',
                        }}
                    >
                        <div
                            style={{
                                position: 'absolute',
                                inset: 0,
                                background: '#b6ac9f',
                                transformOrigin: 'left',
                                transform: `scaleX(${progress / 100})`,
                                transition: 'transform 80ms linear',
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* ── SKIP ── */}
            <button
                onClick={() => {
                    if (intervalRef.current) clearInterval(intervalRef.current)
                    setPhase('done')
                    document.body.style.overflow = ''
                    onComplete?.()
                }}
                style={{
                    fontFamily: "'Playpen Sans', sans-serif",
                    position: 'absolute',
                    top: '1.5rem',
                    right: '1.75rem',
                    zIndex: 100,
                    fontSize: '0.58rem',
                    letterSpacing: '0.35em',
                    textTransform: 'uppercase',
                    color: 'rgba(244,241,234,0.3)',
                    cursor: 'pointer',
                    background: 'transparent',
                    border: '1px solid rgba(182,172,159,0.15)',
                    borderRadius: '100px',
                    padding: '0.4rem 1rem',
                    transition: 'color 200ms, border-color 200ms',
                    pointerEvents: 'auto',
                }}
                onMouseEnter={e => {
                    const btn = e.currentTarget
                    btn.style.color = 'rgba(244,241,234,0.75)'
                    btn.style.borderColor = 'rgba(182,172,159,0.45)'
                }}
                onMouseLeave={e => {
                    const btn = e.currentTarget
                    btn.style.color = 'rgba(244,241,234,0.3)'
                    btn.style.borderColor = 'rgba(182,172,159,0.15)'
                }}
            >
                Skip
            </button>
        </div>
    )
}

export default IntroAnimation
