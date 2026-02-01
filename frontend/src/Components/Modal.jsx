import React from 'react'
import { RxCross2 } from "react-icons/rx";
import { useSelector } from 'react-redux';
import {ModaldarkStyle,ModalNoiseStyle} from '../constants'

const Modal = ({isOpen,onClose,children}) => {
    const isDark = useSelector((state)=>state.theme.isDark)
    // is the sidebar is close
    if(!isOpen) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center'>
        {/*Overlay*/}
        <div className='absolute inset-0 bg-black/60' />
          {/* Modal Box */}
          <div 
            className={`relative z-10 w-[95%] md:w-[400px] lg:w-[540px] max-w-4xl ${isDark ? "border border-gray-800 shadow-[inset_0_0_45px_rgba(0,0,0,0.6)]" : "bg-linear-to-br from-[#FFFFFF] via-[#F5F5F5] to-[#EAEAEA] text-black p-6"} rounded-2xl shadow-2xl`}
            style={isDark ? ModaldarkStyle : {}}
            onClick={(e)=>e.stopPropagation()}
          >
            {/* Noise overlay layer */}
            {isDark && <div style={ModalNoiseStyle}></div>}
            
            {/* Content */}
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-2">
                <p className='text-xl font-semibold'>Create Post</p>
                <button onClick={onClose} className='text-2xl hover:text-gray-400 transition-colors'>
                  <RxCross2 />
                </button>
              </div>
              {children}
            </div>
          </div>
        </div>
  );
};
export default Modal

