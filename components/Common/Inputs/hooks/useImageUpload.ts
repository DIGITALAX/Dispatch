import fileLimitAlert from "@/lib/helpers/fileLimitAlert";
import { setCollectionDetails } from "@/redux/reducers/collectionDetailsSlice";
import { setDropDetails } from "@/redux/reducers/dropDetailsSlice";
import { RootState } from "@/redux/store";
import { FormEvent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const useImageUpload = () => {
  const dispatch = useDispatch();
  const [mainImage, setMainImage] = useState<string>("");
  const dropValues = useSelector(
    (state: RootState) => state.app.dropDetailsReducer
  );
  const collectionValues = useSelector(
    (state: RootState) => state.app.collectionDetailsReducer
  );
  const [type, setType] = useState<string>("");
  const [fileType, setFileType] = useState<string>("");

  const uploadImage = async (
    e: FormEvent<Element>,
    setImageLoading: (e: boolean) => void,
    type: string
  ) => {
    try {
      if ((e as any).target.files.length < 1) {
        return;
      }
      if (fileLimitAlert((e as any).target.files[0])) {
        return;
      }
      setType(type);
      setFileType((e as any).target.files[0].type);
      setImageLoading(true);
      const response = await fetch("/api/ipfs", {
        method: "POST",
        body: (e.target as HTMLFormElement).files[0],
      });
      let cid = await response.json();
      if (cid) {
        setMainImage(cid?.cid);
      }
    } catch (err: any) {
      console.error(err.message);
    }
    setImageLoading(false);
  };

  useEffect(() => {
    if (mainImage !== "") {
      if (type === "drop") {
        dispatch(
          setDropDetails({
            actionTitle: dropValues.title,
            actionImage: mainImage,
            actionCollectionIds: dropValues.collectionIds,
            actionDisabled: false,
            actionFileType: fileType,
            actionId: dropValues.id,
            actionType: dropValues.type,
            actionContractType: dropValues.contractType,
          })
        );
      } else if (type === "collection") {
        dispatch(
          setCollectionDetails({
            actionTitle: collectionValues.title,
            actionDescription: collectionValues.description,
            actionImage: mainImage,
            actionAmount: collectionValues?.amount,
            actionAcceptedTokens: collectionValues?.acceptedTokens,
            actionTokenPrices: collectionValues?.tokenPrices,
            actionDisabled: false,
            actionFileType: fileType,
            actionId: collectionValues?.id,
            actionContractType: collectionValues?.contractType,
          })
        );
      }
    }
  }, [mainImage]);

  return { uploadImage };
};

export default useImageUpload;
