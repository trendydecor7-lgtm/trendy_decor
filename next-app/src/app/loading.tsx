export default function Loading() {
    return (
        <div className="min-h-[70vh] w-full flex items-center justify-center bg-[#e8e3da]">
            <div className="flex flex-col items-center gap-3">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#1c1c1c] border-t-transparent" />
                <span className="text-xs font-light tracking-widest text-[#1c1c1c]/60 uppercase">
                    Loading Trendy Decor...
                </span>
            </div>
        </div>
    )
}
