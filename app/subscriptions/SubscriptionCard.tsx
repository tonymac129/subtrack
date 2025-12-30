import { ServicesType } from "@/types/subscriptions";
import { AccountsType } from "@/types/accounts";
import Image from "next/image";

type SubscriptionCardProps = {
  id: number;
  selected?: boolean;
  services: ServicesType | AccountsType;
};

function SubscriptionCard({ id, selected, services }: SubscriptionCardProps) {
  return (
    <div
      className={`border-2 h-30 rounded-lg cursor-pointer leading-5 border-${selected ? "blue" : "gray"}-700 text-center
                    p-2 text-gray-100 text-sm hover:bg-gray-900 duration-300 flex flex-col gap-y-1 items-center w-25 `}
    >
      <div className="h-15 flex items-center">
        <Image src={"/services/" + services.find((service) => service.id === id)?.img} alt="Logo" height={45} width={45} />
      </div>
      {services.find((service) => service.id === id)?.name}
    </div>
  );
}

export default SubscriptionCard;
