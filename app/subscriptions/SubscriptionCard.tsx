import { FaSpotify, FaGoogle, FaAmazon } from "react-icons/fa";
import { RiNetflixFill } from "react-icons/ri";
import { TbBrandDisney } from "react-icons/tb";

type SubscriptionCardProps = {
  name: string;
};

const services: Record<string, { icon: React.ElementType; color?: string }> = {
  spotify: { icon: FaSpotify, color: "1DB954" },
  googleone: { icon: FaGoogle },
  amazon: { icon: FaAmazon, color: "orange" },
  disney: { icon: TbBrandDisney, color: "blue" },
  netflix: { icon: RiNetflixFill, color: "red" },
  hulu: { icon: RiNetflixFill, color: "green" },
};

function SubscriptionCard({ name }: SubscriptionCardProps) {
  const shortName = name.toLowerCase().replaceAll("+", "").replace(" ", "");
  const Icon = services[shortName].icon;

  return (
    <div
      className="border-2 rounded-lg cursor-pointer text-lg border-gray-700 text-center
                    px-5 py-3 text-gray-100 hover:bg-gray-900 duration-300 flex flex-col gap-y-2 items-center w-30"
    >
      <Icon color={services[shortName].color || "white"} size={40} />
      {name}
    </div>
  );
}

export default SubscriptionCard;
