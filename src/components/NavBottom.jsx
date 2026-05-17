import React from 'react'
import { RiHomeSmileLine } from "react-icons/ri"
import { FaPlus } from "react-icons/fa"
import { MdOutlineFileDownload } from "react-icons/md"
import { useNavigate, useLocation } from 'react-router-dom'
import tdStore from '../stores/useTdStore'

const NavBottom = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { resetTd } = tdStore()

  const resetForm = () => {
    resetTd()
    navigate("/details")
  }

  const isActive = (path) => location.pathname === path

  return (
    <div className='h-full w-full flex justify-around p-2 border-t-[0.5px] border-[#b4b2a96b]'>

      {/* Home */}
      <div className='h-full w-[25%] flex justify-center items-center flex-col'>
        <div className='w-[50%] flex flex-col items-center' onClick={() => navigate("/history")}>
          <button className='cursor-pointer w-8 h-8 flex justify-center items-center'>
            <RiHomeSmileLine className={`w-6 h-6 ${isActive('/history') ? 'text-[#185fa5]' : 'text-[#888780]'}`} />
          </button>
          <p className={`text-xs ${isActive('/history') ? 'text-[#185fa5]' : 'text-[#b4b2a9]'}`}>
            Home
          </p>
        </div>
      </div>

      {/* Add */}
      <div className='h-full w-[25%] flex justify-center items-center flex-col'>
        <div className='w-[50%] flex flex-col items-center' onClick={resetForm}>
          <button className='cursor-pointer w-8 h-8 flex justify-center items-center'>
            <FaPlus className={`w-6 h-6 ${isActive('/details') ? 'text-[#185fa5]' : 'text-[#888780]'}`} />
          </button>
          <p className={`text-xs ${isActive('/details') ? 'text-[#185fa5]' : 'text-[#b4b2a9]'}`}>
            Add
          </p>
        </div>
      </div>

      {/* Export */}
      <div className='h-full w-[25%] flex justify-center items-center flex-col'>
        <div className='w-[50%] flex flex-col items-center' onClick={() => navigate("/exports")}>
          <button className='cursor-pointer w-8 h-8 flex justify-center items-center'>
            <MdOutlineFileDownload className={`w-7 h-7 ${isActive('/exports') ? 'text-[#185fa5]' : 'text-[#888780]'}`} />
          </button>
          <p className={`text-xs ${isActive('/exports') ? 'text-[#185fa5]' : 'text-[#b4b2a9]'}`}>
            Export
          </p>
        </div>
      </div>

    </div>
  )
}

export default NavBottom