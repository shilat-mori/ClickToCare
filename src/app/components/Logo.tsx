import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import LogoClockIcon from "./LogoClockIcon";
import LogoIconProps from "@/app/types/ILogo";

const Logo: React.FC<LogoIconProps> = ({ mode }) => {
  const [animate, setAnimate] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setAnimate(false), 1000); // סיום האנימציה לאחר 1 שנייה
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`${animate ? "logo-bounce" : ""}
      ${
        mode === 1 ? `h-96 w-96` : ``
      }${mode === 2 ? `h-12 w-12` : ``}${
        mode === 3 ? `h-4 w-4` : ``
      }
      flex flex-col items-center justify-center bg-white p-4 rounded-full shadow-2xl transform transition-all duration-300 hover:scale-110 hover:rotate-3`}
    >
      {/* Icon Section */}
      <LogoClockIcon mode={mode} />
      {/* Text Section */}
      <div
        className={`relative ${mode === 1 ? `w-44` : ``}${
          [2, 3].includes(mode) ? `flex-none` : ``
        }mt-4`}
      >
        {mode === 1 && (
          <div>
            <div className="flex items-center justify-center animate-spin-slow">
              <p className="text-4xl font-bold text-gray-500">ClickToCare</p>
            </div>
            <div className="flex items-center justify-center text-center animate-spin-slow">
              <p className="text-lg font-light text-gray-600">
                Make a difference,
                <br /> one click at a time
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default Logo;
