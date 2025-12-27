import { BiInfoCircle } from "react-icons/bi";

type StatProps = {
  big: string;
  description: string;
  info?: string;
};

function Stat({ big, description, info }: StatProps) {
  return (
    <div className="flex flex-col gap-y-5">
      <h1 className="text-blue-600 font-extrabold text-4xl">{big}</h1>
      <div className="text-gray-300 text-sm flex gap-x-2">
        {description}
        {info && <BiInfoCircle size={20} className="cursor-pointer" title={info} />}
      </div>
    </div>
  );
}

export default Stat;
