import React, { useEffect, useState } from 'react'
import Header from './Header'
import NavBottom from './NavBottom'
import { IoIosCloseCircleOutline } from "react-icons/io";
import tdStore from '../stores/useTdStore'
import { set } from 'react-hook-form';
const History = () => {
  //const {tdDetails,setTdDetails} = tdStore();
  const [loader,setLoader] = useState(true);
  const [tdList,setTdList] = useState([]);
  useEffect(()=>{
    try {
      const tdData = JSON.parse(localStorage.getItem("tdRecords"));
      console.log(tdData)
      setTdList(tdData);
    } catch (error) {
      console.log(error)
    } 
  },[]);

  {/*----------------------loader needs to be added */}
  const deleteTd =async (id)=>{
    try {
      if(!id) return;
      const newList = tdList.filter((td)=>td._id!==id);
      setTdList(newList);
      await localStorage.setItem("tdRecords", JSON.stringify(newList))
    } catch (error) {
      console.log(error)
    }
  }
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
    <div className='h-full w-full text-[#f0ede8] bg-[#2c2c2a]'>
      <div className='h-[8%] w-full '>
        <Header/>
      </div>
      <div className='h-[82%] w-full overflow-y-auto mt-1'>
        <h2 className='text-sm font-bold text-[#888780] w-[90%] flex items-center m-auto h-12'>
            {tdList?.length ||0} RECORDS
          </h2>
        {/* ---------------mapable container----------------- */}
        {
         tdList?.length>0? tdList?.map((td)=>(
            <div key={td._id} className='w-[90%]  m-auto rounded-[10px] bg-[#222220] mt-2'>
          
            <div  className='w-full p-3'>
              {/* ------name div------------ */}
                <div className='w-full'>
                  <div className='w-full flex justify-between '>
                    <p className=''>{td.applicantName}</p>
                    <button  className="text-xl cursor-pointer" onClick={()=>deleteTd(td._id)}>
                      <IoIosCloseCircleOutline />
                    </button>
                  </div>
                <div className='text-sm text-[#888780]'>
                  <p>
                  <span className='mr-1'>S/O {td.fathersName}</span>
                 <span>·</span>
                 <span className='ml-1'>{td.address}</span>
                  </p> 
                </div>
                </div>
              

              {/* ----------class and species div ------------- */}
              <div className='w-full mt-2.5 h-5 flex justify-between text-[10px]'>
                <div className='flex'>
                  {
                  td?.treeDetails?.map((tree,i)=>(
                  <div key={tree._id} className={`flex items-center py-1 px-2 rounded-2xl border-[0.5px] mr-2.5 ${colorArr[i].border} ${colorArr[i].bg} ${colorArr[i].text}`}>
                  <div
                  className={`w-2 h-2 rounded-full ${colorArr[i].bg_pt} mr-1`}
                ></div>
                <div className=''>
                     {tree.class} <span>·</span> {tree.species}
                </div>
                </div>  
                  ))
                }
                </div>
                
                <div className=''>
                  <p className="p-1  text-center cursor-pointer  h-6  w-16 border-[0.5px] border-[#3b6d11] rounded-[10px] bg-[#173404] hover:bg-[#152e05] text-[#c0dd97] text-xs">{td.conversion} %</p> 
                </div>
                
              </div>

              {/* -------value div--------- */}
              <div className='w-full flex border-[0.5px] border-[#ffffff0f] mt-2.5 text-[#888780]'>
                <div className='w-1/3 p-2 '>
                  <p className='text-xs font-bold'>
                    STANDING
                  </p>
                  <p className='text-[#f0ede8]'>
                    {td.standingVolume} m³
                  </p>
                </div>
                <div className='w-1/3 p-2 border-[0.5px] border-[#ffffff0f]'>
                  <p className='text-xs font-bold'>
                    CONVERTED
                  </p>
                  <p className='text-[#c0dd97]'>
                    {td.convertedVolume} m³
                  </p>
                </div>
                <div className='w-1/3 p-2 '>
                  <p className='text-xs font-bold'>
                    TREES
                  </p>
                  <p className='text-[#f0ede8]'>
                    {td.treeCount}
                  </p>
                </div>
              </div>

              {/* -------------expandable details--------------- */}
              <div className='w-full mt-2.5'>
                <div className='w-full flex justify-between'>
                  <p className='text-sm text-[#888780]'>
                    <span className='mr-1'>{td.compartment}</span>·<span className='ml-1'>Date</span>
                  </p>
                  <button className="  cursor-pointer  h-7 w-14 border-[0.5px] border-[#185fa5] rounded-[10px] bg-[#042c53] hover:bg-[#152e05] text-[#b5d4f4] text-xs font-bold">View</button>
                </div>
                <div></div>
              </div>
            </div>
        </div>
          )):<div className='w-full h-[80%] flex justify-center items-center text-red-600 text-2xl'>{"Empty Storage"}</div>
        }
        
      </div>
      <div className='h-[10%] w-full'>
        <NavBottom/>
      </div>
    </div>
  )
}

export default History
