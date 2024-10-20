import ReactStars from "react-rating-stars-component";
// internal imports
import logo from "../../images/SCMS.png";
import starRoundBlack from "../../images/starRoundBlack.svg";
import starRoundColor from "../../images/starRoundColor.svg";

const ModalStar = ({ toggleModal, closeButton, ratingChanged }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-8 rounded-lg w-[300px] lg:w-[820px] text-center flex flex-col justify-between relative space-y-10 3xl:space-y-16">
        <button onClick={toggleModal} className="absolute top-4 right-4">
          <img
            src={closeButton}
            alt="closeButton"
            className="w-10 h-10 3xl:w-full 3xl:h-full"
          />
        </button>

        <h2 className="text-xl 3xl:text-[32px] text-[#010924] font-bold">
          Order rate ( #7294964)
        </h2>

        <div className="text-center flex flex-row justify-center">
          <img src={logo} alt="logo" className="w-1/2 h-full" />
        </div>

        <h2 className="text-xl 3xl:text-[32px] text-[#010924] font-bold">
          How was your experience with the store this time
        </h2>

        <div className="flex items-center justify-center">
          <div>
            {/* Custom Star Icons */}
            <ReactStars
              count={5}
              value={1}
              onChange={ratingChanged}
              size={24}
              activeColor="#FFE37F"
              emptyIcon={
                <img
                  src={starRoundBlack}
                  alt="starRoundBlack"
                  className="w-10 h-10"
                />
              }
              filledIcon={
                <img
                  src={starRoundColor}
                  alt="starRoundColor"
                  className="w-10 h-10"
                />
              }
            />
          </div>
        </div>

        <div>
          <textarea
            style={{ border: "1px solid #000" }}
            type="text"
            placeholder="We’re happy to see your opinion about our store"
            className="w-full h-[156px] py-3 px-6 rounded-xl text-xl 3xl:text-[36px] text-[#1D1B20] placeholder:text-[#1D1B20] text-start outline-none text-wrap"
          />
        </div>

        <div className="flex items-center justify-end">
          <button
            onClick={toggleModal}
            className="w-[180px] 3xl:w-[308px] p-2 3xl:p-4 rounded 3xl:rounded-xl bg-[#2C2C2C] text-[#F5F5F5]"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalStar;
