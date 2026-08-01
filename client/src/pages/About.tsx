import React from 'react'
import { Link } from 'react-router-dom'
import { Phone, MapPin, Clock, AtSign, ArrowRight } from 'lucide-react'

const About: React.FC = () => {
    const specializations = [
        'Baby Welcome Setups',
        'NRI Homecoming Celebrations',
        'Wedding & Engagement Decor',
        'Balloon Arches & Floral Backdrops',
        'Gurudwara Paath & Shukrana Functions',
        'Stage & Fairy Light Installations',
    ]

    return (
        <main
            className="w-full select-none bg-[#f4f1ea]"
            style={{ fontFamily: "'Playpen Sans', sans-serif" }}
        >
            <div className="max-w-[1600px] mx-auto px-8 md:px-12">
                {/* ── ABOUT + SPECIALIZATIONS ──────────────────────────── */}
                <div className="py-12 md:py-16 border-b border-[#b6ac9f]/30">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20">
                        {/* Left: About text */}
                        <div>
                            <h1 className="text-2xl md:text-3xl font-normal text-[#1c1c1c] tracking-tight leading-snug mb-4">
                                Trendy Decor Gidderbaha
                            </h1>
                            <p className="text-[13px] font-light text-[#1c1c1c]/70 leading-relaxed mb-3">
                                A premier event decoration service based in Burf Wali Gali,
                                Gidderbaha, Punjab, specializing in transforming personal spaces and
                                venues into vibrant, celebratory settings.
                            </p>
                            <p className="text-[13px] font-light text-[#1c1c1c]/70 leading-relaxed mb-3">
                                Founded and operated by the family team of{' '}
                                <span className="text-[#1c1c1c]/90">Harish Ahuja</span> and{' '}
                                <span className="text-[#1c1c1c]/90">Hitin Ahuja</span>, the business
                                delivers highly customized aesthetics for major life milestones
                                across Gidderbaha, Bathinda, and Malout.
                            </p>
                            <p className="text-[13px] font-light text-[#1c1c1c]/70 leading-relaxed">
                                Operating daily from 8:00 AM to 8:00 PM under direct owner
                                supervision — establishing a trusted local reputation that blends
                                modern decor trends with personalized client care.
                            </p>
                        </div>

                        {/* Right: Specializations */}
                        <div>
                            <p className="text-[10px] font-light uppercase tracking-[0.22em] text-[#1c1c1c]/40 mb-4">
                                What We Do
                            </p>
                            <div className="flex flex-col divide-y divide-[#b6ac9f]/25">
                                {specializations.map((item, i) => (
                                    <p
                                        key={i}
                                        className="text-[13px] font-light text-[#1c1c1c]/75 py-2.5"
                                    >
                                        {item}
                                    </p>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── LEADERSHIP ─────────────────────────────────────── */}
                <div className="py-10 border-b border-[#b6ac9f]/30">
                    <p className="text-[10px] font-light uppercase tracking-[0.22em] text-[#1c1c1c]/40 mb-5">
                        The People
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-20">
                        <div>
                            <h3 className="text-[16px] font-normal text-[#1c1c1c] mb-0.5">
                                Harish Ahuja
                            </h3>
                            <p className="text-[10px] font-light uppercase tracking-widest text-[#1c1c1c]/40 mb-2">
                                Client Relations & Bookings
                            </p>
                            <p className="text-[13px] font-light text-[#1c1c1c]/65 leading-relaxed mb-3">
                                Primary point of contact for all bookings and client consultations,
                                directly managing relationships and listed prominently across all
                                promotional material.
                            </p>
                            <a
                                href="tel:+919417718844"
                                className="inline-flex items-center gap-2 text-[12px] font-light text-[#1c1c1c]/60 hover:text-[#1c1c1c] transition-colors"
                            >
                                <Phone size={12} strokeWidth={1.5} />
                                +91 9417718844
                            </a>
                        </div>

                        <div>
                            <h3 className="text-[16px] font-normal text-[#1c1c1c] mb-0.5">
                                Hitin Ahuja
                            </h3>
                            <p className="text-[10px] font-light uppercase tracking-widest text-[#1c1c1c]/40 mb-2">
                                Portfolio & Digital Presence
                            </p>
                            <p className="text-[13px] font-light text-[#1c1c1c]/65 leading-relaxed mb-3">
                                Drives the brand's digital footprint, showcasing portfolio setups on
                                Instagram and bringing the team's creative work to a broader
                                audience.
                            </p>
                            <span className="inline-flex items-center gap-2 text-[12px] font-light text-[#1c1c1c]/60">
                                <AtSign size={12} strokeWidth={1.5} />
                                @trendy_decor_gdb
                            </span>
                        </div>
                    </div>
                </div>

                {/* ── INFO + CTA ─────────────────────────────────────── */}
                <div className="py-10">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mb-10">
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-1.5 mb-1">
                                <MapPin size={12} strokeWidth={1.4} className="text-[#1c1c1c]/40" />
                                <span className="text-[9px] font-light uppercase tracking-widest text-[#1c1c1c]/35">
                                    Location
                                </span>
                            </div>
                            <p className="text-[13px] font-normal text-[#1c1c1c]">
                                Gidderbaha, Punjab
                            </p>
                            <p className="text-[12px] font-light text-[#1c1c1c]/55">
                                Burf Wali Gali
                            </p>
                        </div>

                        <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-1.5 mb-1">
                                <Phone size={12} strokeWidth={1.4} className="text-[#1c1c1c]/40" />
                                <span className="text-[9px] font-light uppercase tracking-widest text-[#1c1c1c]/35">
                                    Contact
                                </span>
                            </div>
                            <a
                                href="tel:+919417718844"
                                className="text-[13px] font-normal text-[#1c1c1c] hover:opacity-70 transition-opacity"
                            >
                                +91 9417718844
                            </a>
                            <p className="text-[12px] font-light text-[#1c1c1c]/55">Harish Ahuja</p>
                        </div>

                        <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-1.5 mb-1">
                                <Clock size={12} strokeWidth={1.4} className="text-[#1c1c1c]/40" />
                                <span className="text-[9px] font-light uppercase tracking-widest text-[#1c1c1c]/35">
                                    Hours
                                </span>
                            </div>
                            <p className="text-[13px] font-normal text-[#1c1c1c]">
                                8:00 AM – 8:00 PM
                            </p>
                            <p className="text-[12px] font-light text-[#1c1c1c]/55">
                                All days of the week
                            </p>
                        </div>

                        <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-1.5 mb-1">
                                <AtSign size={12} strokeWidth={1.4} className="text-[#1c1c1c]/40" />
                                <span className="text-[9px] font-light uppercase tracking-widest text-[#1c1c1c]/35">
                                    Instagram
                                </span>
                            </div>
                            <p className="text-[13px] font-normal text-[#1c1c1c]">
                                @trendy_decor_gdb
                            </p>
                            <p className="text-[12px] font-light text-[#1c1c1c]/55">
                                Portfolio & Updates
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-3 pt-2 border-t border-[#b6ac9f]/30">
                        <Link
                            to="/contact"
                            className="inline-flex items-center gap-2.5 px-6 py-2.5 bg-[#1c1c1c] text-[#f4f1ea] rounded-md text-[11px] font-light tracking-widest uppercase hover:bg-black/80 transition-colors group"
                        >
                            <span>Get in Touch</span>
                            <ArrowRight
                                size={13}
                                className="group-hover:translate-x-1 transition-transform"
                            />
                        </Link>
                        <Link
                            to="/products"
                            className="inline-flex items-center gap-2.5 px-6 py-2.5 border border-[#1c1c1c]/25 text-[#1c1c1c] rounded-md text-[11px] font-light tracking-widest uppercase hover:border-[#1c1c1c]/60 transition-colors group"
                        >
                            <span>Browse Collection</span>
                            <ArrowRight
                                size={13}
                                className="group-hover:translate-x-1 transition-transform"
                            />
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default About
