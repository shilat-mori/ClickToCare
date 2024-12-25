import { useRouter } from 'next/navigation';
import React from 'react'
import navButtonProps from '../types/navButtonProps';

const NavButton:React.FC<navButtonProps> = ({text, navigation, handleNavigator}) => {
    const router = useRouter()
  return (
    <button className='navbar_buttons' onClick={()=>handleNavigator(navigation)}>{text}</button>
    
)
}

export default NavButton