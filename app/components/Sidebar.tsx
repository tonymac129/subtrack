import Link from "next/link";

function Sidebar() {
  return (
    <div className="flex flex-col gap-y-3 py-5 w-50 pr-5 border-r-2 border-gray-700 h-[calc(100vh-61px)]">
      <Link href="/subscriptions" className="sidebar-item">
        Subscriptions
      </Link>
      <Link href="/" className="sidebar-item">
        More coming soon!
      </Link>
    </div>
  );
}

export default Sidebar;
