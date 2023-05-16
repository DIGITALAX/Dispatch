import fileLimitAlert from "@/lib/helpers/fileLimitAlert";
import { setCollectionDetails } from "@/redux/reducers/collectionDetailsSlice";
import { setDropDetails } from "@/redux/reducers/dropDetailsSlice";
import { RootState } from "@/redux/store";
import { FormEvent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  MediaType,
  UploadedMedia,
} from "../../TokenGated/types/allPosts.types";
import { setPostImages } from "@/redux/reducers/postImageSlice";
import lodash from "lodash";
import videoLimitAlert from "@/lib/helpers/videoLimitAlert";
import compressImageFiles from "@/lib/helpers/compressImageFiles";

const useImageUpload = () => {
  const dispatch = useDispatch();
  const [mainImage, setMainImage] = useState<string>("");
  const [imageLoading, setImageLoading] = useState<boolean>(false);
  const [videoLoading, setVideoLoading] = useState<boolean>(false);
  const [mappedFeaturedFiles, setMappedFeaturedFiles] = useState<
    UploadedMedia[]
  >([]);
  const imagesUploaded = useSelector(
    (state: RootState) => state.app.postImageReducer.value
  );

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
            actionDisabled: collectionValues?.disabled,
            actionFileType: fileType,
            actionId: collectionValues?.id,
            actionSoldTokens: collectionValues?.soldTokens,
            actionTokenIds: collectionValues?.tokenIds,
            actionLive: collectionValues?.live,
          })
        );
      }
    }
  }, [mainImage]);

  const uploadVideo = async (e: FormEvent) => {
    try {
      if ((e as any).target.files.length < 1) {
        return;
      }
      if (videoLimitAlert((e as any).target.files[0])) {
        return;
      }
      setVideoLoading(true);
      const response = await fetch("/api/ipfs", {
        method: "POST",
        body: (e.target as HTMLFormElement).files[0],
      });
      let cid = await response.json();
      let newArr = [
        ...(imagesUploaded as any),
        { cid: String(cid?.cid), type: MediaType.Video },
      ];
      setMappedFeaturedFiles(newArr);
    } catch (err: any) {
      console.error(err.message);
    }
    setVideoLoading(false);
  };

  const handleRemoveImage = (image: UploadedMedia): void => {
    const cleanedArray = lodash.filter(
      imagesUploaded,
      (uploaded) => uploaded.cid !== image.cid
    );
    setMappedFeaturedFiles(cleanedArray);
  };

  const uploadImages = async (
    e: FormEvent | File,
    canvas?: boolean
  ): Promise<void> => {
    if (!canvas) {
      if ((e as any)?.target?.files?.length < 1) {
        return;
      }
    }
    let finalImages: UploadedMedia[] = [];
    setImageLoading(true);
    if (canvas) {
      try {
        const compressedImage = await compressImageFiles(e as File);
        const response = await fetch("/api/ipfs", {
          method: "POST",
          body: compressedImage as any,
        });
        let cid = await response.json();
        finalImages.push({
          cid: String(cid?.cid),
          type: MediaType.Image,
        });
        setMappedFeaturedFiles([...finalImages]);
      } catch (err: any) {
        console.error(err.message);
      }
      setImageLoading(false);
    } else {
      if (fileLimitAlert((e as any).target.files[0])) {
        setImageLoading(false);
        return;
      }
      Array.from(((e as FormEvent).target as HTMLFormElement)?.files).map(
        async (_, index: number) => {
          try {
            const compressedImage = await compressImageFiles(
              (e as any).target.files[index] as File
            );
            const response = await fetch("/api/ipfs", {
              method: "POST",
              body: compressedImage as any,
            });
            if (response.status !== 200) {
              setImageLoading(false);
            } else {
              let cid = await response.json();
              finalImages.push({
                cid: String(cid?.cid),
                type: MediaType.Image,
              });
              if (
                finalImages?.length ===
                ((e as FormEvent).target as HTMLFormElement).files?.length
              ) {
                let newArr = [...(imagesUploaded as any), ...finalImages];
                setMappedFeaturedFiles(newArr);
              }
            }
          } catch (err: any) {
            console.error(err.message);
          }
        }
      );
    }
  };

  useEffect(() => {
    if (mappedFeaturedFiles.length > 3) {
      setMappedFeaturedFiles(mappedFeaturedFiles.slice(0, 4));
      dispatch(setPostImages(mappedFeaturedFiles.slice(0, 4)));
    } else {
      dispatch(setPostImages(mappedFeaturedFiles));
    }
  }, [mappedFeaturedFiles]);

  return {
    uploadImage,
    handleRemoveImage,
    imageLoading,
    videoLoading,
    uploadVideo,
    uploadImages,
    mappedFeaturedFiles,
  };
};

export default useImageUpload;
