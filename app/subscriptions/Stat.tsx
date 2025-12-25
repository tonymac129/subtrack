type StatProps = {
  big: string;
  description: string;
};

function Stat({ big, description }: StatProps) {
  return (
    <div className="flex flex-col gap-y-5">
      <h1 className="text-blue-600 font-extrabold text-4xl">{big}</h1>
      <div className="text-gray-300 text-sm">{description}</div>
    </div>
  );
}

export default Stat;
