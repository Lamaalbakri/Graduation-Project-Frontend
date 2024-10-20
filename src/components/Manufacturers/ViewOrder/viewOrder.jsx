import React from "react";
import "./ViewOrder.css";
import ViewOtherCard from "./ViewOtherCard";
import ViewOtherStepper from "./ViewOtherStepper";

function ViewOrder() {
  return (
    <div className="bg-white">
      <div className="w-full h-9 3xl:h-[94px] bg-[#D9D9D969]/[41%]"></div>
      {/* stepper */}
      <ViewOtherStepper />
      {/* order card */}
      <ViewOtherCard />
    </div>
  );
}

export default ViewOrder;
