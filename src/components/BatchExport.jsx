import React, { useMemo, useState } from 'react'

const BatchExport = ({ td, onSelectionChange }) => {
  const [startDate, setStartDate] = useState(() => {
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    return `${year}-${month}-01`
  })

  const [endDate, setEndDate] = useState(() => {
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const day = String(now.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  })

  const [search, setSearch] = useState('')
  const [selectedIds, setSelectedIds] = useState([])

  const filteredTdArr = useMemo(() => {
    if (!td || td.length === 0) return []

    const start = new Date(startDate)
    start.setHours(0, 0, 0, 0)
    const end = new Date(endDate)
    end.setHours(23, 59, 59, 999)

    return td.filter((t) => {
      const itemTime = new Date(t.createdAt).getTime()
      const inRange = itemTime >= start.getTime() && itemTime <= end.getTime()
      const q = search.toLowerCase()
      const matchesSearch =
        !q ||
        t.applicantName?.toLowerCase().includes(q) ||
        t.beat?.toLowerCase().includes(q)
      return inRange && matchesSearch
    })
  }, [td, startDate, endDate, search])

  const allSelected =
    filteredTdArr.length > 0 &&
    filteredTdArr.every((t) => selectedIds.includes(t._id))

  const toggleAll = () => {
    if (allSelected) {
      const ids = filteredTdArr.map((t) => t._id)
      const next = selectedIds.filter((id) => !ids.includes(id))
      setSelectedIds(next)
      onSelectionChange?.(td.filter((t) => next.includes(t._id)))
    } else {
      const ids = [...new Set([...selectedIds, ...filteredTdArr.map((t) => t._id)])]
      setSelectedIds(ids)
      onSelectionChange?.(td.filter((t) => ids.includes(t._id)))
    }
  }

  const toggleOne = (id) => {
    const next = selectedIds.includes(id)
      ? selectedIds.filter((x) => x !== id)
      : [...selectedIds, id]
    setSelectedIds(next)
    onSelectionChange?.(td.filter((t) => next.includes(t._id)))
  }

  return (
    <div className="w-full">
      {/* Date Range */}
      <p className="w-full text-sm text-[#888780] font-bold h-6">DATE RANGE</p>
      <div className="w-full flex gap-2">
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="outline-none text-[12px] border-[0.5px] bg-[#222220] border-[#ffffff26] w-full rounded-lg h-9 px-4 py-2"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="outline-none text-[12px] border-[0.5px] bg-[#222220] border-[#ffffff26] w-full rounded-lg h-9 px-4 py-2"
        />
      </div>

      {/* Search */}
      <p className="w-full text-sm text-[#888780] font-bold h-6 mt-3">SEARCH</p>
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by name or beat..."
        className="outline-none text-[12px] border-[0.5px] bg-[#222220] border-[#ffffff26] w-full rounded-lg h-9 px-4 py-2"
      />

      {/* Record count */}
      <div className="w-full flex justify-between px-4 py-2 items-center mt-3 bg-[#1a1a18] border-[0.5px] border-[#ffffff14] rounded-lg">
        <p className="text-[#888780] text-sm">Records found</p>
        <p className="flex items-center gap-1">
          <span className="text-[#f0ede8] text-sm">{filteredTdArr.length}</span>
          <span className="text-[#888780] text-xs">records</span>
          {selectedIds.length > 0 && (
            <span className="ml-2 text-[#c0dd97] text-xs">
              · {selectedIds.length} selected
            </span>
          )}
        </p>
      </div>

      {/* Table */}
      <div className="w-full m-auto bg-[#222220] rounded-lg border border-white/8 overflow-hidden mt-3">
        {filteredTdArr.length > 0 ? (
          <table className="w-full border-collapse text-[10px]" style={{ tableLayout: 'fixed' }}>
            <thead>
              <tr className="bg-[#1a1a18] border-b border-white/8">
                <th className="w-[6%] py-2 px-2 text-center text-[#888780] font-medium">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={toggleAll}
                    className="accent-[#c0dd97] cursor-pointer"
                  />
                </th>
                <th className="w-[6%] py-2 px-2 text-left text-[#888780] font-medium">#</th>
                <th className="w-[24%] py-2 px-1 text-left text-[#888780] font-medium">Applicant</th>
                <th className="w-[12%] py-2 px-1 text-center text-[#888780] font-medium">Beat</th>
                <th className="w-[12%] py-2 px-1 text-center text-[#888780] font-medium">Species</th>
                <th className="w-[10%] py-2 px-1 text-center text-[#888780] font-medium">Class</th>
                <th className="w-[15%] py-2 px-1 text-center text-[#888780] font-medium">Standing (m³)</th>
                <th className="w-[15%] py-2 px-1 text-center text-[#888780] font-medium">Converted (m³)</th>
              </tr>
            </thead>
            <tbody>
              {filteredTdArr.map((item, i) => {
                const isSelected = selectedIds.includes(item._id)
                return (
                  <tr
                    key={item._id}
                    className={`border-b border-white/4 last:border-b-0 cursor-pointer transition-colors ${
                      isSelected ? 'bg-[#152e05]' : 'hover:bg-[#1a1a18]'
                    }`}
                    onClick={() => toggleOne(item._id)}
                  >
                    <td className="py-2 px-2 text-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleOne(item._id)}
                        onClick={(e) => e.stopPropagation()}
                        className="accent-[#c0dd97] cursor-pointer"
                      />
                    </td>
                    <td className="py-2 px-2 text-left text-[#888780]">{i + 1}</td>
                    <td className="py-2 px-1 text-left text-[#b4b2a9]">
                      <p className="truncate">{item.applicantName}</p>
                      <p className="text-[#888780] truncate">
                        F/o {item.fathersName} · {item.address}
                      </p>
                    </td>
                    <td className="py-2 px-1 text-center text-[#b4b2a9]">{item.beat}</td>
                    <td className="py-2 px-1 text-center text-[#b4b2a9]">
                      {item.treeDetails?.map((t) => t.species).join(', ')}
                    </td>
                    <td className="py-2 px-1 text-center text-[#b4b2a9]">
                      {item.treeDetails?.map((t) => t.class).join(', ')}
                    </td>
                    <td className="py-2 px-1 text-center text-[#b4b2a9]">{item.standingVolume}</td>
                    <td className="py-2 px-1 text-center text-[#c0dd97] font-medium">
                      {item.convertedVolume}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        ) : (
          <p className="text-center text-[#888780] text-xs py-6">
            No records found in this date range
          </p>
        )}
      </div>
    </div>
  )
}

export default BatchExport