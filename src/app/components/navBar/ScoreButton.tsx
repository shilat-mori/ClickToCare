import React from "react";
import Trophy from "./trophy";
import { useRouter } from "next/navigation";
import navButtonProps from "../../types/navBar/navButtonProps";

const ScoreButton: React.FC<navButtonProps> = ({
  text,
  navigation,
  handleNavigator,
}) => {
  return (
    <button
      className={`navbar_buttons flex items-center space-x-2`}
      onClick={() => {
        handleNavigator(navigation);
      }}
    >
      <span>{text}</span>
      <Trophy />
    </button>
  );
};

export default ScoreButton;
