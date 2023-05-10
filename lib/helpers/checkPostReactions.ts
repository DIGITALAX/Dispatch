import {
  hasReactedPost,
  hasReactedFeed,
} from "@/graphql/lens/queries/hasReacted";

const checkPostReactions = async (
  publicationObject: any,
  lensProfile: string | undefined,
  type?: boolean
): Promise<any> => {
  let hasReactedArr: any[] = [];
  let hasReacted: any;
  try {
    if (type) {
      const data = await hasReactedFeed(publicationObject, {
        profileId: lensProfile,
      });
      hasReacted = data.data.feed.items;
    } else {
      const data = await hasReactedPost(publicationObject, {
        profileId: lensProfile,
      });
      hasReacted = data.data.publications.items;
    }

    for (let i = 0; i < hasReacted.length; i++) {
      if (
        (type ? hasReacted[i].root.reaction : hasReacted[i].reaction) ===
        "UPVOTE"
      ) {
        hasReactedArr.push(true);
      } else {
        hasReactedArr.push(false);
      }
    }
    return hasReactedArr.sort(
      (a: any, b: any) => Date.parse(b.createdAt) - Date.parse(a.createdAt)
    );
  } catch (err: any) {
    console.error(err.message);
  }
};

export default checkPostReactions;
