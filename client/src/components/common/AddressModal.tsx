import React, { useState } from 'react'
import { X, MapPin } from 'lucide-react'
import { type AddressItem } from '../../context/AuthContext'

interface AddressModalProps {
    isOpen: boolean
    onClose: () => void
    onSave: (address: AddressItem) => Promise<boolean>
}

export const AddressModal: React.FC<AddressModalProps> = ({ isOpen, onClose, onSave }) => {
    const [label, setLabel] = useState('Home')
    const [street, setStreet] = useState('')
    const [city, setCity] = useState('')
    const [state, setState] = useState('')
    const [zip, setZip] = useState('')
    const [phone, setPhone] = useState('')
    const [saving, setSaving] = useState(false)

    if (!isOpen) return null

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!street || !city || !state || !zip || !phone) return
        setSaving(true)
        const success = await onSave({ label, street, city, state, zip, country: 'India', phone })
        setSaving(false)
        if (success) {
            setLabel('Home')
            setStreet('')
            setCity('')
            setState('')
            setZip('')
            setPhone('')
            onClose()
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
            <div
                className="bg-[#f4f1ea] border border-[#e2dbce] rounded-3xl p-6 w-full max-w-md shadow-xl"
                style={{ fontFamily: "'Playpen Sans', sans-serif" }}
            >
                <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-2">
                        <MapPin size={18} className="text-[#1c1c1c]/60" />
                        <h2 className="text-lg font-semibold text-[#1c1c1c]">Add New Address</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-[#1c1c1c]/40 hover:text-[#1c1c1c] transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-3">
                    <div>
                        <label className="text-xs font-medium text-[#1c1c1c]/60 uppercase tracking-wider">
                            Label
                        </label>
                        <select
                            value={label}
                            onChange={(e) => setLabel(e.target.value)}
                            className="mt-1 w-full rounded-xl border border-[#e2dbce] bg-[#e8e3da] px-4 py-2.5 text-[14px] text-[#1c1c1c] focus:outline-none focus:ring-2 focus:ring-[#1c1c1c]/20"
                        >
                            <option>Home</option>
                            <option>Work</option>
                            <option>Other</option>
                        </select>
                    </div>

                    <div>
                        <label className="text-xs font-medium text-[#1c1c1c]/60 uppercase tracking-wider">
                            Street Address
                        </label>
                        <input
                            type="text"
                            required
                            placeholder="123 Main St, Apt 4B"
                            value={street}
                            onChange={(e) => setStreet(e.target.value)}
                            className="mt-1 w-full rounded-xl border border-[#e2dbce] bg-[#e8e3da] px-4 py-2.5 text-[14px] text-[#1c1c1c] placeholder:text-[#1c1c1c]/30 focus:outline-none focus:ring-2 focus:ring-[#1c1c1c]/20"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-xs font-medium text-[#1c1c1c]/60 uppercase tracking-wider">
                                City
                            </label>
                            <input
                                type="text"
                                required
                                placeholder="Chandigarh"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                className="mt-1 w-full rounded-xl border border-[#e2dbce] bg-[#e8e3da] px-4 py-2.5 text-[14px] text-[#1c1c1c] placeholder:text-[#1c1c1c]/30 focus:outline-none focus:ring-2 focus:ring-[#1c1c1c]/20"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-medium text-[#1c1c1c]/60 uppercase tracking-wider">
                                State
                            </label>
                            <input
                                type="text"
                                required
                                placeholder="Punjab"
                                value={state}
                                onChange={(e) => setState(e.target.value)}
                                className="mt-1 w-full rounded-xl border border-[#e2dbce] bg-[#e8e3da] px-4 py-2.5 text-[14px] text-[#1c1c1c] placeholder:text-[#1c1c1c]/30 focus:outline-none focus:ring-2 focus:ring-[#1c1c1c]/20"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-xs font-medium text-[#1c1c1c]/60 uppercase tracking-wider">
                                Pincode
                            </label>
                            <input
                                type="text"
                                required
                                placeholder="160001"
                                value={zip}
                                onChange={(e) => setZip(e.target.value)}
                                className="mt-1 w-full rounded-xl border border-[#e2dbce] bg-[#e8e3da] px-4 py-2.5 text-[14px] text-[#1c1c1c] placeholder:text-[#1c1c1c]/30 focus:outline-none focus:ring-2 focus:ring-[#1c1c1c]/20"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-medium text-[#1c1c1c]/60 uppercase tracking-wider">
                                Phone
                            </label>
                            <input
                                type="tel"
                                required
                                placeholder="+91 98765 43210"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="mt-1 w-full rounded-xl border border-[#e2dbce] bg-[#e8e3da] px-4 py-2.5 text-[14px] text-[#1c1c1c] placeholder:text-[#1c1c1c]/30 focus:outline-none focus:ring-2 focus:ring-[#1c1c1c]/20"
                            />
                        </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-2.5 rounded-xl border border-[#e2dbce] text-[#1c1c1c]/70 text-[14px] font-medium hover:bg-[#e8e3da] transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className="flex-1 py-2.5 rounded-xl bg-[#1c1c1c] text-[#f4f1ea] text-[14px] font-medium hover:bg-[#1c1c1c]/80 transition-colors disabled:opacity-50"
                        >
                            {saving ? 'Saving...' : 'Save Address'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
