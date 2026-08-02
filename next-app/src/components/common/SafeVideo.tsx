'use client'

import React, { useEffect, useRef, useState } from 'react'

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
    const [isMounted, setIsMounted] = useState(false)
    const localRef = useRef<HTMLVideoElement | null>(null)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    useEffect(() => {
        if (!isMounted) return

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
    }, [isMounted, videoRef, playbackRate, autoPlay, muted])

    if (!isMounted) {
        return <div className={className} />
    }

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
            {...props}
        />
    )
}
