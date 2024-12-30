import Image from "next/image";
import React, { useEffect, useState } from "react";

interface AvatarProps {
  faceImage: ArrayBuffer | { type: string; data: number[] };
}

const Avatar: React.FC<AvatarProps> = ({ faceImage }) => {
  const [imageSrc, setImageSrc] = useState<string>('');

  useEffect(() => {
    if (faceImage) {
      setImageSrc(faceImage instanceof ArrayBuffer ? arrayBufferToBase64(faceImage) : arrayBufferToBase64(faceImage.data));
    }
  }, [faceImage]);

const arrayBufferToBase64 = (buffer:ArrayBuffer|number[]) => {
  const binary = new Uint8Array(buffer).reduce(
    (acc, byte) => acc + String.fromCharCode(byte),
    ''
  );
  return `data:image/png;base64,${btoa(binary)}`;
};
console.log(imageSrc);
//print: data:image/jpeg;base64,aVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQU9zQUFBRUdDQVlBQUFDRXAySTlBQUFBQVhOU1IwSUFyczRjNlFBQUFBUm5RVTFCQUFDeGp3djhZUVVBQU......

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
        src={imageSrc} // כאן Base64 יעבוד
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
