import React, { useState } from 'react'
import {
  Document, Packer, Paragraph, Table, TableRow, TableCell,
  TextRun, WidthType, AlignmentType, BorderStyle, ShadingType,
  HeadingLevel,
} from 'docx'
import { saveAs } from 'file-saver'
import Header from './Header'
import NavBottom from './NavBottom'
import { FaRegFileWord } from 'react-icons/fa'
import { FaRegFilePdf } from 'react-icons/fa6'
import SingleExport from './SingleExport'
import BatchExport from './BatchExport'

// ── helpers ──────────────────────────────────────────────────────────────────

const cell = (text, opts = {}) =>
  new TableCell({
    shading: opts.shading,
    borders: {
      top:    { style: BorderStyle.SINGLE, size: 4, color: 'CCCCCC' },
      bottom: { style: BorderStyle.SINGLE, size: 4, color: 'CCCCCC' },
      left:   { style: BorderStyle.SINGLE, size: 4, color: 'CCCCCC' },
      right:  { style: BorderStyle.SINGLE, size: 4, color: 'CCCCCC' },
    },
    children: [
      new Paragraph({
        alignment: opts.align ?? AlignmentType.CENTER,
        children: [
          new TextRun({
            text: String(text ?? ''),
            bold: opts.bold ?? false,
            size: opts.size ?? 18,
            color: opts.color ?? '000000',
            font: 'Arial',
          }),
        ],
      }),
    ],
  })

const headerShading = { type: ShadingType.CLEAR, fill: '2C5F2E', color: 'auto' }
const altShading    = { type: ShadingType.CLEAR, fill: 'F2F7F2', color: 'auto' }

const hCell = (text) =>
  cell(text, { bold: true, size: 18, color: 'FFFFFF', shading: headerShading })

// ── Batch Word Doc ────────────────────────────────────────────────────────────

const buildBatchDoc = (records, startDate, endDate) => {
  const fmt = (d) =>
    new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })

  const headerRow = new TableRow({
    tableHeader: true,
    children: [
      hCell('S.No.'),
      hCell('Applicant (Name, F/o, R/o)'),
      hCell('Beat'),
      hCell('Species'),
      hCell('Class'),
      hCell('Standing Vol (m³)'),
      hCell('Converted Vol (m³)'),
    ],
  })

  const dataRows = records.map((r, i) =>
    new TableRow({
      children: [
        cell(i + 1, { shading: i % 2 === 1 ? altShading : undefined }),
        cell(
          `${r.applicantName}, F/o ${r.fathersName}, R/o ${r.address}`,
          { align: AlignmentType.LEFT, shading: i % 2 === 1 ? altShading : undefined }
        ),
        cell(r.beat,            { shading: i % 2 === 1 ? altShading : undefined }),
        cell(r.treeDetails?.map((t) => t.species).join(', '), { shading: i % 2 === 1 ? altShading : undefined }),
        cell(r.treeDetails?.map((t) => t.class).join(', '),   { shading: i % 2 === 1 ? altShading : undefined }),
        cell(r.standingVolume,  { shading: i % 2 === 1 ? altShading : undefined }),
        cell(r.convertedVolume, { shading: i % 2 === 1 ? altShading : undefined }),
      ],
    })
  )

  const table = new Table({
    width: { size: 9360, type: WidthType.DXA },
    rows: [headerRow, ...dataRows],
  })

  return new Document({
    sections: [{
      children: [
        new Paragraph({
          heading: HeadingLevel.HEADING_1,
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: 'Timber Distribution Record', bold: true, size: 32, color: '2C5F2E', font: 'Arial' })],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: `Period: ${fmt(startDate)} – ${fmt(endDate)}`, size: 20, color: '666666', font: 'Arial' })],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: `Total Records: ${records.length}`, size: 20, color: '666666', font: 'Arial' })],
        }),
        new Paragraph({ children: [new TextRun({ text: '' })] }),
        table,
        new Paragraph({ children: [new TextRun({ text: '' })] }),
        new Paragraph({
          alignment: AlignmentType.RIGHT,
          children: [new TextRun({ text: `Generated on: ${fmt(new Date())}`, size: 16, color: '999999', font: 'Arial' })],
        }),
      ],
    }],
  })
}

// ── Single Word Doc ───────────────────────────────────────────────────────────

const buildSingleDoc = (record) => {
  const fmt = (d) =>
    new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })

  const sizes = record.sizes ?? []

  const totalQty   = sizes.reduce((s, x) => s + Number(x.qty ?? 0), 0)
  const grandTotal = sizes.reduce((s, x) => s + Number(x.volume_total ?? 0), 0)

  const sizeHeaderRow = new TableRow({
    tableHeader: true,
    children: [
      hCell('S.No.'),
      hCell('L × W × T (m)'),
      hCell('Vol/Unit (m³)'),
      hCell('Qty'),
      hCell('Total Vol (m³)'),
    ],
  })

  const sizeRows = sizes.map((s, i) =>
    new TableRow({
      children: [
        cell(i + 1,                          { shading: i % 2 === 1 ? altShading : undefined }),
        cell(`${s.length} × ${s.width} × ${s.thickness}`, { shading: i % 2 === 1 ? altShading : undefined }),
        cell(Number(s.volume_unit).toFixed(4),{ shading: i % 2 === 1 ? altShading : undefined }),
        cell(s.qty,                          { shading: i % 2 === 1 ? altShading : undefined }),
        cell(Number(s.volume_total).toFixed(4),{ shading: i % 2 === 1 ? altShading : undefined }),
      ],
    })
  )

  // Total row
  const totalRow = new TableRow({
    children: [
      cell('',        { bold: true, shading: headerShading, color: 'FFFFFF' }),
      cell('TOTAL',   { bold: true, shading: headerShading, color: 'FFFFFF' }),
      cell('',        { bold: true, shading: headerShading, color: 'FFFFFF' }),
      cell(totalQty,  { bold: true, shading: headerShading, color: 'FFFFFF' }),
      cell(grandTotal.toFixed(4), { bold: true, shading: headerShading, color: 'FFFFFF' }),
    ],
  })

  const sizeTable = new Table({
    width: { size: 9360, type: WidthType.DXA },
    rows: [sizeHeaderRow, ...sizeRows, totalRow],
  })

  const line = (label, value) =>
    new Paragraph({
      children: [
        new TextRun({ text: `${label}: `, bold: true, size: 20, font: 'Arial' }),
        new TextRun({ text: String(value ?? ''), size: 20, font: 'Arial' }),
      ],
    })

  return new Document({
    sections: [{
      children: [
        // Title
        new Paragraph({
          heading: HeadingLevel.HEADING_1,
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: 'Timber Distribution Record', bold: true, size: 32, color: '2C5F2E', font: 'Arial' })],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: fmt(record.createdAt), size: 20, color: '666666', font: 'Arial' })],
        }),
        new Paragraph({ children: [new TextRun({ text: '' })] }),

        // Applicant info — one line
        new Paragraph({
          children: [
            new TextRun({
              text: `${record.applicantName}, F/o ${record.fathersName}, R/o ${record.address}, Beat: ${record.beat}`,
              size: 20, font: 'Arial',
            }),
          ],
        }),
        new Paragraph({ children: [new TextRun({ text: '' })] }),

        // Details
        line('Range',       record.range),
        line('Compartment', record.compartment),
        line('Species',     record.treeDetails?.map((t) => `${t.class} · ${t.species}`).join(', ')),
        line('Standing Vol',`${record.standingVolume} m³`),
        line('Converted Vol',`${record.convertedVolume} m³`),
        new Paragraph({ children: [new TextRun({ text: '' })] }),

        // Sizes table
        new Paragraph({
          children: [new TextRun({ text: 'Size Details', bold: true, size: 24, font: 'Arial', color: '2C5F2E' })],
        }),
        new Paragraph({ children: [new TextRun({ text: '' })] }),
        sizeTable,

        new Paragraph({ children: [new TextRun({ text: '' })] }),
        new Paragraph({
          alignment: AlignmentType.RIGHT,
          children: [new TextRun({ text: `Generated on: ${fmt(new Date())}`, size: 16, color: '999999', font: 'Arial' })],
        }),
      ],
    }],
  })
}

// ── ExportOpt ─────────────────────────────────────────────────────────────────

const ExportOpt = () => {
  const [tdList] = useState(() => {
    try {
      const raw = localStorage.getItem('tdRecords')
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) return parsed
      if (parsed && typeof parsed === 'object') return [parsed]
      return []
    } catch {
      return []
    }
  })

  const [isSingle, setIsSingle] = useState(false)
  const [selectedBatch, setSelectedBatch] = useState([])
  const [selectedSingle, setSelectedSingle] = useState(null)

  // Date range state — passed down so Word doc uses same range shown in BatchExport
  const [startDate] = useState(() => {
    const now = new Date()
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`
  })
  const [endDate] = useState(() => {
    const now = new Date()
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
  })

  const exportBatchWord = async () => {
    const toExport = selectedBatch.length > 0 ? selectedBatch : tdList
    if (toExport.length === 0) return
    const doc = buildBatchDoc(toExport, startDate, endDate)
    const blob = await Packer.toBlob(doc)
    saveAs(blob, 'timber-distribution-batch.docx')
  }

  const exportSingleWord = async () => {
    if (!selectedSingle) {
      alert('Please select a record first')
      return
    }
    const doc = buildSingleDoc(selectedSingle)
    const blob = await Packer.toBlob(doc)
    saveAs(blob, `timber-${selectedSingle.applicantName}.docx`)
  }

  const handleExportWord = () => {
    if (isSingle) exportSingleWord()
    else exportBatchWord()
  }

  return (
    <div className="h-full w-full lg:w-[80%] lg:m-auto text-[#f0ede8] bg-[#2c2c2a]">
      <div className="h-[8%] w-full">
        <Header />
      </div>

      {/* Toggle */}
      <div className="h-[9%] w-full flex justify-center items-center text-sm border-b-[0.5px] py-1 border-[#ffffff26]">
        <div className="w-[90%] flex justify-between h-full items-center">
          <button
            className={`w-[48%] cursor-pointer h-12 border-[0.5px] rounded-lg flex justify-center items-center transition-opacity bg-[#152e05] border-[#3b6d11] text-[#c0dd97] ${isSingle ? 'opacity-100' : 'opacity-50'}`}
            onClick={() => setIsSingle(true)}
          >
            Single record
          </button>
          <button
            className={`w-[48%] cursor-pointer h-12 border-[0.5px] rounded-lg flex justify-center items-center transition-opacity bg-[#042c53] border-[#185fa5] text-[#b5d4f4] ${!isSingle ? 'opacity-100' : 'opacity-50'}`}
            onClick={() => setIsSingle(false)}
          >
            Batch export
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="h-[63%] w-full overflow-y-auto mt-4">
        <div className="w-[90%] m-auto">
          {isSingle
            ? <SingleExport td={tdList} onSelect={setSelectedSingle} />
            : <BatchExport  td={tdList} onSelectionChange={setSelectedBatch} />}
        </div>
      </div>

      {/* Export buttons */}
      <div className="h-[9%] w-full border-t-2 border-white/10 flex justify-center items-center text-sm">
        <div className="w-[90%] flex justify-between h-full items-center">
          <button
            onClick={handleExportWord}
            className="w-[48%] cursor-pointer bg-[#152e05] h-12 border-[0.5px] border-[#3b6d11] rounded-lg flex justify-center items-center text-[#c0dd97]"
          >
            <FaRegFileWord className="w-5 h-5 mr-1.5 text-blue-500" />
            Export as Word
          </button>
          <button
            className="w-[48%] cursor-pointer text-[#b5d4f4] h-12 border-[0.5px] border-[#185fa5] rounded-lg bg-[#042c53] flex justify-center items-center opacity-50 cursor-not-allowed"
            disabled
          >
            <FaRegFilePdf className="w-5 h-5 mr-1.5 text-red-700" />
            Export as PDF
          </button>
        </div>
      </div>

      <div className="h-[10%] w-full">
        <NavBottom />
      </div>
    </div>
  )
}

export default ExportOpt