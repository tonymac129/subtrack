"use client";

import { ProjectType } from "@/types/projects";
import Stat from "../ui/Stat";

function Project({ userProjects }: { userProjects: ProjectType[] }) {
  return (
    <div className=" border-gray-700 border-2 rounded-lg py-5 flex flex-col gap-y-5 px-10 flex-1">
      <h2 className="text-blue-600 text-xl font-bold text-center">
        Project Insights
      </h2>
      <div className="flex items-center flex-wrap w-full gap-5">
        <Stat
          big={userProjects?.length.toString()}
          description={`Total project${userProjects?.length === 1 ? "" : "s"}`}
        />
      </div>
    </div>
  );
}

export default Project;
