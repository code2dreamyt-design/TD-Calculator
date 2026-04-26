import React, { useEffect, useState } from "react";
import Header from "./Header";
import NavBottom from "./NavBottom";
import { FaEdit } from "react-icons/fa";
import { IoIosCloseCircleOutline } from "react-icons/io";
import tdStore from "../stores/useTdStore";
import { useNavigate } from "react-router-dom";
import Loader from "./Loader";
const History = () => {
  const [loading, setLoading] = useState(true); 
  const navigate = useNavigate();
  const { setTdDetails} = tdStore();
  const [tdList, setTdList] = useState([]);
  const [expanded, setExpanded] = useState(null);
  useEffect(() => {
    try {
      const tdData = JSON.parse(localStorage.getItem("tdRecords"));
      const sorted = tdData.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
      );
      console.log(tdData);
      setTdList(sorted);
      setLoading(false)
    } catch (error) {
      console.log(error);
    }
  }, []);

  {
    /*----------------------loader needs to be added------------------------ */
  }
  const deleteTd = async (id) => {
    try {
      if (!id) return;
      const newList = tdList.filter((td) => td._id !== id);
      setTdList(newList);
      await localStorage.setItem("tdRecords", JSON.stringify(newList));
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
  const startEdit = (td)=>{
    console.log(td);
    setTdDetails(td)
    navigate("/details")
  }
  return (
    <div className="h-full w-full text-[#f0ede8] bg-[#2c2c2a]">
      <div className="h-[8%] w-full ">
        <Header />
      </div>
      {loading ?(<div className={`${loading ? "block h-full w-full":"hidden"}   absolute`}>
        <Loader loading={loading} />
      </div>) :(<div className="h-[82%] w-full overflow-y-auto mt-1">
        <h2 className="text-sm font-bold text-[#888780] w-[90%] flex items-center m-auto h-12">
          {tdList?.length || 0} RECORDS
        </h2>
        {/* ---------------mapable container----------------- */}
        {tdList?.length > 0 ? (
          tdList?.map((td) => (
            <div
              key={td._id}
              className="w-[90%]  m-auto rounded-[10px] bg-[#222220] mt-2"
            >
              <div className="w-full p-3">
                {/* ------name div------------ */}
                <div className="w-full">
                  <div className="w-full flex justify-between ">
                    <p className="flex items-center">
                      {td.applicantName}
                      <button className=" ml-2 cursor-pointer flex justify-center items-center h-5 w-10  text-[#b5d4f4] text-xs font-bold" onClick={()=>startEdit(td)}>
                        <FaEdit className="w-[50%] h-[80%]" title="Edit" />
                      </button>
                    </p>
                    <button
                      className="text-xl cursor-pointer"
                      onClick={() => deleteTd(td._id)}
                    >
                      <IoIosCloseCircleOutline />
                    </button>
                  </div>
                  <div className="text-sm text-[#888780]">
                    <p>
                      <span className="mr-1">S/O {td.fathersName}</span>
                      <span>·</span>
                      <span className="ml-1">{td.address}</span>
                    </p>
                  </div>
                </div>

                {/* ----------class and species div ------------- */}
                <div className="w-full mt-2.5 h-5 flex justify-between text-[10px]">
                  <div className="flex">
                    {td?.treeDetails?.map((tree, i) => (
                      <div
                        key={tree._id}
                        className={`flex items-center py-1 px-2 rounded-2xl border-[0.5px] mr-2.5 ${colorArr[i].border} ${colorArr[i].bg} ${colorArr[i].text}`}
                      >
                        <div
                          className={`w-2 h-2 rounded-full ${colorArr[i].bg_pt} mr-1`}
                        ></div>
                        <div className="">
                          {tree.class} <span>·</span> {tree.species}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="">
                    <p className="p-1  text-center cursor-pointer  h-6  w-16 border-[0.5px] border-[#3b6d11] rounded-[10px] bg-[#173404] hover:bg-[#152e05] text-[#c0dd97] text-xs">
                      {td.conversion} %
                    </p>
                  </div>
                </div>

                {/* -------value div--------- */}
                <div className="w-full flex border-[0.5px] border-[#ffffff0f] mt-2.5 text-[#888780]">
                  <div className="w-1/3 p-2 ">
                    <p className="text-xs font-bold">STANDING</p>
                    <p className="text-[#f0ede8]">{td.standingVolume} m³</p>
                  </div>
                  <div className="w-1/3 p-2 border-[0.5px] border-[#ffffff0f]">
                    <p className="text-xs font-bold">CONVERTED</p>
                    <p className="text-[#c0dd97]">{td.convertedVolume} m³</p>
                  </div>
                  <div className="w-1/3 p-2 ">
                    <p className="text-xs font-bold">TREES</p>
                    <p className="text-[#f0ede8]">{td.treeCount}</p>
                  </div>
                </div>

                {/* -------------expandable details--------------- */}
                <div className="w-full mt-2.5">
                  <div className="w-full flex justify-between">
                    <p className="text-sm text-[#888780]">
                      <span className="mr-1">{td.compartment}</span>·
                      <span className="ml-1">
                        {new Date(td.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })}
                      </span>
                    </p>
                    <button
                      className="  cursor-pointer  h-7 w-14 border-[0.5px] border-[#185fa5] rounded-[10px] bg-[#042c53] hover:bg-[#152e05] text-[#b5d4f4] text-xs font-bold"
                      onClick={() =>
                        setExpanded(expanded === td._id ? null : td._id)
                      }
                    >
                      View
                    </button>
                  </div>

                  <div
                    className={`w-full m-auto bg-[#222220] rounded-lg border border-white/8 overflow-hidden mt-2 ${expanded === td._id ? "block" : "hidden"}`}
                  >
                    <table
                      className="w-full border-collapse text-[10px]"
                      style={{ tableLayout: "fixed" }}
                    >
                      <thead>
                        <tr className="bg-[#1a1a18] border-b border-white/8">
                          <th className="w-[14%] py-1.75 px-1.25 pl-2.5 text-left text-[#888780] font-medium whitespace-nowrap">
                            #
                          </th>
                          <th className="w-[11%] py-1.75 px-1.25 text-center text-[#888780] font-medium">
                            L(m)
                          </th>
                          <th className="w-[11%] py-1.75 px-1.25 text-center text-[#888780] font-medium">
                            W(m)
                          </th>
                          <th className="w-[11%] py-1.75 px-1.25 text-center text-[#888780] font-medium">
                            T(m)
                          </th>
                          <th className="w-[11%] py-1.75 px-1.25 text-center text-[#888780] font-medium">
                            Qty(pcs)
                          </th>
                          <th className="w-[21%] py-1.75 px-1.25 text-center text-[#888780] font-medium">
                            V/unit(m³)
                          </th>
                          <th className="w-[21%] py-1.75 px-1.25 text-center text-[#888780] font-medium">
                            Total(m³)
                          </th>
                        </tr>
                      </thead>
                      {td.treeDetails
                        ?.filter(
                          (tree, index, self) =>
                            self.findIndex(
                              (t) => t.species === tree.species,
                            ) === index,
                        )
                        .map((trees) => (
                          <tbody key={trees.species}>
                            {/* Species separator */}
                            <tr className="bg-[#1e1e1c] border-b border-white/6">
                              <td
                                colSpan={7}
                                className="px-2.5 py-1 text-[#888780] text-[12px] uppercase tracking-[0.04em]"
                              >
                                <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#185fa5] mr-0.75 align-middle font-bold" />
                                {trees.species}{" "}
                              </td>
                            </tr>
                            {td?.sizes
                              ?.filter((size) => size.species === trees.species)
                              .map((size, i) => (
                                <tr
                                  key={size._id}
                                  className="border-b border-white/4 last:border-b-0"
                                >
                                  <td className="py-1.5 px-1.25 pl-2.5 text-left text-[#888780]">
                                    S{i + 1}
                                  </td>
                                  <td className="py-1.5 px-1.25 text-center text-[#b4b2a9]">
                                    {size.length}
                                  </td>
                                  <td className="py-1.5 px-1.25 text-center text-[#b4b2a9]">
                                    {size.width}
                                  </td>
                                  <td className="py-1.5 px-1.25 text-center text-[#b4b2a9]">
                                    {size.thickness}
                                  </td>
                                  <td className="py-1.5 px-1.25 text-center text-[#b4b2a9]">
                                    {size.qty}
                                  </td>
                                  <td className="py-1.5 px-1.25 text-center text-[#b4b2a9]">
                                    {size.volume_unit}
                                  </td>
                                  <td className="py-1.5 px-1.25 text-center text-[#c0dd97] font-medium">
                                    {size.volume_total}
                                  </td>
                                </tr>
                              ))}
                          </tbody>
                        ))}
                    </table>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="w-full h-[80%] flex justify-center items-center text-red-600 text-2xl">
            {"Empty Storage"}
          </div>
        )}
      </div>)}
      <div className="h-[10%] w-full fixed bottom-0">
        <NavBottom />
      </div>
    </div>
  );
};

export default History;
