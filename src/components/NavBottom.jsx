import React from 'react'
import { RiHomeSmileLine } from "react-icons/ri";
import { FaPlus } from "react-icons/fa";;
import { MdOutlineFileDownload } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import tdStore from '../stores/useTdStore';

const NavBottom = () => {
    const navigate = useNavigate();
    const {resetTd} =tdStore()
    const resetForm = ()=>{
        resetTd();
        navigate("/details")
    }
  return (
    <div className='h-full w-full flex justify-around p-2 border-t-[0.5px] border-[#b4b2a96b]'>
        <div className='h-full w-[25%] flex justify-center items-center flex-col'>
            <div className=' w-[50%] flex flex-col items-center'  onClick={()=>navigate("/history")}>
              <button className='cursor-pointer w-8 h-8 flex justify-center items-center'>
                <RiHomeSmileLine className='w-6 h-6 text-[#185fa5] border-[]'/>
            </button>
            <p className='text-xs text-[#185fa5] '>
                Home
            </p>  
            </div>
            
        </div>
        <div className='h-full w-[25%] flex justify-center items-center flex-col'>
            <div className=' w-[50%] flex flex-col items-center'  onClick={resetForm}>
                <button className='cursor-pointer w-8 h-8 flex justify-center items-center'>
                <FaPlus className='w-6 h-6 text-[#888780]'/>
            </button>
            <p className='text-xs text-[#b4b2a9]'>
               Add
            </p>
            </div>
        </div>
        <div className='h-full w-[25%] flex justify-center items-center flex-col'>
            <div className=' w-[50%] flex flex-col items-center'>
              <button className='cursor-pointer w-8 h-8  flex justify-center items-center'>
                <MdOutlineFileDownload className='w-7 h-7 text-[#888780]'/>
            </button>
            <p className='text-xs text-[#b4b2a9]'>
                Export
            </p>  
            </div>
            
        </div>
      
      
      

    </div>
  )
}

export default NavBottom
