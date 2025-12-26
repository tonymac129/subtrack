import { ServicesType } from "@/types/subscriptions";
import Image from "next/image";

type SubscriptionCardProps = {
  id: number;
  selected?: boolean;
  services: ServicesType;
};

const serviceIcons: string[] = [
  "chatgpt.png",
  "github.png",
  "hbo.png",
  "youtube.webp",
  "google.webp",
  "netflix.png",
  "disney.png",
  "prime.png",
  "spotify.png",
  "hulu.png",
  "discord.webp",
  "crunchyroll.png",
  "microsoft-365.png",
  "apple-music.png",
  "dropbox.png",
  "adobe.png",
  "duolingo.png",
  "playstation.png",
  "xbox.png",
  "apple-tv.png",
  "paramount.svg",
  "peacock.png",
  "espn.png",
  "notion.png",
  "google.png",
  "zoom.webp",
  "verizon.png",
  "att.webp",
  "tmobile.png",
  "planet-fitness.png",
  "costco.png",
  "canva.png",
  "reddit.png",
  "x.png",
  "vercel.png",
  "cloudflare.png",
  "ny-times.png",
  "icloud.png",
];
//TODO: directly put the asset src in services.json

function SubscriptionCard({ id, selected, services }: SubscriptionCardProps) {
  return (
    <div
      className={`border-2 h-30 rounded-lg cursor-pointer leading-5 border-${selected ? "blue" : "gray"}-700 text-center
                    p-2 text-gray-100 text-sm hover:bg-gray-900 duration-300 flex flex-col gap-y-1 items-center w-25`}
    >
      <div className="h-15 flex items-center">
        <Image src={"/services/" + serviceIcons[id]} alt="Logo" height={45} width={45} />
      </div>
      {services.find((service) => service.id === id)?.name}
    </div>
  );
}

export default SubscriptionCard;
