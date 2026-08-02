import React from 'react'

export default function ProductDetailLoading() {
    return (
        <main
            className="w-full bg-[#e8e3da] min-h-screen select-none animate-pulse"
            style={{ fontFamily: "'Playpen Sans', sans-serif" }}
        >
            {/* Mobile Skeleton */}
            <div className="md:hidden w-full bg-[#f4f1ea] min-h-screen pb-24 space-y-4 p-4">
                <div className="w-full h-12 bg-[#e8e3da] rounded-xl skeleton-shimmer" />
                <div className="w-full aspect-[9/16] max-h-[70vh] bg-[#e8e3da] rounded-2xl skeleton-shimmer" />
                <div className="space-y-3 pt-2">
                    <div className="w-24 h-4 bg-[#e8e3da] rounded-md skeleton-shimmer" />
                    <div className="w-3/4 h-7 bg-[#e8e3da] rounded-md skeleton-shimmer" />
                    <div className="w-32 h-8 bg-[#e8e3da] rounded-md skeleton-shimmer" />
                    <div className="w-full h-20 bg-[#e8e3da] rounded-xl skeleton-shimmer mt-4" />
                </div>
            </div>

            {/* Desktop Skeleton */}
            <div className="hidden md:block">
                <div className="w-full border-b border-[#b6ac9f]/30 bg-[#f4f1ea]/60 py-4 px-8 md:px-12">
                    <div className="max-w-[1600px] mx-auto flex items-center gap-3">
                        <div className="w-8 h-8 bg-[#e8e3da] rounded-lg skeleton-shimmer" />
                        <div className="w-48 h-4 bg-[#e8e3da] rounded-md skeleton-shimmer" />
                    </div>
                </div>

                <div className="max-w-[1600px] mx-auto px-8 md:px-12 py-10 md:py-16">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
                        {/* Media Skeleton */}
                        <div className="lg:col-span-7 space-y-4">
                            <div className="w-full aspect-[9/16] max-h-[78vh] bg-[#f4f1ea] border border-[#b6ac9f]/30 rounded-2xl overflow-hidden skeleton-shimmer" />
                            <div className="flex gap-3 pt-2">
                                <div className="w-16 h-28 bg-[#f4f1ea] rounded-xl skeleton-shimmer" />
                                <div className="w-16 h-28 bg-[#f4f1ea] rounded-xl skeleton-shimmer" />
                                <div className="w-16 h-28 bg-[#f4f1ea] rounded-xl skeleton-shimmer" />
                            </div>
                        </div>

                        {/* Details Sidebar Skeleton */}
                        <div className="lg:col-span-5 bg-[#f4f1ea] border border-[#b6ac9f]/30 rounded-2xl p-6 md:p-8 space-y-6">
                            <div className="space-y-3 pb-5 border-b border-[#b6ac9f]/20">
                                <div className="flex justify-between items-center">
                                    <div className="w-24 h-4 bg-[#e8e3da] rounded-md skeleton-shimmer" />
                                    <div className="w-20 h-6 bg-[#e8e3da] rounded-full skeleton-shimmer" />
                                </div>
                                <div className="w-4/5 h-8 bg-[#e8e3da] rounded-md skeleton-shimmer" />
                                <div className="w-32 h-9 bg-[#e8e3da] rounded-md skeleton-shimmer" />
                            </div>

                            <div className="space-y-3">
                                <div className="w-28 h-4 bg-[#e8e3da] rounded-md skeleton-shimmer" />
                                <div className="w-full h-4 bg-[#e8e3da] rounded-md skeleton-shimmer" />
                                <div className="w-full h-4 bg-[#e8e3da] rounded-md skeleton-shimmer" />
                                <div className="w-2/3 h-4 bg-[#e8e3da] rounded-md skeleton-shimmer" />
                            </div>

                            <div className="space-y-3 pt-4">
                                <div className="w-full h-14 bg-[#1c1c1c]/10 rounded-xl skeleton-shimmer" />
                                <div className="w-full h-14 bg-[#1c1c1c]/10 rounded-xl skeleton-shimmer" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}
