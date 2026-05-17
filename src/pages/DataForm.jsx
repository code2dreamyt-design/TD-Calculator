import React, { useEffect, useRef, useState } from "react";
import Header from "../components/Header";
import NavBottom from "../components/NavBottom";
import { useForm, Controller } from "react-hook-form";
import tdStore from "../stores/useTdStore";
import { useNavigate } from "react-router-dom";

const compartmentOptions = [
  "C.no. 3 Pharog",
  "C.no. 4a Hastari",
  "C.no. 4b Hastari",
  "C.no. 5a Dhanoti",
  "C.no. 5b Dhanoti",
  "UF Lambidhar",
  "UF Sholdu",
  "UF Umladwar",
];

const DataForm = () => {
  const { tdDetails, setTdDetails } = tdStore();
  const navigate = useNavigate({});
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const [treeArr, setTreeArr] = useState(() =>
    Array.from({ length: tdDetails.treeCount || 1 }, (_, i) => i + 1)
  );

  const {
    register,
    unregister,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      applicantName: tdDetails.applicantName,
      fathersName: tdDetails.fathersName,
      address: tdDetails.address,
      markingNo:tdDetails.markingNo,
      isFreeGrant: tdDetails.isFreeGrant ?? false,
      freeGrantStatus: tdDetails.freeGrantStatus ?? "",
      range: tdDetails.range,
      beat: tdDetails.beat,
      compartment: Array.isArray(tdDetails.compartment)
        ? tdDetails.compartment
        : tdDetails.compartment
        ? [tdDetails.compartment]
        : [],
      treeCount: tdDetails.treeCount || 1,
      trees: tdDetails.treeDetails.map((tree) => ({
        species: tree.species,
        class: tree.class,
      })),
    },
  });

  const isFreeGrant = watch("isFreeGrant");

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const stdVol = {
    Deodar: { IV: 0.3, III: 0.6, IIA: 1.3, IIB: 2.1, IA: 3.66, IB: 5.5, IC: 7, ID: 8.25, IE: 8.25 },
    Kail:   { IV: 0.35, III: 0.7, IIA: 1.6, IIB: 2.42, IA: 3.63, IB: 5.1, IC: 6.65, ID: 9.75, IE: 9.75 },
    Rai:    { IV: 0.32, III: 0.7, IIA: 1.58, IIB: 3.02, IA: 5.5, IB: 7.3, IC: 9.35, ID: 10.92, IE: 10.92 },
    Tosh:   { IV: 0.3, III: 0.72, IIA: 1.6, IIB: 2.85, IA: 4.92, IB: 7.3, IC: 10.2, ID: 12.85, IE: 12.85 },
    Chil:   { IV: 0.3, III: 0.85, IIA: 1.6, IIB: 2.95, IA: 4.45, IB: 6.02, IC: 7.5, ID: 9.65, IE: 9.65 },
  };

  const colorArr = ["bg-[#185fa5]", "bg-[#0f6e56]", "bg-[#854f0b]", "bg-[#993c1d]"];

  const treeDetailsSec = (value) => {
    const newCount = parseInt(value);
    const oldCount = treeArr.length;
    if (newCount < oldCount) {
      for (let i = newCount; i < oldCount; i++) {
        unregister(`trees.${i}.species`);
        unregister(`trees.${i}.class`);
      }
    }
    setTreeArr(Array.from({ length: newCount }, (_, i) => i + 1));
  };

  const updateData = (data) => {
    let totalStdVol = 0;
    const treeData = data.trees.map((tree) => {
      const vol = stdVol[tree.species][tree.class];
      totalStdVol += vol;
      return { _id: crypto.randomUUID(), ...tree };
    });
    setTdDetails({
      applicantName: data.applicantName,
      fathersName: data.fathersName,
      address: data.address,
      markingNo:data.markingNo,
      range: data.range,
      beat: data.beat,
      compartment: data.compartment,
      treeCount: parseInt(data.treeCount),
      treeDetails: treeData,
      standingVolume: totalStdVol.toFixed(2),
      createdAt: new Date().toISOString(),
      isFreeGrant: data.isFreeGrant,
      freeGrantStatus: data.isFreeGrant ? (data.freeGrantStatus || "Free Grant") : "Paid",
    });
    navigate("/calculator");
  };

  return (
    <form
      className="h-full w-full lg:w-[80%] lg:m-auto text-[#f0ede8] bg-[#2c2c2a]"
      onSubmit={handleSubmit(updateData)}
    >
      <div className="h-[8%] w-full">
        <Header />
      </div>

      <div className="h-[71%] w-full overflow-y-auto mb-4 flex flex-col items-center">

        {/* Applicant details */}
        <div className="pt-2 pb-2 border-b-[0.5px] border-[#b4b2a963] w-[90%] lg:w-[60%] flex flex-col justify-around mt-2">
          <p className="text-[#888780] text-sm mb-2">APPLICANT DETAILS</p>

          {/* Applicant name */}
          <div className="w-full mt-2">
            <p className="text-[#b4b2a9] text-xs">Applicant name</p>
            <input
              type="text"
              {...register("applicantName", { required: { value: true, message: "Enter applicant name" } })}
              className="w-full bg-[#222220] text-[#f0ede8] rounded-[10px] outline-none px-2 py-3 text-sm border-[0.5px] border-[#b4b2a963] mt-1 mb-1"
              placeholder="e.g. Ramesh Kumar"
            />
            {errors.applicantName && <p className="text-red-400 text-xs mb-1">{errors.applicantName.message}</p>}
          </div>

          {/* Father's name */}
          <div className="w-full mt-2">
            <p className="text-[#b4b2a9] text-xs">Father's name</p>
            <input
              type="text"
              {...register("fathersName", { required: { value: true, message: "Enter father's name" } })}
              className="w-full bg-[#222220] text-[#f0ede8] rounded-[10px] outline-none px-2 py-3 text-sm border-[0.5px] border-[#b4b2a963] mt-1 mb-1"
              placeholder="e.g. Suresh Kumar"
            />
            {errors.fathersName && <p className="text-red-400 text-xs mb-1">{errors.fathersName.message}</p>}
          </div>

          {/* Address */}
          <div className="w-full mt-2">
            <p className="text-[#b4b2a9] text-xs">Address</p>
            <input
              type="text"
              {...register("address", { required: { value: true, message: "Enter applicant's address" } })}
              className="w-full bg-[#222220] text-[#f0ede8] rounded-[10px] outline-none px-2 py-3 text-sm border-[0.5px] border-[#b4b2a963] mt-1 mb-1"
              placeholder="e.g. Khalawan"
            />
            {errors.address && <p className="text-red-400 text-xs mb-1">{errors.address.message}</p>}
          </div>

          {/* marking number*/}
          <div className="w-full mt-2">
            <p className="text-[#b4b2a9] text-xs">Marking number</p>
            <input
              type="text"
              {...register("markingNo", { required: { value: true, message: "Enter Marking No." } })}
              className="w-full bg-[#222220] text-[#f0ede8] rounded-[10px] outline-none px-2 py-3 text-sm border-[0.5px] border-[#b4b2a963] mt-1 mb-1"
              placeholder="e.g. 12,13 / 2025"
            />
            {errors.address && <p className="text-red-400 text-xs mb-1">{errors.address.message}</p>}
          </div>
          {/* Status / Free grant */}
          <div className="w-full mt-2">
            <p className="text-[#b4b2a9] text-xs">Status</p>

            {/* Free grant checkbox */}
            <Controller
              name="isFreeGrant"
              control={control}
              render={({ field }) => (
                <label className="flex items-center gap-2 cursor-pointer mt-2 mb-2">
                  <input
                    type="checkbox"
                    checked={field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                    className="accent-[#c0dd97] w-4 h-4"
                  />
                  <span className="text-sm text-[#b4b2a9]">Free grant</span>
                </label>
              )}
            />

            {/* Status input */}
            <input
              type="text"
              {...register("freeGrantStatus")}
              disabled={!isFreeGrant}
              placeholder={isFreeGrant ? "Enter grant details e.g. Order No. 123" : "Paid"}
              className={`w-full rounded-[10px] outline-none px-2 py-3 text-sm border-[0.5px] transition-colors ${
                isFreeGrant
                  ? "bg-[#222220] text-[#f0ede8] border-[#b4b2a963]"
                  : "bg-[#1a1a18] text-[#888780] border-[#ffffff14] cursor-not-allowed"
              }`}
            />
          </div>
        </div>

        {/* Forest details */}
        <div className="pt-2 pb-2 border-b-[0.5px] border-[#b4b2a963] w-[90%] lg:w-[60%] flex flex-col justify-around mt-2">
          <p className="text-[#888780] text-sm mb-2">FOREST DETAILS</p>
          <div className="w-full flex justify-between">
            <div className="w-[45%]">
              <p className="text-[#b4b2a9] text-xs">Forest Range</p>
              <select
                {...register("range", { required: { value: true, message: "Select your Range" } })}
                className="w-full bg-[#222220] text-[#f0ede8] rounded-[10px] outline-none px-2 py-3 text-sm border-[0.5px] border-[#b4b2a963] mt-1 mb-2"
              >
                <option value="Tikkar">Tikkar</option>
              </select>
            </div>
            <div className="w-[45%]">
              <p className="text-[#b4b2a9] text-xs">Beat name</p>
              <select
                {...register("beat", { required: { value: true, message: "Select your beat" } })}
                className="w-full bg-[#222220] text-[#f0ede8] rounded-[10px] outline-none px-2 py-3 text-sm border-[0.5px] border-[#b4b2a963] mt-1 mb-2"
              >
                <option value="Pharog">Pharog</option>
              </select>
            </div>
          </div>

          <div className="w-full flex justify-between items-start">

            {/* Multi-select compartment */}
            <div className="w-[45%]">
              <p className="text-[#b4b2a9] text-xs">Forest compartment</p>
              <Controller
                name="compartment"
                control={control}
                rules={{ validate: (v) => v?.length > 0 || "Select at least one compartment" }}
                render={({ field }) => {
                  const selected = field.value ?? [];
                  const toggle = (val) => {
                    const next = selected.includes(val)
                      ? selected.filter((x) => x !== val)
                      : [...selected, val];
                    field.onChange(next);
                  };
                  return (
                    <div ref={dropdownRef} className="relative mt-1 mb-2">
                      <button
                        type="button"
                        onClick={() => setDropdownOpen((o) => !o)}
                        className="w-full bg-[#222220] text-left text-[#f0ede8] rounded-[10px] outline-none px-2 py-3 text-sm border-[0.5px] border-[#b4b2a963] flex justify-between items-center"
                      >
                        <span className={`truncate ${selected.length === 0 ? "text-[#888780]" : ""}`}>
                          {selected.length === 0
                            ? "Select"
                            : selected.length === 1
                            ? selected[0]
                            : `${selected.length} selected`}
                        </span>
                        <span className="text-[#888780] text-[10px] ml-1 shrink-0">
                          {dropdownOpen ? "▲" : "▼"}
                        </span>
                      </button>

                      {dropdownOpen && (
                        <div className="absolute z-50 mt-1 w-[200%] bg-[#1a1a18] border-[0.5px] border-[#ffffff26] rounded-[10px] overflow-hidden shadow-xl">
                          {compartmentOptions.map((c) => {
                            const checked = selected.includes(c);
                            return (
                              <label
                                key={c}
                                className={`flex items-center gap-3 px-3 py-2.5 cursor-pointer text-sm transition-colors ${
                                  checked
                                    ? "bg-[#152e05] text-[#c0dd97]"
                                    : "text-[#b4b2a9] hover:bg-[#222220]"
                                }`}
                              >
                                <input
                                  type="checkbox"
                                  checked={checked}
                                  onChange={() => toggle(c)}
                                  className="accent-[#c0dd97] w-3.5 h-3.5 shrink-0"
                                />
                                {c}
                              </label>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                }}
              />
              {errors.compartment && (
                <p className="text-red-400 text-xs">{errors.compartment.message}</p>
              )}
            </div>

            {/* No. of trees */}
            <div className="w-[45%]">
              <p className="text-[#b4b2a9] text-xs">No. of trees</p>
              <select
                {...register("treeCount", { required: { value: true, message: "Select number of trees" } })}
                className="w-full bg-[#222220] text-[#f0ede8] rounded-[10px] outline-none px-2 py-3 text-sm border-[0.5px] border-[#b4b2a963] mt-1 mb-2"
                onChange={(e) => treeDetailsSec(e.target.value)}
              >
                <option value={1}>1 tree</option>
                <option value={2}>2 trees</option>
                <option value={3}>3 trees</option>
                <option value={4}>4 trees</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tree details */}
        <div className="pt-2 pb-2 border-b-[0.5px] border-[#b4b2a963] w-[90%] lg:w-[60%] flex flex-col justify-around mt-2">
          <p className="text-[#888780] text-sm">TREE DETAILS</p>
          {treeArr?.map((num) => (
            <div
              key={num}
              className="w-full p-3 bg-[#222220] rounded-[10px] border-[0.5px] border-[#b4b2a963] mt-2 mb-2"
            >
              <p className="text-[#b4b2a9] text-sm mb-1 flex items-center">
                <span className={`w-2 h-2 ${colorArr[num - 1]} rounded-full mr-1.5`}></span>
                Tree {num}
              </p>
              <div className="flex w-full justify-between">
                <div className="w-[45%]">
                  <p className="text-[#b4b2a9] text-xs">Species</p>
                  <select
                    {...register(`trees.${num - 1}.species`, { required: { value: true, message: "Select species" } })}
                    className="w-full bg-[#222220] text-[#f0ede8] rounded-[10px] outline-none px-2 py-3 text-sm border-[0.5px] border-[#b4b2a963] mt-2 mb-1"
                  >
                    <option value="Kail">Kail</option>
                    <option value="Deodar">Deodar</option>
                    <option value="Rai">Rai</option>
                    <option value="Tosh">Tosh</option>
                    <option value="Chil">Chil</option>
                  </select>
                </div>
                <div className="w-[45%]">
                  <p className="text-[#b4b2a9] text-xs">Class</p>
                  <select
                    {...register(`trees.${num - 1}.class`, { required: { value: true, message: "Select class" } })}
                    className="w-full bg-[#222220] text-[#f0ede8] rounded-[10px] outline-none px-2 py-3 text-sm border-[0.5px] border-[#b4b2a963] mt-2 mb-1"
                  >
                    <option value="IV">IV</option>
                    <option value="III">III</option>
                    <option value="IIA">IIA</option>
                    <option value="IIB">IIB</option>
                    <option value="IA">IA</option>
                    <option value="IB">IB</option>
                    <option value="IC">IC</option>
                    <option value="ID">ID</option>
                    <option value="IE">Over 100</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="h-[10%] w-full lg:w-[60%] lg:m-auto border-t-2 border-white/10 flex justify-around items-center">
        <button
          type="submit"
          className="w-[90%] cursor-pointer h-12 border-[0.5px] border-[#185fa5] rounded-[10px] bg-[#042c53] text-[#b5d4f4] hover:bg-[#152e05]"
        >
          Save & continue to sizes →
        </button>
      </div>
      <div className="h-[10%] w-full">
        <NavBottom />
      </div>
    </form>
  );
};

export default DataForm;