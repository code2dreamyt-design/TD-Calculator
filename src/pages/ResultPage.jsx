import React, { useState } from "react";
import Header from "../components/Header";
import NavBottom from "../components/NavBottom";
import tdStore from "../stores/useTdStore";
import { useNavigate } from "react-router-dom";

const ResultPage = () => {
  const { tdDetails, resetTd } = tdStore();
  const [msg, setMsg] = useState("");
  
  const navigate = useNavigate();

  const [treeSizeArr] = useState(() => {
    const trees = tdDetails?.treeDetails || [];
    const counts = {};
    for (let tree of trees) {
      counts[tree.species] = (counts[tree.species] || 0) + 1;
    }
    return Object.keys(counts).map((species) => ({
      species,
      count: counts[species],
    }));
  });

  const confirmSave = () => {
    const savedData = JSON.parse(localStorage.getItem("tdRecords"));
    return !!savedData?.find((data) => data._id === tdDetails._id);
  };

  const saveData = async () => {
    try {
      const rawData = localStorage.getItem("tdRecords");
      const existing = rawData ? JSON.parse(rawData) : [];
      const isCopy = existing.find((item) => item._id === tdDetails._id);

      if (isCopy) {
        const hasChanges =
          isCopy.applicantName !== tdDetails.applicantName ||
          isCopy.fathersName !== tdDetails.fathersName ||
          isCopy.address !== tdDetails.address ||
          isCopy.markingNo !== tdDetails.markingNo ||
          isCopy.range !== tdDetails.range ||
          isCopy.beat !== tdDetails.beat ||
          isCopy.treeCount !== tdDetails.treeCount ||
          isCopy.conversion !== tdDetails.conversion ||
          isCopy.isFreeGrant !== tdDetails.isFreeGrant ||
          isCopy.freeGrantStatus !== tdDetails.freeGrantStatus ||
          JSON.stringify(isCopy.compartment) !== JSON.stringify(tdDetails.compartment) ||
          tdDetails.treeDetails?.some((tree, index) => {
            const oldTree = isCopy.treeDetails[index];
            return (
              tree.species !== oldTree?.species ||
              tree.class !== oldTree?.class
            );
          }) ||
          isCopy.sizes.length !== tdDetails.sizes.length ||
          tdDetails.sizes.some((size, index) => {
            const oldSize = isCopy.sizes[index];
            return (
              size.length !== oldSize?.length ||
              size.width !== oldSize?.width ||
              size.thickness !== oldSize?.thickness ||
              size.qty !== oldSize?.qty
            );
          });

        if (!hasChanges) {
          alert("TD Already Saved");
          resetTd();
          navigate("/details");
          return;
        }

        const newTdArr = existing.map((item) =>
          item._id === tdDetails._id ? tdDetails : item
        );
        localStorage.setItem("tdRecords", JSON.stringify(newTdArr));
        if (!confirmSave()) { setMsg("Error saving TD"); return; }
        navigate("/history");
        return;
      }

      const updatedRecords = [
        ...existing,
        { ...tdDetails, createdAt: new Date().toISOString() },
      ];
      localStorage.setItem("tdRecords", JSON.stringify(updatedRecords));
      if (!confirmSave()) { setMsg("Error saving TD"); return; }
      navigate("/history");
    } catch (error) {
      console.error("Save failed:", error);
      setMsg("A system error occurred while saving.");
    }
  };

  const colorArr = [
    { bg: "bg-[#042c53]", bg_pt: "bg-[#185fa5]", text: "text-[#b5d4f4]", border: "border-[#185fa5]" },
    { bg: "bg-[#0f3d2e]", bg_pt: "bg-[#0f6e56]", text: "text-[#5dcaa5]", border: "border-[#0f6e56]" },
    { bg: "bg-[#2e1f06]", bg_pt: "bg-[#854f0b]", text: "text-[#fac775]", border: "border-[#854f0b]" },
    { bg: "bg-[#2e1208]", bg_pt: "bg-[#d85a30]", text: "text-[#f0997b]", border: "border-[#993c1d]" },
  ];

  // ✅ Fixed: parse to float before comparing
  const conversionNum = parseFloat(tdDetails.conversion) || 0;
  const withinLimit = conversionNum < 65;

  return (
    <div className="h-full w-full lg:w-[80%] lg:m-auto text-[#f0ede8] bg-[#2c2c2a]">
      <div className="h-[8%] w-full">
        <Header />
      </div>

      {/* ✅ Header bar with marking no. top right */}
      <div className="w-full h-[8%] py-1 flex justify-center items-center bg-[#1a1a18]">
        <div className="w-[90%] h-full flex flex-col justify-around">
          <div className="w-full flex justify-between items-center">
            <p className="text-sm font-bold">{tdDetails?.applicantName}</p>
            {/* Marking No. badge */}
            {tdDetails.markingNo && (
              <div className="flex items-center gap-1.5 px-2 py-0.5">
                <span className="text-[10px] text-[#888780]">Marking :</span>
                <span className="text-[11px] font-bold text-[#888780]">
                  {tdDetails.markingNo}
                </span>
              </div>
            )}
          </div>
          <div className="text-[10px] font-bold flex">
            {tdDetails.treeDetails.map((tree, i) => (
              <div
                key={tree._id}
                className={`flex items-center py-1 px-2 rounded-2xl border-[0.5px] mr-2.5 ${colorArr[i].border} ${colorArr[i].bg} ${colorArr[i].text}`}
              >
                <div className={`w-2 h-2 rounded-full ${colorArr[i].bg_pt} mr-1`}></div>
                <p>{tree.class} {tree.species}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="h-[64%] w-full overflow-y-auto mt-4">
        {/* Sizes table */}
        <div className="w-[90%] m-auto bg-[#222220] rounded-lg border border-white/8 overflow-hidden">
          <table className="w-full border-collapse text-[10px]" style={{ tableLayout: "fixed" }}>
            <thead>
              <tr className="bg-[#1a1a18] border-b border-white/8">
                <th className="w-[14%] py-1.75 px-1.25 pl-2.5 text-left text-[#888780] font-medium">#</th>
                <th className="w-[11%] py-1.75 px-1.25 text-center text-[#888780] font-medium">L(m)</th>
                <th className="w-[11%] py-1.75 px-1.25 text-center text-[#888780] font-medium">W(m)</th>
                <th className="w-[11%] py-1.75 px-1.25 text-center text-[#888780] font-medium">T(m)</th>
                <th className="w-[11%] py-1.75 px-1.25 text-center text-[#888780] font-medium">V/unit(m³)</th>
                <th className="w-[21%] py-1.75 px-1.25 text-center text-[#888780] font-medium">Qty(pcs)</th>
                <th className="w-[21%] py-1.75 px-1.25 text-center text-[#888780] font-medium">Total(m³)</th>
              </tr>
            </thead>
            {treeSizeArr.map((trees) => (
              <tbody key={trees.species}>
                <tr className="bg-[#1e1e1c] border-b border-white/6">
                  <td colSpan={7} className="px-2.5 py-1 text-[#888780] text-[9px] uppercase tracking-[0.04em]">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#185fa5] mr-0.75 align-middle" />
                    {trees.species} {trees.count > 1 ? `${trees.count} trees` : `${trees.count} tree`}
                  </td>
                </tr>
                {tdDetails?.sizes
                  ?.filter((size) => size.species === trees.species)
                  .map((size, i) => (
                    <tr key={size._id} className="border-b border-white/4 last:border-b-0">
                      <td className="py-1.5 px-1.25 pl-2.5 text-left text-[#888780]">S{i + 1}</td>
                      <td className="py-1.5 px-1.25 text-center text-[#b4b2a9]">{size.length}</td>
                      <td className="py-1.5 px-1.25 text-center text-[#b4b2a9]">{size.width}</td>
                      <td className="py-1.5 px-1.25 text-center text-[#b4b2a9]">{size.thickness}</td>
                      <td className="py-1.5 px-1.25 text-center text-[#b4b2a9]">{size.volume_unit}</td>
                      <td className="py-1.5 px-1.25 text-center text-[#b4b2a9]">{size.qty}</td>
                      <td className="py-1.5 px-1.25 text-center text-[#c0dd97] font-medium">{size.volume_total}</td>
                    </tr>
                  ))}
              </tbody>
            ))}
          </table>
        </div>

        <div className="w-[90%] m-auto mt-4">
          {/* Summary */}
          <p className="text-[10px] font-medium text-[#888780] uppercase tracking-[0.05em] mb-2">Summary</p>
          <div className="bg-[#222220] rounded-lg border border-white/8 overflow-hidden mb-2">
            {[
              { label: "Total qty",           value: tdDetails.totalSizes,      unit: "pcs" },
              { label: "Total converted vol", value: tdDetails.convertedVolume, unit: "m³" },
              { label: "Total standing vol",  value: tdDetails.standingVolume,  unit: "m³" },
            ].map((row, i, arr) => (
              <div
                key={row.label}
                className={`flex justify-between items-center px-3.5 py-2.5 ${i < arr.length - 1 ? "border-b border-white/6" : ""}`}
              >
                <span className="text-[12px] text-[#888780]">{row.label}</span>
                <span className="text-[13px] font-medium text-[#f0ede8]">
                  {row.value} <span className="text-[10px] text-[#888780] ml-0.5">{row.unit}</span>
                </span>
              </div>
            ))}
          </div>

          <div className="h-px bg-white/8 my-3.5" />

          {/* Conversion */}
          <p className="text-[10px] font-medium text-[#888780] uppercase tracking-[0.05em] mb-2">Conversion</p>
          <div className="bg-[#222220] rounded-lg border border-white/8 overflow-hidden mb-2">
            <div className="flex justify-between items-center px-3.5 py-2.5 border-b border-white/6">
              <span className="text-[12px] text-[#888780]">Conversion rate</span>
              <span className="text-[18px] font-medium text-[#c0dd97]">{tdDetails.conversion} %</span>
            </div>
            <div className="text-[10px] text-[#888780] px-3.5 py-1.5 border-b border-white/6">
              {tdDetails.convertedVolume} ÷ {tdDetails.standingVolume} × 100 = {tdDetails.conversion}%
            </div>
            <div className="bg-[#173404] px-3.5 py-2.5 flex justify-between items-center">
              <span className="text-[11px] text-[#c0dd97] opacity-75">Total converted timber</span>
              <span className="text-[20px] font-medium text-[#c0dd97]">
                {tdDetails.convertedVolume}
                <span className="text-[11px] opacity-60 ml-0.5">m³</span>
              </span>
            </div>
          </div>

          {/* ✅ Fixed limit indicator — uses parseFloat */}
          <div className={`border rounded-lg px-3 py-2 flex items-center gap-2 ${
            withinLimit
              ? "bg-[#173404] border-[#3b6d11]"
              : "bg-[#2e1208] border-[#993c1d]"
          }`}>
            <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 text-[10px] font-medium ${
              withinLimit ? "bg-[#3b6d11] text-[#c0dd97]" : "bg-[#993c1d] text-[#f0997b]"
            }`}>
              {withinLimit ? "✓" : "!"}
            </div>
            <span className={`text-[11px] ${withinLimit ? "text-[#c0dd97]" : "text-[#f0997b]"}`}>
              {withinLimit
                ? `Within limit — ${tdDetails.conversion}% of 65% max`
                : `Limit exceeded — ${tdDetails.conversion}% exceeds 65% max`}
            </span>
          </div>

          {/* Error message */}
          {msg && <p className="text-red-400 text-xs text-center mt-3">{msg}</p>}
        </div>
      </div>

      {/* Footer */}
      <div className="h-[9%] w-full border-t-2 border-white/10 flex justify-center items-center text-sm">
        <div className="w-[90%] flex justify-between h-full items-center">
          <button
            className="w-[30%] cursor-pointer h-12 border-[0.5px] border-white/10 rounded-lg hover:bg-[#242323] text-[#888780]"
            onClick={() => navigate("/calculator")}
          >
            Back
          </button>
          <button
            className="w-[65%] cursor-pointer h-12 border-[0.5px] border-[#185fa5] rounded-lg bg-[#042c53] hover:bg-[#152e05] text-[#b5d4f4]"
            onClick={saveData}
          >
            Save & next
          </button>
        </div>
      </div>

      <div className="h-[10%] w-full">
        <NavBottom />
      </div>
    </div>
  );
};

export default ResultPage;