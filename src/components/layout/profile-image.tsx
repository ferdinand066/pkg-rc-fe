import { classJoin } from "../../lib/functions";

type ProfileImageType = {
  name: string;
  className: string;
};

const ProfileImage = ({ name, className }: ProfileImageType) => {
  type Color = string;
  const getInitials = (name: string): string => {
    const initials = name.split(" ").map((word) => word.charAt(0));
    return initials
      .filter((_, index) => index === 0 || index === initials.length - 1)
      .join("")
      .toUpperCase();
  };

  function getRandomColor(str: string): Color {
    let hash = 0;
    str.split("").forEach((char) => {
      hash = char.charCodeAt(0) + ((hash << 5) - hash);
    });
    let color = "";
    for (let i = 0; i < 3; i++) {
      const value = (hash >> (i * 8)) & 0xff;
      const darkValue = Math.floor(value * 0.7);
      color += darkValue.toString(16).padStart(2, "0");
    }
    return "#" + color;
  }

  return (
    <div
      className={classJoin(
        "flex-shrink-0 w-10 h-10 p-2 rounded-full flex items-center justify-center font-bold text-white",
        className,
        name === "" ? "bg-gray-300 animate-pulse" : ""
      )}
      style={{ backgroundColor: getRandomColor(name) }}
    >
      {getInitials(name)}
    </div>
  );
};

export default ProfileImage;