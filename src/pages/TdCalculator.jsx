import React, { useState, useEffect, useMemo } from "react";
import Header from "../components/Header";
import NavBottom from "../components/NavBottom";
import { IoIosCloseCircleOutline } from "react-icons/io";
import tdStore from "../stores/useTdStore";
import { useNavigate } from "react-router-dom";
const TdCalculator = () => {
  const navigate =useNavigate();
  //state to save full info of a applicant
  const { tdDetails, setTdDetails,resetTd } = tdStore();
  const [treeSizeArr] = useState(() => {
    const trees = tdDetails?.treeDetails || [];
    const counts = {};
    for (let tree of trees) {
      const species = tree.species;
      counts[species] = (counts[species] || 0) + 1;
    }

    const treesArr = Object.keys(counts).map((species) => ({
      species,
      count: counts[species],
    }));
    return treesArr;
  });

  const [sizes, setSizes] = useState(() =>{
     const current = tdDetails?.sizes;
     if(current.length>0){
      return tdDetails?.sizes;
     };
  
    const newsizes = (tdDetails?.treeDetails || [])
      .filter(
        (tree, index, self) =>
          self.findIndex((t) => t.species === tree.species) === index,
      )
      .map((tree) => ({
        _id: crypto.randomUUID(),
        species: tree.species,
        length: 0,
        width: 0,
        thickness: 0,
        qty: 0,
        volume_unit: 0,
        volume_total: 0,
      }));
    return newsizes;
    }
  );

  //   const treeSizeArr = useMemo(() => {
  //   const trees = tdDetails?.treeDetails || [];
  //   const counts = {};
  //   for (let tree of trees) {
  //     const species = tree.species;
  //     counts[species] = (counts[species] || 0) + 1;
  //   }

  //   const treesArr = Object.keys(counts).map((species) => ({
  //     species,
  //     count: counts[species],
  //   }));
  //   return treesArr;
  // },[tdDetails]);
  //to update application details
  // const updateDetails = (field, value) => {
  //   console.log(field, value);
  //   setTdDetails((prev) => {
  //     const updated = { ...prev, [field]: value };

  //     if (updated.species.length > 0 && updated.class.length > 0) {
  //       const keySpecies = updated.species;
  //       const keyVol = updated.class;
  //       updated.standingVolume = stdVol[keySpecies][keyVol];
  //     }
  //     return updated;
  //   });
  // };

  //this is used to add and remove the sizes
  const addOrRemoveSize = (action, removeId, species) => {
    if (action === "add") {
      const nextId = crypto.randomUUID();
      const newSize = {
        _id: nextId,
        species: species,
        length: 0,
        width: 0,
        thickness: 0,
        qty: 0,
        volume_unit: 0,
        volume_total: 0,
      };
      setSizes((pre) => {
        return [...pre, newSize];
      });
    }
    if (action === "remove" && removeId) {
      const updateSizes = sizes.filter((size) => size._id !== removeId);
      
      
      setSizes(updateSizes);
      const finalSizes= updateSizes.filter((size)=>size.volume_total!==0&&size.volume_unit!==0);
      let convertedVol = finalSizes.reduce(
        (sum, item) => sum + Number(item.volume_total),
        0,
      );
      let conversionP =((convertedVol / tdDetails.standingVolume)* 100).toFixed(2) ;
      setTdDetails({
      sizes:finalSizes,
      convertedVolume:Number(convertedVol.toFixed(2)),
      conversion:Number(conversionP)
    });
    }
  };



  const updateSize = (id, field, value) => {
    if (sizes.length === 0) return;
    const updateSizes = sizes?.map((item) => {
      if (item._id !== id) return item;
      const updated = { ...item, [field]: value };
      const l = Number(updated.length) || 0;
      const w = Number(updated.width) || 0;
      const t = Number(updated.thickness) || 0;
      const qty = Number(updated.qty) || 0;
      updated.volume_unit = Number(Number(l * w * t).toFixed(2)) || 0;
      updated.volume_total = Number(Number(l * w * t * qty).toFixed(2)) || 0;
      return updated;
    });

    const finalSizes= updateSizes.filter((size)=>size.volume_total!==0&&size.volume_unit!==0);
    let convertedVol = finalSizes.reduce(
      (sum, item) => sum + Number(item.volume_total),
      0,
    );
    const sizesCount = finalSizes.reduce((sum,item)=>sum+Number(item.qty),0);
    let conversionP =(convertedVol / Number(tdDetails.standingVolume)* 100).toFixed(2);
    setSizes(updateSizes);
    
    //console.log(finalSize)
    setTdDetails({
      sizes:finalSizes,
      convertedVolume:Number(convertedVol.toFixed(2)),
      conversion:Number(conversionP),
      totalSizes:sizesCount
    });
    // setTdDetails((prev) => {
    //   console.log("reached")
    //   if (!sizes || sizes.length === 0) return prev;

    //   const updatedSize = prev.sizes.map((size) => {
    //     if (size._id !== id) return size;
    //     const updated = { ...size, [field]: value };
    //     const l = Number(updated.length) || 0;
    //     const w = Number(updated.width) || 0;
    //     const t = Number(updated.thickness) || 0;
    //     const qty = Number(updated.qty) || 0;
    //     updated.volume_unit = (l * w * t).toFixed(3) || 0;
    //     updated.volume_total = (l * w * t * qty).toFixed(3) || 0;
    //     return updated;
    //   });

    //   const convertedVol = updatedSize.reduce(
    //     (sum, item) => sum + Number(item.volume_total || 0),
    //     0,
    //   );
    //   const conversion = prev.standingVolume
    //     ? (convertedVol / prev.standingVolume) * 100
    //     : 0;
    //   return {
    //     ...prev,
    //     sizes: updatedSize,
    //     convertedVolume: convertedVol.toFixed(3),
    //     conversion: conversion.toFixed(2),
    //     totalSizes: updatedSize.length,
    //   };
    // });
  };

  //this is usesd to calculate the tree of each species to get sizes per species


  useEffect(() => {
    console.log(tdDetails);
  }, [tdDetails]);
  const saveData = () => {
    try {
      if(tdDetails.sizes.length===0) return;
      navigate("/results");
    } catch (error) {
      console.log(error);
    }
  };

  const colorArr = [
    {
      bg: "bg-[#042c53] ",
      bg_pt: "bg-[#185fa5]",
      text: "text-[#b5d4f4]",
      border: "border-[#185fa5]",
    },
    {
      bg: "bg-[#0f3d2e]",
      bg_pt: "bg-[#0f6e56]",
      text: "text-[#5dcaa5]",
      border: "border-[#0f6e56] ",
    },
    {
      bg: "bg-[#2e1f06]",
      bg_pt: "bg-[#854f0b]",
      text: "text-[#fac775]",
      border: "border-[#854f0b]",
    },
    {
      bg: "bg-[#2e1208]",
      bg_pt: "bg-[#d85a30]",
      text: "text-[#f0997b]",
      border: "border-[#993c1d]",
    },
  ];

  return (
    <div className="h-full w-full text-[#f0ede8] bg-[#2c2c2a]">
      {/* header of the calculator */}
      <div className="h-[7%] w-full">
        <Header />
      </div>
      <div className="w-full h-[8%] py-1 flex justify-center items-center bg-[#1a1a18]">
        <div className="w-[90%] h-full flex flex-col justify-around">
          <p className="text-sm font-bold">{tdDetails.applicantName || "N/A"} </p>
          <div className="text-[10px] font-bold flex">
            {tdDetails.treeDetails.map((tree, i) => (
              <div
                key={tree._id}
                className={`flex items-center py-1 px-2 rounded-2xl border-[0.5px] mr-2.5 ${colorArr[i].border} ${colorArr[i].bg} ${colorArr[i].text}`}
              >
                <div
                  className={`w-2 h-2 rounded-full ${colorArr[i].bg_pt} mr-1`}
                ></div>
                <p>
                  {tree.class} · {tree.species}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/*---------------------------- main Calculator -------------------------------*/}
      <div className="h-[60%] overflow-y-auto mb-4">
        {/* SIZES */}
        {treeSizeArr?.map((trees, i) => (
          <div
            key={trees.species}
            className=" flex flex-col items-center justify-center mb-2 mt-4"
          >
            {/* ------------Start of the size collectors------------- */}

            <div className="w-full flex flex-col items-center justify-between">
              <p className="w-[90%] flex  items-center text-xs font-bold mb-1.5">
                <span
                  className={`w-2 h-2 rounded-full ${colorArr[i].bg_pt} mr-2`}
                ></span>
                <span className="text-[#f0ede8] ml-1.5"> </span>
                {trees.species}
                <span className="text-xs font-bold text-[#888780] ml-1.5">
                  {trees.count > 1
                    ? trees.count + " " + "trees"
                    : trees.count + " " + "tree" || "N/A"}
                </span>
              </p>
              {sizes
                ?.filter((size) => size.species === trees.species)
                .map((size,i) => (
                  <div
                    key={size._id}
                    className="bg-[#222220] flex flex-col items-center w-[90%] h-36 mt-1.5 rounded-[10px] py-2 "
                  >
                    <p className="w-[95%] text-xs text-[#b4b2a9] h-fit flex justify-between items-center">
                      <span>Size {i+1}</span>{" "}
                      <button
                        className="text-xl cursor-pointer"
                        onClick={() =>
                          addOrRemoveSize("remove", size._id, null)
                        }
                      >
                        {" "}
                        <IoIosCloseCircleOutline />
                      </button>
                    </p>
                    <div className="flex justify-between h-[60%] w-[90%] mt-2">
                      <div className="w-[22%]">
                        <p className="text-xs text-[#888780] text-center mb-1">
                          L(m)
                        </p>
                        <input
                          type="number"
                          className="outline-none bg-[#1A1A18] border-[0.5px] border-[#ffffff1f] w-full px-1.5 text-center rounded-[10px] py-1"
                          value={`${size.length===0 ? "":size.length}`}
                          onChange={(e) =>
                            updateSize(size._id, "length", e.target.value)
                          }
                        />
                      </div>
                      <div className="w-[22%]">
                        <p className="text-xs text-[#888780] text-center mb-1">
                          W(m)
                        </p>
                        <input
                          type="number"
                          className="outline-none bg-[#1A1A18] border-[0.5px] border-[#ffffff1f] w-full px-1.5 text-center rounded-[10px] py-1"
                          value={`${size.width===0 ? "":size.width}`}
                          onChange={(e) =>
                            updateSize(size._id, "width", e.target.value)
                          }
                        />
                      </div>
                      <div className="w-[22%]">
                        <p className="text-xs text-[#888780] text-center mb-1">
                          T(m)
                        </p>
                        <input
                          type="number"
                          className="outline-none bg-[#1A1A18] border-[0.5px] border-[#ffffff1f] w-full px-1.5 text-center rounded-[10px] py-1"
                          value={`${size.thickness===0 ? "":size.thickness}`}
                          onChange={(e) =>
                            updateSize(size._id, "thickness", e.target.value)
                          }
                        />
                      </div>
                      <div className="w-[22%]">
                        <p className="text-xs text-[#888780] text-center mb-1">
                          Qty
                        </p>
                        <input
                          type="number"
                          className="outline-none bg-[#1A1A18] border-[0.5px] border-[#ffffff1f] w-full px-1.5 text-center rounded-[10px] py-1"
                          value={`${size.qty===0 ? "":size.qty}`}
                          onChange={(e) =>
                            updateSize(size._id, "qty", e.target.value)
                          }
                        />
                      </div>
                    </div>
                    <div className="py-1.5 mb-1.5 border-t border-[#ffffff0f] w-[90%] h-[30%] flex justify-between">
                      <div className="w-[48%] h-9 rounded-[10px] bg-[#1A1A18] border-[0.5px] border-[#ffffff1f]  px-1.5 flex justify-between">
                        <p className="text-xs flex items-center text-[#888780]">
                          Vol/unit
                        </p>
                        <span className="text-sm flex items-center text-[#C0DD97]">
                          {size.volume_unit}
                          m³
                        </span>
                      </div>
                      <div className="w-[48%] h-9 bg-[#1A1A18] border-[0.5px] rounded-[10px] border-[#ffffff1f]  px-1.5 flex justify-between">
                        <p className="text-xs h-full flex items-center text-[#888780]">
                          Total vol
                        </p>
                        <span className="text-sm h-full flex items-center text-[#C0DD97]">
                          {size.volume_total}
                          m³
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
            </div>

            {/* -------------Add Button-------------  */}
            <div className="mt-4 w-full flex flex-col justify-center items-center h-15">
              <button
                className=" w-[90%] h-10 border-2  border-white/10 rounded-lg cursor-pointer hover:bg-[#242323]"
                onClick={() => addOrRemoveSize("add", null, trees.species)}
              >
                + Add size
              </button>
              <div className="w-[90%] mt-4   h-px border-b border-white/10"></div>
            </div>
          </div>
        ))}
      </div>
      {/*----------------------main containor ends here------------------------- */}
      {/* -----------clear and calculate------------ */}
      <div className=" w-full h-[4%] flex justify-center  text-[#b4b2a9] mb-1">
        <div className=" w-[90%]  text-[#c0dd97] flex justify-between">
          <div className="w-[48%]  rounded-[10px] bg-[#29530d] border-[0.5px] border-[#ffffff1f]  px-1.5 flex justify-between">
            <p className="text-xs flex items-center text-[#C0DD97]">
              Converted
            </p>
            <span className="text-sm flex items-center text-[#C0DD97]">
              {tdDetails.convertedVolume}
              m³
            </span>
          </div>
          <div className="w-[48%]  rounded-[10px] bg-[#29530d] border-[0.5px] border-[#ffffff1f]  px-1.5 flex justify-between">
            <p className="text-xs flex items-center text-[#C0DD97]">
              Conversion
            </p>
            <span className="text-sm flex items-center text-[#C0DD97]">
              {tdDetails.conversion}%
            </span>
          </div>
        </div>
      </div>
      <div className="h-[9%] w-full border-t-2 border-white/10 flex justify-center items-center text-sm ">
        <div className="w-[90%] flex justify-between h-full items-center">
          <button className=" w-[30%] cursor-pointer hover:bg- h-12 border-[0.5px] border-white/10 rounded-lg hover:bg-[#242323] text-[#888780]" onClick={()=>navigate("/details")}>
            Back
          </button>

          <button
            className=" w-[65%] cursor-pointer hover:bg- h-12 border-[0.5px] border-[#185fa5] rounded-lg bg-[#042c53] hover:bg-[#152e05]"
            onClick={saveData}
          >
            View result
          </button>
        </div>
      </div>
      {/* -----------The navigation bar on bottom -----------*/}
      <div className="h-[10%] w-full">
        <NavBottom />
      </div>
    </div>
  );
};

export default TdCalculator;
