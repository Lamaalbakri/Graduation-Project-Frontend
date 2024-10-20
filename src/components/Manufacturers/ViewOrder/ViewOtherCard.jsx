import { useState } from "react";
// internal imports
import closeButton from "../../images/closeButton.svg";
import startGold from "../../images/star-gold.svg";
import ModalStar from "./ModalStar";

const ViewOtherCard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const ratingChanged = (newRating) => {
    console.log(newRating);
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const orders = [
    {
      id: "9578495",
      info: "set of info about the order",
      price: 25,
      buttonText: "Show more details",
    },
    {
      id: "9578496",
      info: "set of info about the order to",
      price: 15,
      buttonText: "Show more details 2",
    },
  ];

  return (
    <div className="p-5 md:p-16 3xl:p-[126px] space-y-8">
      {orders.map((order, index) => (
        <div
          key={index}
          className="bg-[#D9D9D969]/[65%] rounded-[10px] w-full flex flex-col md:flex-row justify-between"
        >
          <div className="p-2 sm:p-10 3xl:p-[78px] flex flex-col sm:flex-row items-center gap-3 md:gap-20 3xl:gap-[180px]">
            <div className="w-[300px] h-[200px] 3xl:w-[582px] 3xl:h-[326px] bg-white"></div>
            <div className="space-y-5">
              <h3 className="text-2xl 3xl:text-[40px] leading-9 text-black font-bold tracking-[-1.5%]">
                ID No: {order.id}
              </h3>
              <h4 className="text-xl 3xl:text-[30px] leading-[30px] text-black/[80%] tracking-[-1.5%]">
                {order.info}
              </h4>
              <h3 className="text-2xl 3xl:text-[40px] leading-9 text-black font-bold tracking-[-1.5%]">
                Price: {order.price}$
              </h3>
            </div>
          </div>
          <div className="flex items-end justify-end">
            <div className="p-7 3xl:p-[50px]">
              <button className="p-2.5 3xl:p-4 rounded-md 3xl:rounded-xl bg-[#2C2C2C] text-[#F5F5F5]">
                {order.buttonText}
              </button>
            </div>
          </div>
        </div>
      ))}

      {/* Rating Button */}
      <div className="w-full p-9 3xl:p-[55px] rounded-lg bg-[#FFE37F] flex items-center justify-between">
        <h5 className="text-xl 3xl:text-[32px] leading-8">
          Evaluating the request helps us improve our services and deliver them
          better
        </h5>
        <button
          onClick={toggleModal}
          className="w-[187px] h-[57px] bg-[#2C2C2C] flex items-center justify-center gap-2 rounded-md"
        >
          <img src={startGold} alt="startGold" />
          <span className="text-sm text-[#f5f5f5]">Rate</span>
        </button>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <ModalStar
          toggleModal={toggleModal}
          closeButton={closeButton}
          ratingChanged={ratingChanged}
        />
      )}
    </div>
  );
};

export default ViewOtherCard;
