import {
  PostImage,
  UploadedMedia,
} from "@/components/Common/TokenGated/types/allPosts.types";
import lodash from "lodash";
import { v4 as uuidv4 } from "uuid";

const uploadPostContent = async (
  postImages: UploadedMedia[] | undefined,
  postDescription: string,
  setContentURI?: (e: string | undefined) => void,
  contentURI?: string | undefined,
  gated?: boolean,
  drops?: string[]
): Promise<string | undefined | any> => {
  let newImages: PostImage[] = [];
  postImages?.forEach((image) => {
    newImages.push({
      item: image.type !== 2 ? "ipfs://" + image.cid : image.cid,
      type:
        image.type === 1
          ? "image/png"
          : image.type === 2
          ? "image/gif"
          : "video/mp4",
      altTag: image.cid,
    });
  });

  const coverImage = lodash?.filter(newImages, (image: PostImage) => {
    if (image.type === "image/png" || image.type === "image/gif") return true;
  });
  const videos = lodash?.filter(newImages, (image: PostImage) => {
    if (image.type === "video/mp4") return true;
  });

  const data = {
    version: "2.0.0",
    metadata_id: uuidv4(),
    description:
      gated && drops
        ? `align the signs to unlock this gate. ${drops.join(", ")} ${
            drops?.length > 1 ? "are" : "is"
          } ready to collect now on chromadin.`
        : postDescription.length < 0 || postDescription.trim().length < 0
        ? null
        : postDescription,
    content:
      postDescription.length < 0 || postDescription.trim().length < 0
        ? null
        : postDescription,
    external_url: "https://www.chromadin.xyz/",
    image: coverImage.length > 0 ? (coverImage[0] as any).item : null,
    imageMimeType: "image/png",
    name: postDescription ? postDescription?.slice(0, 20) : "Chromadin",
    mainContentFocus:
      videos?.length > 0
        ? "VIDEO"
        : newImages.length > 0
        ? "IMAGE"
        : postDescription?.length > 270
        ? "ARTICLE"
        : "TEXT_ONLY",
    contentWarning: null,
    attributes: [],
    media: newImages,
    locale: "en",
    tags: gated ? ["encrypted", "chromadin", "labyrinth"] : null,
    appId: "chromadin",
  };

  if (gated) {
    return data;
  }

  try {
    const response = await fetch("/api/ipfs", {
      method: "POST",
      body: JSON.stringify(data),
    });
    if (response.status !== 200) {
    } else {
      let responseJSON = await response.json();
      setContentURI && setContentURI(responseJSON.cid);
      return responseJSON.cid;
    }
  } catch (err: any) {
    console.error(err.message);
  }
  return contentURI;
};

export default uploadPostContent;
