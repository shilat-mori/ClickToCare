import CountdownBlockProps from '@/app/types/waiting/countdownBlockProps'
import React from 'react'
 
const CountdownBlock: React.FC<CountdownBlockProps> = ({ name, num }) => {
    return (
        <div className="flex flex-col items-center">
            <span className="text-6xl font-bold">{num}</span>
            <span className="text-sm uppercase tracking-wide">{name}</span>
        </div>
    )
}

export default CountdownBlock