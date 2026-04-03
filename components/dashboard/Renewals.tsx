"use client";

import { SubscriptionType } from "@/types/subscriptions";

function Renewals({ subscriptions }: { subscriptions: SubscriptionType[] }) {
  return (
    <div className=" border-gray-700 border-2 rounded-lg py-5 flex flex-col gap-y-5 px-10 flex-2">
      <h2 className="text-blue-600 text-xl font-bold text-center">
        Upcoming Renewals
      </h2>
      <div className="flex items-center flex-wrap justify-between w-full gap-5">
        {subscriptions
          .sort(
            (a, b) =>
              new Date(a.renews).getTime() - new Date(b.renews).getTime(),
          )
          .slice(0, 6)
          .map((subscription) => (
            <div key={subscription.id} className="w-[30%]">
              <h2 className="text-gray-300 text-lg font-bold">
                ${subscription.price}
              </h2>
              <div className="text-gray-300 text-sm font-bold">
                {subscription.service}
              </div>
              <div className="text-gray-300 text-xs">
                Renews {new Date(subscription.renews).toLocaleDateString()}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

export default Renewals;
