import React from 'react'
import LogoIconProps, {LogoMode} from '../types/ILogo'
const LogoClockIcon:React.FC<LogoIconProps> = ({mode}) => {
  return (
    <div className="relative">
                <div className={`bg-gradient-to-r from-blue-400 to-green-400 rounded-full flex items-center justify-center${(mode===1)?`h-40 w-40 m-6`:``}${(mode===2)?`h-8 w-8 m-2`:``}${(mode===3)?`h-2 w-2`:``}`}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`text-white`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <div className={`absolute top-0 right-0 ${(mode===1)?`h-16 w-16`:``}${(mode===2)?`h-3 w-3`:``}${(mode===3)?`h-2 w-2`:``} bg-white rounded-full flex items-center justify-center shadow-lg shadow-green-500`}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`${(mode===1)?`h-16 w-16`:``}${(mode===2)?`h-3 w-3`:``}${(mode===3)?`h-2 w-2`:``} text-green-400`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3" />
                    </svg>
                </div>
            </div>
  )
}

export default LogoClockIcon