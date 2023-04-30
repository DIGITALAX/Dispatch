import { FunctionComponent } from "react";
import DropsSwitcher from "./pages/DropsSwitcher";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import TokenGatedSwitcher from "./pages/TokenGatedSwitcher";

const Switcher: FunctionComponent = (): JSX.Element => {
  const pages = useSelector((state: RootState) => state.app.pageReducer.value);

  switch (pages) {
    case "token gated":
      return <TokenGatedSwitcher />;

    default:
      return <DropsSwitcher />;
  }
};

export default Switcher;
