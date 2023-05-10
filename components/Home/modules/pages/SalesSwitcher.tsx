import SalesHistory from "@/components/Common/Sales/SalesHistory";
import useSales from "@/components/Common/Sales/hooks/useSales";
import { RootState } from "@/redux/store";
import { FunctionComponent } from "react";
import { useSelector } from "react-redux";

const SalesSwitcher: FunctionComponent = (): JSX.Element => {
  const salesReducer = useSelector(
    (state: RootState) => state.app.salesReducer.value
  );
  const { sales, salesLoading } = useSales();
  return (
    <SalesHistory
      sales={sales}
      salesReducer={salesReducer}
      salesLoading={salesLoading}
    />
  );
};

export default SalesSwitcher;
