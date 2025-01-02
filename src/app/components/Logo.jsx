
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import LogoClockIcon from "./LogoClockIcon";

export default function Logo() {
    const [animate, setAnimate] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setAnimate(false), 1000); // סיום האנימציה לאחר 1 שנייה
        return () => clearTimeout(timer);
    }, []);

    return (
        <div
            className={`${animate ? "logo-bounce" : ""
                } flex flex-col items-center justify-center bg-white p-10 rounded-full shadow-2xl transform transition-all duration-300 hover:scale-110 hover:rotate-3`}
        >
            {/* Icon Section */}
            <LogoClockIcon/>
            {/* Rotating Text Section */}
            <div className="relative w-48 mt-4">
                <div className="flex items-center justify-center animate-spin-slow">
                    <p className="text-lg font-bold text-gray-500">ClickToCare</p>
                </div>
                <div className="flex items-center justify-center text-center animate-spin-slow">
                    <p className="text-sm font-light text-gray-600">Make a difference, one click at a time</p>
                </div>
            </div>
        </div>
    );
}


// export default function Logo() {
//     return (
//       <div className="flex flex-col items-center justify-center">
//         {/* Icon Section */}
//         <div className="relative flex items-center justify-center w-24 h-24 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full shadow-md">
//           {/* Hand Click Icon */}
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             className="w-12 h-12 text-white"
//             viewBox="0 0 24 24"
//             fill="currentColor"
//           >
//             <path d="M9 11.25V3.5a1.5 1.5 0 1 1 3 0v7.75l.723-.36a1 1 0 0 1 1.33.45l.177.354a1 1 0 0 1-.45 1.33L12.8 13.75l1.023 2.045a1.5 1.5 0 0 1-2.446 1.61L10.5 15.4l-.723.36a1 1 0 0 1-1.33-.45L8.57 14.7a1 1 0 0 1 .45-1.33L9 13.25v-2zm9.5 2.25a1 1 0 0 1 1 1V21a1 1 0 0 1-2 0v-6.5a1 1 0 0 1 1-1zm-2.5-2.5a1 1 0 0 1 1 1v6a1 1 0 0 1-2 0v-6a1 1 0 0 1 1-1z" />
//           </svg>
//           {/* Star Icon */}
//           <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg">
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               className="w-4 h-4 text-white"
//               viewBox="0 0 24 24"
//               fill="currentColor"
//             >
//               <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
//             </svg>
//           </div>
//         </div>
  
//         {/* Text Section */}
//         <div className="mt-4 text-center">
//           <p className="text-3xl font-extrabold text-gray-800">ClickToCare</p>
//           <p className="text-sm font-light text-gray-600">Make a difference, one click at a time</p>
//         </div>
//       </div>
//     );
//   }
  