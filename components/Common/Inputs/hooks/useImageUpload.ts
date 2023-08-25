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
import { setPostGateImages } from "@/redux/reducers/postGatedImageSlice";

const useImageUpload = () => {
  const dispatch = useDispatch();
  const [mainImage, setMainImage] = useState<string>("");
  const [mainAudio, setMainAudio] = useState<{
    audio: string;
    audioFileName: string;
  }>({
    audio: "",
    audioFileName: "",
  });
  const [imageLoadingComment, setImageLoadingComment] =
    useState<boolean>(false);
  const [videoLoadingComment, setVideoLoadingComment] =
    useState<boolean>(false);
  const [mappedFeaturedFilesComment, setMappedFeaturedFilesComment] = useState<
    UploadedMedia[]
  >([]);
  const [imageLoadingPost, setImageLoadingPost] = useState<boolean>(false);
  const [videoLoadingPost, setVideoLoadingPost] = useState<boolean>(false);
  const [mappedFeaturedFilesPost, setMappedFeaturedFilesPost] = useState<
    UploadedMedia[]
  >([]);
  const imagesUploaded = useSelector(
    (state: RootState) => state.app.postImageReducer.value
  );
  const imagesUploadedPost = useSelector(
    (state: RootState) => state.app.postGatedImageReducer.value
  );
  const dropValues = useSelector(
    (state: RootState) => state.app.dropDetailsReducer
  );
  const collectionValues = useSelector(
    (state: RootState) => state.app.collectionDetailsReducer
  );
  const [type, setType] = useState<string>("");
  const [fileType, setFileType] = useState<string>("");

  const uploadAudio = async (
    e: FormEvent<Element>,
    setAudioLoading: (e: boolean) => void
  ) => {
    try {
      if ((e as any).target.files.length < 1) {
        return;
      }
      setType(type);
      setFileType((e as any).target.files[0].type);
      setAudioLoading(true);

      const response = await fetch("/api/ipfs", {
        method: "POST",
        body: (e.target as HTMLFormElement).files[0],
      });
      let cid = await response.json();
      if (cid) {
        setMainAudio({
          audio: cid?.cid,
          audioFileName: (e as any).target.files[0].name,
        });
      }
    } catch (err: any) {
      console.error(err.message);
    }
    setAudioLoading(false);
  };

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
      console.log({cid})
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
            actionOld: dropValues.old,
          })
        );
      } else if (type === "collection") {
        dispatch(
          setCollectionDetails({
            actionTitle: collectionValues.title,
            actionDescription: collectionValues.description,
            actionImage: mainImage,
            actionAudio: collectionValues?.audio,
            actionAudioFileName: collectionValues?.audioFileName,
            actionAmount: collectionValues?.amount,
            actionAcceptedTokens: collectionValues?.acceptedTokens,
            actionTokenPrices: collectionValues?.tokenPrices,
            actionDisabled: collectionValues?.disabled,
            actionFileType: fileType,
            actionId: collectionValues?.id,
            actionSoldTokens: collectionValues?.soldTokens,
            actionTokenIds: collectionValues?.tokenIds,
            actionLive: collectionValues?.live,
            actionOld: collectionValues?.old,
          })
        );
      }
    } else if (mainAudio.audio !== "") {
      dispatch(
        setCollectionDetails({
          actionTitle: collectionValues.title,
          actionDescription: collectionValues.description,
          actionImage: collectionValues.image,
          actionAudio: mainAudio.audio,
          actionAudioFileName: mainAudio.audioFileName,
          actionAmount: collectionValues?.amount,
          actionAcceptedTokens: collectionValues?.acceptedTokens,
          actionTokenPrices: collectionValues?.tokenPrices,
          actionDisabled: collectionValues?.disabled,
          actionFileType: fileType,
          actionId: collectionValues?.id,
          actionSoldTokens: collectionValues?.soldTokens,
          actionTokenIds: collectionValues?.tokenIds,
          actionLive: collectionValues?.live,
          actionOld: collectionValues?.old,
        })
      );
    }
  }, [mainImage, mainAudio]);

  const uploadVideo = async (
    e: FormEvent,
    setVideoLoading: (e: boolean) => void,
    setMappedFeaturedFiles: (e: UploadedMedia[]) => void,
    uploadImages: UploadedMedia[]
  ) => {
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
        ...uploadImages,
        { cid: String(cid?.cid), type: MediaType.Video },
      ];
      setMappedFeaturedFiles(newArr);
    } catch (err: any) {
      console.error(err.message);
    }
    setVideoLoading(false);
  };

  const handleRemoveImage = (
    image: UploadedMedia,
    setMappedFeaturedFiles: (e: UploadedMedia[]) => void,
    uploadImages: UploadedMedia[]
  ): void => {
    const cleanedArray = lodash?.filter(
      uploadImages,
      (uploaded) => uploaded.cid !== image.cid
    );
    setMappedFeaturedFiles(cleanedArray);
  };

  const uploadImages = async (
    e: FormEvent | File,
    setImageLoading: (e: boolean) => void,
    setMappedFeaturedFiles: (e: UploadedMedia[]) => void,
    uploadedImages: UploadedMedia[]
  ): Promise<void> => {
    let finalImages: UploadedMedia[] = [];
    if ((e as any).target.files.length < 1) {
      return;
    }
    setImageLoading(true);

    if (fileLimitAlert((e as any).target.files[0])) {
      setImageLoading(false);
      return;
    }
    Array.from(((e as FormEvent).target as HTMLFormElement)?.files).map(
      async (_, index: number) => {
        try {
          // const compressedImage = await compressImageFiles(
          //   (e as any).target.files[index] as File
          // );
          const response = await fetch("/api/ipfs", {
            method: "POST",
            body: (e as any).target.files[index],
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
              let newArr = [...(uploadedImages as any), ...finalImages];

              setMappedFeaturedFiles(newArr);
              setImageLoading(false);
            }
          }
        } catch (err: any) {
          console.error(err.message);
        }
      }
    );
  };

  useEffect(() => {
    if (mappedFeaturedFilesComment.length > 3) {
      setMappedFeaturedFilesComment(mappedFeaturedFilesComment.slice(0, 4));
      dispatch(setPostImages(mappedFeaturedFilesComment.slice(0, 4)));
    } else {
      dispatch(setPostImages(mappedFeaturedFilesComment));
    }
  }, [mappedFeaturedFilesComment]);

  useEffect(() => {
    if (mappedFeaturedFilesPost.length > 3) {
      setMappedFeaturedFilesPost(mappedFeaturedFilesPost.slice(0, 4));
      dispatch(setPostGateImages(mappedFeaturedFilesPost.slice(0, 4)));
    } else {
      dispatch(setPostGateImages(mappedFeaturedFilesPost));
    }
  }, [mappedFeaturedFilesPost]);

  return {
    uploadImage,
    handleRemoveImage,
    imageLoadingComment,
    videoLoadingComment,
    uploadVideo,
    uploadImages,
    mappedFeaturedFilesComment,
    videoLoadingPost,
    imageLoadingPost,
    mappedFeaturedFilesPost,
    setMappedFeaturedFilesComment,
    setMappedFeaturedFilesPost,
    imagesUploaded,
    imagesUploadedPost,
    setImageLoadingPost,
    setVideoLoadingPost,
    setImageLoadingComment,
    setVideoLoadingComment,
    uploadAudio,
  };
};

export default useImageUpload;
