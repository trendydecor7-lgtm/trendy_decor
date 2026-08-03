'use client'

import React, { useEffect, useRef } from 'react'

interface SafeVideoProps extends React.VideoHTMLAttributes<HTMLVideoElement> {
    videoRef?: React.RefObject<HTMLVideoElement | null> | ((instance: HTMLVideoElement | null) => void)
    playbackRate?: number
}

export default function SafeVideo({
    videoRef,
    playbackRate,
    className,
    autoPlay,
    muted = true,
    ...props
}: SafeVideoProps) {
    const localRef = useRef<HTMLVideoElement | null>(null)

    useEffect(() => {
        const el = (typeof videoRef === 'object' && videoRef && 'current' in videoRef && videoRef.current) 
            ? videoRef.current 
            : localRef.current

        if (el) {
            if (muted) el.muted = true
            if (playbackRate) el.playbackRate = playbackRate
            if (autoPlay) {
                el.play().catch(() => {})
            }
        }
    }, [videoRef, playbackRate, autoPlay, muted])

    const setRef = (node: HTMLVideoElement | null) => {
        localRef.current = node
        if (typeof videoRef === 'function') {
            videoRef(node)
        } else if (videoRef && 'current' in videoRef) {
            (videoRef as React.MutableRefObject<HTMLVideoElement | null>).current = node
        }
    }

    return (
        <video
            ref={setRef}
            className={className}
            autoPlay={autoPlay}
            muted={muted}
            playsInline
            preload="auto"
            suppressHydrationWarning
            {...props}
        />
    )
}
