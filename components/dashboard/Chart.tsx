"use client";

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import { useEffect } from "react";
import { SubscriptionType } from "@/types/subscriptions";

ChartJS.register(ArcElement, Tooltip, Legend);

const data = {
  labels: [],
  datasets: [
    {
      data: [],
      backgroundColor: [
        "#6366f1",
        "#06b6d4",
        "#f43f5e",
        "#f59e0b",
        "#10b981",
        "#8b5cf6",
        "#d946ef",
        "#3b82f6",
        "#2dd4bf",
        "#fb923c",
      ],
      borderWidth: 5,
      borderColor: "#030712",
    },
  ],
};

const options = {
  plugins: {
    legend: {
      display: false,
    },
  },
};

type Category = {
  name: string;
  count: number;
};

function Chart({ userSubs }: { userSubs: SubscriptionType[] }) {
  useEffect(() => {
    const categories = userSubs?.reduce((acc: Category[], sub: SubscriptionType) => {
      const existingCategory = acc.find((category) => category.name === (sub.category || "Custom"));
      if (!existingCategory) {
        acc.push({ name: sub.category || "Custom", count: 1 });
      } else {
        acc[acc.indexOf(existingCategory)] = { ...existingCategory, count: existingCategory.count + 1 };
      }
      return acc;
    }, []);
    categories?.sort((a, b) => b.count - a.count);
    data.labels = categories?.map((category) => category.name);
    data.datasets[0].data = categories?.map((category) => category.count);
    //ik im glazing myself too hard but lowkenuinely i feel so smart coding this
  }, [userSubs]);
  //TODO: maybe add an option to toggle whether to base on number of services for each category or total money spending for each category

  return (
    <div className="flex flex-col gap-y-3 w-70 px-10 rounded-lg border-2 border-gray-700 p-3">
      <h2 className="text-blue-600 text-xl font-bold text-center">Subscription types</h2>
      {userSubs && <Pie options={options} data={data} />}
    </div>
  );
}

export default Chart;
