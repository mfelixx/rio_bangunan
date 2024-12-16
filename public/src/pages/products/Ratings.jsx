import { FaStar, FaRegStar, FaStarHalfAlt } from "react-icons/fa";

// eslint-disable-next-line react/prop-types
const Ratings = ({ value, text, color = "yellow-500" }) => {
  const fullstar = Math.floor(value);
  const halfstar = value - fullstar > 0.5 ? 1 : 0;
  const emptyStar = 5 - fullstar - halfstar;
  return (
    <div className="flex items-center">
      {[...Array(fullstar)].map((_, i) => (
        <FaStar key={i} className={`text-${color} ml-1`} />
      ))}

      {halfstar === 1 && <FaStarHalfAlt className={`text-${color} ml-1`} />}

      {[...Array(emptyStar)].map((_, i) => (
        <FaRegStar key={i} className={`text-${color} ml-1`} />
      ))}

      <span className={`rating-text ml-[2rem]`}>{text && text}</span>
    </div>
  );
};

export default Ratings;
