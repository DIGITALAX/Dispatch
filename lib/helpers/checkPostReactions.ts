import hasReactedPost from "@/graphql/lens/queries/hasReacted";

const checkPostReactions = async (
  publicationObject: any,
  lensProfile: string | undefined
): Promise<any> => {
  let hasReactedArr: any[] = [];
  try {
    const hasReacted = await hasReactedPost(publicationObject, {
      profileId: lensProfile,
    });
    for (let i = 0; i < hasReacted.data.publications.items.length; i++) {
      if (hasReacted.data.publications.items[i].reaction === "UPVOTE") {
        hasReactedArr.push(true);
      } else {
        hasReactedArr.push(false);
      }
    }
    return hasReactedArr;
  } catch (err: any) {
    console.error(err.message);
  }
};

export default checkPostReactions;
