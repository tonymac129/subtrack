import Link from "next/link";

type OptionProps = {
  text: string;
  link: string;
  icon: React.ReactNode;
  onClick?: () => void;
};

function Option({ text, link, icon, onClick }: OptionProps) {
  return (
    <Link
      href={"/" + link}
      className="border-2 border-gray-700 flex-1 text-center text-sm hover:bg-gray-900 duration-300 rounded-lg
      flex flex-col items-center justify-center px-8 py-3 gap-y-3 text-gray-300"
      onClick={onClick}
    >
      {icon}
      {text}
    </Link>
  );
}

export default Option;
