import AddDrop from "@/components/Components/Drops/modules/AddDrop";
import AllDrops from "@/components/Components/Drops/modules/AllDrops";
import { RootState } from "@/redux/store";
import { FunctionComponent } from "react";
import { useDispatch, useSelector } from "react-redux";

const DropsSwitcher: FunctionComponent = (): JSX.Element => {
  const dropSwitcher = useSelector(
    (state: RootState) => state.app.dropSwitcherReducer.value
  );
  const dispatch = useDispatch();

  switch (dropSwitcher) {
    case "add":
      return <AddDrop />;

    default:
      return <AllDrops dispatch={dispatch} />;
  }
};

export default DropsSwitcher;
