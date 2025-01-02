import React from 'react'
import LogoIconProps, {LogoMode} from '../types/ILogo'
const LogoClockIcon:React.FC<LogoIconProps> = ({mode}) => {
  return (
    <div className="relative">
                <div className="h-32 w-32 bg-gradient-to-r from-blue-400 to-green-400 rounded-full flex items-center justify-center">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-20 w-20 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <div className="absolute top-0 right-0 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-green-400"
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