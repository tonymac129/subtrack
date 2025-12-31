import Subscription from "@/components/dashboard/Subscription";
import Chart from "@/components/dashboard/Chart";

export default function Home() {
  return (
    <div className="flex-1 pr-50">
      <h1 className="text-3xl text-white text-center font-bold py-10">
        Welcome back to <span className="text-blue-600">Subtrack</span>
      </h1>
      <div className="pl-10 flex flex-wrap gap-3">
        <Subscription />
        <Chart />
      </div>
    </div>
  );
}
