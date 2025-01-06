import Image from "next/image";
import React, { useEffect, useState } from "react";

interface AvatarProps {
  faceImage: string; // The Cloudinary URL (string)
}

const Avatar: React.FC<AvatarProps> = ({ faceImage }) => {
  const [imageSrc, setImageSrc] = useState<string>('');

  useEffect(() => {
    if (faceImage) {
      setImageSrc(faceImage);
    }
  }, [faceImage]);

  return (
    <div className="h-fit w-fit rounded-full bg-gray-400 flex items-center justify-center overflow-hidden relative">
      {imageSrc ? (
        // <Image
        //   src={imageSrc} // no image is appear!!!!
        //   alt="User Face"
        //   className="object-cover"
        //   fill 
        //   sizes="100vw"
        //   priority
        // />
        <img
        src={imageSrc}
        alt="User Face"
        className="object-cover w-full h-full"
      />
      ) : (
        <span className="text-white text-sm">Avatar</span>
      )}
    </div>
  );
};

export default Avatar;
