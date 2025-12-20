import { ServicesType } from "@/types/subscriptions";
import Image from "next/image";

type SubscriptionCardProps = {
  id: number;
  selected?: boolean;
  services: ServicesType;
};

const serviceIcons: string[] = [
  "chatgpt.png",
  "disney.png",
  "github.png",
  "google.webp",
  "hbo.png",
  "hulu.png",
  "netflix.png",
  "prime.png",
  "spotify.png",
  "youtube.webp",
];

function SubscriptionCard({ id, selected, services }: SubscriptionCardProps) {
  return (
    <div
      className={`border-2 rounded-lg cursor-pointer leading-5 border-${selected ? "blue" : "gray"}-700 text-center
                    px-5 py-3 text-gray-100 h-35 hover:bg-gray-900 duration-300 flex flex-col gap-y-2 items-center w-30`}
    >
      <div className="h-15 flex items-center">
        <Image src={"/services/" + serviceIcons[id]} alt="Logo" height={40} width={55} />
      </div>
      {services.find((service) => service.id === id)?.name}
    </div>
  );
}

export default SubscriptionCard;
