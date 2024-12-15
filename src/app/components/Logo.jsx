
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';

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
            <div className="relative">
                <div className="w-32 h-32 bg-gradient-to-r from-blue-400 to-green-400 rounded-full flex items-center justify-center">
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
            {/* Rotating Text Section */}
            <div className="relative w-48 mt-4">
                <div className="flex items-center justify-center animate-spin-slow">
                    <p className="text-lg font-bold text-gray-500">ניהול משימות</p>
                </div>
                <div className="flex items-center justify-center animate-spin-slow">
                    <p className="text-lg font-bold text-gray-500">אמץ משימה</p>
                </div>
            </div>
        </div>
    );
}


