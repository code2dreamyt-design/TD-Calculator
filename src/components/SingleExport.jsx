import React, { useState } from 'react'

const SingleExport = ({ td, onSelect }) => {
  const [search, setSearch] = useState('')
  const [selectedId, setSelectedId] = useState(null)

  if (!td || td.length === 0) {
    return (
      <p className="text-center text-[#888780] text-xs py-6">No records available</p>
    )
  }

  const filtered = td.filter((t) => {
    const q = search.toLowerCase()
    return (
      !q ||
      t.applicantName?.toLowerCase().includes(q) ||
      t.address?.toLowerCase().includes(q) ||
      t.beat?.toLowerCase().includes(q)
    )
  })

  const handleSelect = (record) => {
    setSelectedId(record._id)
    onSelect?.(record)
  }

  const formatDate = (iso) => {
    if (!iso) return ''
    return new Date(iso).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  }

  return (
    <div className="w-full">
      <p className="w-full text-sm text-[#888780] font-bold h-6">SELECT RECORD</p>

      <p className="text-[12px] font-bold text-[#b4b2a9] h-6">Search applicant</p>
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="outline-none text-[12px] border-[0.5px] bg-[#222220] border-[#ffffff26] w-full rounded-lg h-9 px-4 py-2"
        placeholder="Name, address or beat"
      />

      <div className="w-full mt-3 flex flex-col gap-3">
        <p className="w-full text-sm text-[#888780] font-bold h-6">PREVIEW</p>

        {filtered.length === 0 && (
          <p className="text-center text-[#888780] text-xs py-4">No matching records</p>
        )}

        {filtered.map((record) => {
          const isSelected = selectedId === record._id
          return (
            <div
              key={record._id}
              className={`w-full bg-[#222220] p-4 rounded-lg border-[0.5px] transition-colors ${
                isSelected ? 'border-[#3b6d11]' : 'border-[#ffffff14]'
              }`}
            >
              {/* Header row */}
              <div className="w-full flex justify-between items-center mb-2">
                <div className="w-[70%] flex flex-col">
                  <p className="text-sm text-[#f0ede8]">{record.applicantName}</p>
                  <p className="text-xs text-[#888780]">
                    <span className="mr-1">S/o {record.fathersName}</span>·
                    <span className="ml-1">R/o {record.address}</span>
                  </p>
                </div>
                <p className="text-[#888780] text-[12px]">{formatDate(record.createdAt)}</p>
              </div>

              {/* Range / Beat / Compartment */}
              <div className="w-full flex border-y-[0.5px] border-[#ffffff26]">
                <div className="w-1/3 text-center border-r-[0.5px] py-1 border-[#ffffff26]">
                  <p className="text-xs text-[#888780] mb-1">Range</p>
                  <p className="text-xs text-[#b4b2a9]">{record.range}</p>
                </div>
                <div className="w-1/3 text-center border-r-[0.5px] py-1 border-[#ffffff26]">
                  <p className="text-xs text-[#888780] mb-1">Beat</p>
                  <p className="text-xs text-[#b4b2a9]">{record.beat}</p>
                </div>
                <div className="w-1/3 text-center py-1">
                  <p className="text-xs text-[#888780] mb-1">Compartment</p>
                  <p className="text-xs text-[#b4b2a9]">{record.compartment}</p>
                </div>
              </div>

              {/* Trees & Volume */}
              <div className="w-full mt-3">
                <p className="w-full flex justify-between py-2 border-b-[0.5px] border-[#ffffff26]">
                  <span className="text-xs text-[#888780]">Trees</span>
                  <span className="text-xs text-[#b4b2a9]">
                    {record.treeDetails?.map((t) => `${t.class}·${t.species}`).join(', ')}
                  </span>
                </p>
                <p className="w-full flex justify-between py-2 border-b-[0.5px] border-[#ffffff26]">
                  <span className="text-xs text-[#888780]">Standing Vol</span>
                  <span className="text-xs text-[#b4b2a9]">{record.standingVolume} m³</span>
                </p>
                <p className="w-full flex justify-between py-2 border-b-[0.5px] border-[#ffffff26]">
                  <span className="text-xs text-[#888780]">Converted Vol</span>
                  <span className="text-xs text-[#c0dd97]">{record.convertedVolume} m³</span>
                </p>
              </div>

              {/* Select button */}
              <div className="w-full flex justify-center mt-3">
                <button
                  onClick={() => handleSelect(record)}
                  className={`p-2 w-1/2 rounded-lg border-[0.5px] text-xs transition-colors ${
                    isSelected
                      ? 'bg-[#152e05] border-[#3b6d11] text-[#c0dd97]'
                      : 'border-white/10 bg-[#1a1a18] hover:bg-[#2a2a28] text-[#888780]'
                  }`}
                >
                  {isSelected ? '✓ Selected' : 'Select record'}
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default SingleExport