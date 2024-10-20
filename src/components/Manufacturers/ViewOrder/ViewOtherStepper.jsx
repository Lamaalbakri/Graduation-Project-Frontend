import circle from "../../images/circle.svg";
import image1 from "../../images/viewOrder1.png";
import image2 from "../../images/viewOrder2.png";
import image3 from "../../images/viewOrder3.png";
import image4 from "../../images/viewOrder4.png";

const ViewOtherStepper = () => {
  return (
    <div className="max-w-[1240px] mx-auto">
      <div className="ml-12 p-5 md:p-16 3xl:p-[126px] overflow-hidden">
        {/* Stepper Navigation */}
        <div className="my-4 w-full grid grid-cols-4">
          <div className="flex items-end gap-2">
            <img src={image1} alt="image1" className="w-12 h-12" />
            <h4 className="text-xl font-bold text-black">Order Placed</h4>
          </div>
          <div className="flex items-end gap-2">
            <img src={image2} alt="image1" className="w-12 h-12" />
            <h4 className="text-xl font-bold text-black">Order Placed</h4>
          </div>
          <div className="flex items-end gap-2">
            <img src={image3} alt="image1" className="w-12 h-12" />
            <h4 className="text-xl font-bold text-black">Order Placed</h4>
          </div>
          <div className="flex items-end gap-2">
            <img src={image4} alt="image1" className="w-12 h-12" />
            <h4 className="text-xl font-bold text-black">Order Placed</h4>
          </div>
        </div>
        <div className="my-4 w-full grid grid-cols-4">
          <div className="flex items-center ml-10">
            <img src={circle} alt="circle" className="w-9 h-9" />
            <div className="w-full h-1 bg-[#E8DEF8]"></div>
          </div>
          <div className="flex items-center">
            <img src={circle} alt="circle" className="w-9 h-9" />
            <div className="w-full h-1 bg-[#E8DEF8]"></div>
          </div>
          <div className="flex items-center">
            <img src={circle} alt="circle" className="w-9 h-9" />
            <div className="w-full h-1 bg-[#E8DEF8]"></div>
          </div>
          <div className="flex items-center">
            <img src={circle} alt="circle" className="w-9 h-9" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewOtherStepper;
