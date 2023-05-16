import { Erc20 } from "@/components/Home/types/lens.types";
import availableCurrencies from "@/lib/helpers/availableCurrencies";
import handleSetCollectValues from "@/lib/helpers/handleSetCollectValues";
import { RootState } from "@/redux/store";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAccount } from "wagmi";

const useCollectOptions = () => {
  const dispatch = useDispatch();
  const profileId = useSelector(
    (state: RootState) => state.app.lensProfileReducer.profile?.id
  );
  const collectOpen = useSelector(
    (state: RootState) => state.app.collectOpenReducer.value
  );
  const page = useSelector((state: RootState) => state.app.pageReducer.value);
  const [enabledCurrencies, setEnabledCurrencies] = useState<Erc20[]>([]);
  const [audienceType, setAudienceType] = useState<string>("everyone");
  const [enabledCurrency, setEnabledCurrency] = useState<string>();
  const [chargeCollectDropDown, setChargeCollectDropDown] =
    useState<boolean>(false);
  const [audienceDropDown, setAudienceDropDown] = useState<boolean>(false);
  const [currencyDropDown, setCurrencyDropDown] = useState<boolean>(false);
  const [limitedDropDown, setLimitedDropDown] = useState<boolean>(false);
  const [limitedEdition, setLimitedEdition] = useState<string>("no");
  const [collectibleDropDown, setCollectibleDropDown] =
    useState<boolean>(false);
  const [timeLimit, setTimeLimit] = useState<string>("no");
  const [timeLimitDropDown, setTimeLimitDropDown] = useState<boolean>(false);
  const [chargeCollect, setChargeCollect] = useState<string>("no");
  const [collectible, setCollectible] = useState<string>("yes");
  const [limit, setLimit] = useState<number>(1);
  const [value, setValue] = useState<number>(0);
  const [referral, setReferral] = useState<number>(0);
  const { address } = useAccount();
  const audienceTypes: string[] = ["followers", "everyone"];
  const [collectNotif, setCollectNotif] = useState<string>("");
  const [audienceTypePost, setAudienceTypePost] = useState<string>("everyone");
  const [enabledCurrencyPost, setEnabledCurrencyPost] = useState<string>();
  const [chargeCollectDropDownPost, setChargeCollectDropDownPost] =
    useState<boolean>(false);
  const [audienceDropDownPost, setAudienceDropDownPost] =
    useState<boolean>(false);
  const [currencyDropDownPost, setCurrencyDropDownPost] =
    useState<boolean>(false);
  const [limitedDropDownPost, setLimitedDropDownPost] =
    useState<boolean>(false);
  const [limitedEditionPost, setLimitedEditionPost] = useState<string>("no");
  const [collectibleDropDownPost, setCollectibleDropDownPost] =
    useState<boolean>(false);
  const [timeLimitPost, setTimeLimitPost] = useState<string>("no");
  const [timeLimitDropDownPost, setTimeLimitDropDownPost] =
    useState<boolean>(false);
  const [chargeCollectPost, setChargeCollectPost] = useState<string>("no");
  const [collectiblePost, setCollectiblePost] = useState<string>("yes");
  const [limitPost, setLimitPost] = useState<number>(1);
  const [valuePost, setValuePost] = useState<number>(0);
  const [referralPost, setReferralPost] = useState<number>(0);
  const [collectNotifPost, setCollectNotifPost] = useState<string>("");

  useMemo(() => {
    try {
      availableCurrencies(
        setEnabledCurrencies,
        setEnabledCurrency,
        setEnabledCurrencyPost
      );
    } catch (err) {
      console.error(err);
    }
  }, [collectOpen, page]);

  const handleCollectValuesComment = (): void => {
    if (value <= 0 && chargeCollect === "yes") {
      setCollectNotifPost("Please set a Creator Award Value for your comment!");
      return;
    } else if (limitedEdition && limit < 1 && chargeCollect === "yes") {
      setCollectNotifPost(
        "A limited edition comment must have at least an amount of 1!"
      );
      return;
    } else {
      setCollectNotifPost("");
    }

    handleSetCollectValues(
      value,
      chargeCollect,
      dispatch,
      limit,
      enabledCurrency,
      enabledCurrencies,
      collectible,
      audienceType,
      timeLimit,
      limitedEdition,
      referral,
      address as string
    );
  };

  const handleCollectValuesPost = (): void => {
    if (value <= 0 && chargeCollect === "yes") {
      setCollectNotif("Please set a Creator Award Value for your comment!");
      return;
    } else if (limitedEdition && limit < 1 && chargeCollect === "yes") {
      setCollectNotif(
        "A limited edition comment must have at least an amount of 1!"
      );
      return;
    } else {
      setCollectNotif("");
    }

    handleSetCollectValues(
      valuePost,
      chargeCollectPost,
      dispatch,
      limitPost,
      enabledCurrencyPost,
      enabledCurrencies,
      collectiblePost,
      audienceTypePost,
      timeLimitPost,
      limitedEditionPost,
      referralPost,
      address as string
    );
  };

  useEffect(() => {
    if (address && profileId) {
      handleCollectValuesPost();
    }
  }, [
    valuePost,
    chargeCollectPost,
    limitPost,
    enabledCurrencyPost,
    collectiblePost,
    audienceTypePost,
    timeLimitPost,
    limitedEditionPost,
    referralPost,
    setValuePost,
    setLimitPost,
    setLimitedEditionPost,
    setTimeLimitPost,
    setEnabledCurrencyPost,
    setReferralPost,
    setChargeCollectPost,
    setCollectiblePost,
    setAudienceTypePost,
    collectNotifPost,
  ]);

  useEffect(() => {
    if (address && profileId) {
      handleCollectValuesComment();
    }
  }, [
    value,
    chargeCollect,
    limit,
    enabledCurrency,
    enabledCurrencies,
    collectible,
    audienceType,
    timeLimit,
    limitedEdition,
    referral,
    setValue,
    setLimit,
    setLimitedEdition,
    setTimeLimit,
    setEnabledCurrency,
    setReferral,
    setChargeCollect,
    setCollectible,
    setAudienceType,
    collectNotif,
  ]);

  return {
    collectNotif,
    referral,
    setCollectible,
    collectibleDropDown,
    setCollectibleDropDown,
    collectible,
    setAudienceDropDown,
    audienceType,
    audienceTypes,
    chargeCollect,
    limit,
    limitedEdition,
    audienceDropDown,
    setAudienceType,
    setTimeLimit,
    timeLimit,
    timeLimitDropDown,
    setTimeLimitDropDown,
    setLimitedEdition,
    limitedDropDown,
    setLimitedDropDown,
    setReferral,
    setLimit,
    setChargeCollect,
    setCurrencyDropDown,
    chargeCollectDropDown,
    setChargeCollectDropDown,
    enabledCurrencies,
    enabledCurrency,
    currencyDropDown,
    setEnabledCurrency,
    value,
    setValue,
    setValuePost,
    valuePost,
    setEnabledCurrencyPost,
    referralPost,
    setCollectiblePost,
    collectibleDropDownPost,
    setCollectibleDropDownPost,
    collectiblePost,
    setAudienceDropDownPost,
    audienceTypePost,
    chargeCollectPost,
    limitPost,
    limitedEditionPost,
    audienceDropDownPost,
    setAudienceTypePost,
    setTimeLimitPost,
    timeLimitPost,
    timeLimitDropDownPost,
    setTimeLimitDropDownPost,
    setLimitedEditionPost,
    limitedDropDownPost,
    setLimitedDropDownPost,
    setReferralPost,
    setLimitPost,
    setChargeCollectPost,
    setCurrencyDropDownPost,
    chargeCollectDropDownPost,
    setChargeCollectDropDownPost,
    enabledCurrencyPost,
    currencyDropDownPost,
  };
};

export default useCollectOptions;
