import { FunctionComponent } from "react";
import { DashboardProps } from "../types/connect.types";

const Dashboard: FunctionComponent<DashboardProps> = ({
  router,
}): JSX.Element => {
  return (
    <div className="relative w-40 h-10 font-earl text-white border-white border rounded-tl-lg rounded-br-lg flex flex-row px-2 gap-4 items-center justify-center bg-black cursor-pointer hover:opacity-70 active:scale-95">
      <div
        className="relative w-fit h-fit text-sm sm:text-xs lg:text-sm text-pesa"
        onClick={() => router.push("/dashboard")}
      >
        Go To Dashboard
      </div>
    </div>
  );
};

export default Dashboard;
