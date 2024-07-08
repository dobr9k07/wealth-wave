import { IconId } from "@/enums/iconSpriteId";
import { FC } from "react";
import sprite from "@/public/sprite.svg";
// import sprite from "../public/sprite.svg";

interface ISvgIconProps {
  id?: string;
  className?: string;
  size: string | number;
  iconId: IconId;
}

const SvgIcon: FC<ISvgIconProps> = ({ id, className, iconId, size }) => {
  return (
    <svg id={id} className={className} width={size} height={size}>
      <use href={sprite + iconId} />
    </svg>
  );
};

export default SvgIcon;
