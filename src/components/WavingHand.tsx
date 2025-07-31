"use client";

import Lottie from "lottie-react";
import wavingHandAnimation from "../../public/waving-hand.json";

export default function WavingHand() {
  const style = {
    height: 50, // Adjust size as needed
    width: 50,
  };
  
  return (
    <div className="inline-block align-middle">
      <Lottie animationData={wavingHandAnimation} style={style} />
    </div>
  );
}