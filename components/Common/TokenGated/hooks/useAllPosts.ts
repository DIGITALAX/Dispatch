import { Publication } from "@/components/Home/types/lens.types";
import { feedTimeline } from "@/graphql/lens/queries/getTimeline";
import {
  profilePublicationsAuth,
  profilePublicationsAuthDecrypt,
} from "@/graphql/lens/queries/getVideos";
import { Signer } from "ethers";
import { Web3Provider } from "@ethersproject/providers";
import { LENS_CREATORS } from "@/lib/constants";
import checkIfMirrored from "@/lib/helpers/checkIfMirrored";
import checkPostReactions from "@/lib/helpers/checkPostReactions";
import { setCommentFeedCount } from "@/redux/reducers/commentCountSlice";
import { setFeedsRedux } from "@/redux/reducers/feedSlice";
import { setIndividualFeedCount } from "@/redux/reducers/individualFeedCountSlice";
import { setPaginated } from "@/redux/reducers/paginatedSlice";
import { setReactionFeedCount } from "@/redux/reducers/reactionFeedCountSlice";
import { setReactionTimelineCount } from "@/redux/reducers/reactionTimelineCountSlice";
import { setScrollPosRedux } from "@/redux/reducers/scrollPosSlice";
import { setTimelinesRedux } from "@/redux/reducers/timelineSlice";
import { RootState } from "@/redux/store";
import { LensEnvironment, LensGatedSDK } from "@lens-protocol/sdk-gated";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSigner } from "wagmi";
import { getPostData } from "@/lib/lens/utils";
import fetchIPFSJSON from "@/lib/helpers/fetchIPFSJSON";

const useAllPosts = () => {
  const { data: signer } = useSigner();
  const lensProfile = useSelector(
    (state: RootState) => state.app.lensProfileReducer.profile?.id
  );
  const feedDispatch = useSelector(
    (state: RootState) => state.app.feedReducer.value
  );
  const timelineDispatch = useSelector(
    (state: RootState) => state.app.timelineReducer.value
  );
  const indexer = useSelector(
    (state: RootState) => state.app.indexModalReducer
  );
  const feedId = useSelector(
    (state: RootState) => state.app.feedReactIdReducer
  );
  const postImages = useSelector(
    (state: RootState) => state?.app?.postGatedImageReducer?.value
  );
  const reactionFeedCount = useSelector(
    (state: RootState) => state.app.reactionFeedCountReducer
  );
  const reactionTimelineCount = useSelector(
    (state: RootState) => state.app.reactionTimelineCountReducer
  );
  const auth = useSelector(
    (state: RootState) => state.app.authStatusReducer.value
  );
  const feedSwitch = useSelector(
    (state: RootState) => state.app.feedSwitchReducer.value
  );
  const feedType = useSelector(
    (state: RootState) => state.app.feedTypeReducer.value
  );
  const commentFeed = useSelector(
    (state: RootState) => state.app.commentCountReducer
  );
  const comments = useSelector(
    (state: RootState) => state.app.commentsReducer.value
  );
  const paginated = useSelector(
    (state: RootState) => state.app.paginatedReducer
  );
  const individual = useSelector(
    (state: RootState) => state.app.individualFeedCountReducer
  );
  const scrollPos = useSelector(
    (state: RootState) => state.app.scrollPosReducer
  );
  const page = useSelector((state: RootState) => state.app.pageReducer.value);
  const dispatch = useDispatch();
  const [followerOnly, setFollowerOnly] = useState<boolean[]>([]);
  const [postsLoading, setPostsLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [hasMoreTimeline, setHasMoreTimeline] = useState<boolean>(true);
  const [followerOnlyTimeline, setFollowerOnlyTimeline] = useState<boolean[]>(
    []
  );

  const getFeed = async (): Promise<void> => {
    setPostsLoading(true);
    try {
      const data = await profilePublicationsAuthDecrypt(
        {
          profileId: lensProfile,
          publicationTypes: ["POST", "COMMENT", "MIRROR"],
          limit: 10,
        },
        lensProfile
      );
      if (!data || !data?.data || !data?.data?.publications) {
        setPostsLoading(false);
        return;
      }
      const arr: any[] = [...data?.data.publications?.items];
      const sortedArr = arr
        .sort(
          (a: any, b: any) => Date.parse(b.createdAt) - Date.parse(a.createdAt)
        )
        .filter(
          (post) =>
            (post.canDecrypt && post.canDecrypt.result) ||
            post?.metadata?.content.includes("This publication is gated")
        );
      if (sortedArr?.length < 10) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }

      if (sortedArr?.length < 1) {
        setPostsLoading(false);
        return;
      }

      const sdk = await LensGatedSDK.create({
        provider: new Web3Provider(window?.ethereum as any),
        signer: signer as Signer,
        env: LensEnvironment.Polygon,
      });

      const descryptedPosts = await Promise.all(
        sortedArr.map(async (post) => {
          if (post.canDecrypt && post.canDecrypt.result) {
            const data = await fetchIPFSJSON(
              post.onChainContentURI
                ?.split("ipfs://")[1]
                .replace(/"/g, "")
                .trim()
            );
            try {
              const { decrypted, error } = await sdk.gated.decryptMetadata(
                data.json
              );
              if (decrypted) {
                return decrypted;
              } else if (error) {
                return {
                  ...post,
                  gated: true,
                };
              }
            } catch (err: any) {
              console.error(err.message);
              return {
                ...post,
                gated: true,
              };
            }
          } else if (
            post?.metadata?.content.includes("This publication is gated")
          ) {
            return {
              ...post,
              gated: true,
            };
          } else {
            return post;
          }
        })
      );

      dispatch(
        setPaginated({
          actionPaginated: data?.data?.publications?.pageInfo,
          actionPaginatedTimeline: paginated.paginatedTimeline,
        })
      );
      const hasReactedArr = await checkPostReactions(
        {
          profileId: lensProfile,
          publicationTypes: ["POST", "COMMENT", "MIRROR"],
          limit: 10,
        },
        lensProfile
      );
      const hasMirroredArr = await checkIfMirrored(
        descryptedPosts,
        lensProfile
      );
      const hasCollectedArr = (descryptedPosts as any).map((obj: Publication) =>
        obj?.__typename === "Mirror"
          ? obj?.mirrorOf?.hasCollectedByMe
          : obj?.hasCollectedByMe
      );
      setFollowerOnly(
        (descryptedPosts as any).map((obj: Publication) =>
          obj?.__typename === "Mirror"
            ? obj?.mirrorOf?.referenceModule?.type ===
              "FollowerOnlyReferenceModule"
              ? true
              : false
            : obj?.referenceModule?.type === "FollowerOnlyReferenceModule"
            ? true
            : false
        )
      );
      dispatch(setFeedsRedux(descryptedPosts as any));
      dispatch(
        setReactionFeedCount({
          actionLike: (descryptedPosts as any).map((obj: Publication) =>
            obj?.__typename === "Mirror"
              ? obj?.mirrorOf?.stats?.totalUpvotes
              : obj?.stats?.totalUpvotes
          ),
          actionMirror: (descryptedPosts as any).map((obj: Publication) =>
            obj?.__typename === "Mirror"
              ? obj?.mirrorOf?.stats?.totalAmountOfMirrors
              : obj?.stats?.totalAmountOfMirrors
          ),
          actionCollect: (descryptedPosts as any).map((obj: Publication) =>
            obj?.__typename === "Mirror"
              ? obj?.mirrorOf?.stats?.totalAmountOfCollects
              : obj?.stats?.totalAmountOfCollects
          ),
          actionComment: (descryptedPosts as any).map((obj: Publication) =>
            obj?.__typename === "Mirror"
              ? obj?.mirrorOf?.stats?.totalAmountOfComments
              : obj?.stats?.totalAmountOfComments
          ),
          actionHasLiked: hasReactedArr.filter(
            (post: any) =>
              (post.canDecrypt && post.canDecrypt.result) ||
              post?.metadata?.content.includes("This publication is gated")
          ),
          actionHasMirrored: hasMirroredArr,
          actionHasCollected: hasCollectedArr,
        })
      );
    } catch (err: any) {
      console.error(err.message);
    }
    setPostsLoading(false);
  };

  const fetchMore = async (): Promise<void> => {
    try {
      if (!paginated?.paginated?.next) {
        // fix apollo duplications on null next
        setHasMore(false);
        return;
      }
      const data = await profilePublicationsAuthDecrypt(
        {
          profileId: lensProfile,
          publicationTypes: ["POST", "COMMENT", "MIRROR"],
          limit: 10,
          cursor: paginated?.paginated?.next,
        },
        lensProfile
      );

      const arr: any[] = [...data?.data?.publications?.items];
      const sortedArr = arr
        .sort(
          (a: any, b: any) => Date.parse(b.createdAt) - Date.parse(a.createdAt)
        )
        .filter(
          (post) =>
            (post.canDecrypt && post.canDecrypt.result) ||
            post?.metadata?.content.includes("This publication is gated")
        );
      if (sortedArr?.length < 10) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }

      if (sortedArr?.length < 1) {
        return;
      }

      const sdk = await LensGatedSDK.create({
        provider: new Web3Provider(window?.ethereum as any),
        signer: signer as Signer,
        env: LensEnvironment.Polygon,
      });

      const descryptedPosts = await Promise.all(
        sortedArr.map(async (post) => {
          if (post.canDecrypt && post.canDecrypt.result) {
            const data = await fetchIPFSJSON(
              post.onChainContentURI
                ?.split("ipfs://")[1]
                .replace(/"/g, "")
                .trim()
            );
            try {
              const { decrypted, error } = await sdk.gated.decryptMetadata(
                data.json
              );
              if (decrypted) {
                return decrypted;
              } else if (error) {
                return {
                  ...post,
                  gated: true,
                };
              }
            } catch (err: any) {
              console.error(err.message);
              return {
                ...post,
                gated: true,
              };
            }
          } else if (
            post?.metadata?.content.includes("This publication is gated")
          ) {
            return {
              ...post,
              gated: true,
            };
          } else {
            return post;
          }
        })
      );

      dispatch(setFeedsRedux([...feedDispatch, ...(descryptedPosts as any)]));
      dispatch(
        setPaginated({
          actionPaginated: data?.data?.publications?.pageInfo,
          actionPaginatedTimeline: paginated?.paginatedTimeline,
        })
      );
      const hasMirroredArr = await checkIfMirrored(
        descryptedPosts,
        lensProfile
      );
      const hasReactedArr = await checkPostReactions(
        {
          profileId: lensProfile,
          publicationTypes: ["POST", "COMMENT", "MIRROR"],
          limit: 10,
          cursor: paginated?.paginated?.next,
        },
        lensProfile
      );
      const hasCollectedArr = (descryptedPosts as any).map((obj: Publication) =>
        obj?.__typename === "Mirror"
          ? obj?.mirrorOf?.hasCollectedByMe
          : obj?.hasCollectedByMe
      );
      dispatch(
        setReactionFeedCount({
          actionLike: [
            ...reactionFeedCount.like,
            ...(descryptedPosts as any).map((obj: Publication) =>
              obj?.__typename === "Mirror"
                ? obj?.mirrorOf?.stats?.totalUpvotes
                : obj?.stats?.totalUpvotes
            ),
          ],
          actionMirror: [
            ...reactionFeedCount.mirror,
            ...(descryptedPosts as any).map((obj: Publication) =>
              obj?.__typename === "Mirror"
                ? obj?.mirrorOf?.stats?.totalAmountOfMirrors
                : obj?.stats?.totalAmountOfMirrors
            ),
          ],
          actionCollect: [
            ...reactionFeedCount.collect,
            ...(descryptedPosts as any).map((obj: Publication) =>
              obj?.__typename === "Mirror"
                ? obj?.mirrorOf?.stats?.totalAmountOfCollects
                : obj?.stats?.totalAmountOfCollects
            ),
          ],
          actionComment: [
            ...reactionFeedCount.comment,
            ...(descryptedPosts as any).map((obj: Publication) =>
              obj?.__typename === "Mirror"
                ? obj?.mirrorOf?.stats?.totalAmountOfComments
                : obj?.stats?.totalAmountOfComments
            ),
          ],
          actionHasLiked: [
            ...reactionFeedCount.hasLiked,
            ...hasReactedArr.filter(
              (post: any) =>
                (post.canDecrypt && post.canDecrypt.result) ||
                post?.metadata?.content.includes("This publication is gated")
            ),
          ],
          actionHasMirrored: [
            ...reactionFeedCount.hasMirrored,
            ...hasMirroredArr,
          ],
          actionHasCollected: [
            ...reactionFeedCount.hasCollected,
            ...hasCollectedArr,
          ],
        })
      );
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const getTimeline = async () => {
    setPostsLoading(true);
    try {
      const data = await feedTimeline(
        {
          profileIds: LENS_CREATORS,
          publicationTypes: ["POST", "COMMENT", "MIRROR"],
          limit: 10,
        },
        lensProfile
      );
      if (!data || !data?.data || !data?.data?.publications) {
        setPostsLoading(false);
        return;
      }
      const arr: any[] = [...data?.data.publications?.items];
      const sortedArr = arr.sort(
        (a: any, b: any) => Date.parse(b.createdAt) - Date.parse(a.createdAt)
      );

      if (sortedArr?.length < 10) {
        setHasMoreTimeline(false);
      } else {
        setHasMoreTimeline(true);
      }

      const sdk = await LensGatedSDK.create({
        provider: new Web3Provider(window?.ethereum as any),
        signer: signer as Signer,
        env: LensEnvironment.Polygon,
      });

      const descryptedPosts = await Promise.all(
        sortedArr.map(async (post) => {
          if (post.canDecrypt && post.canDecrypt.result) {
            const data = await fetchIPFSJSON(
              post.onChainContentURI
                ?.split("ipfs://")[1]
                .replace(/"/g, "")
                .trim()
            );
            try {
              const { decrypted, error } = await sdk.gated.decryptMetadata(data.json);
              if (decrypted) {
                return decrypted;
              } else if (error) {
                return {
                  ...post,
                  gated: true,
                };
              }
            } catch (err: any) {
              console.error(err.message);
              return {
                ...post,
                gated: true,
              };
            }
          } else if (
            post?.metadata?.content.includes("This publication is gated")
          ) {
            return {
              ...post,
              gated: true,
            };
          } else {
            return post;
          }
        })
      );

      dispatch(
        setPaginated({
          actionPaginated: paginated.paginated,
          actionPaginatedTimeline: data?.data?.publications?.pageInfo,
        })
      );
      const hasReactedArr = await checkPostReactions(
        {
          profileIds: LENS_CREATORS,
          publicationTypes: ["POST", "COMMENT", "MIRROR"],
          limit: 10,
        },
        lensProfile
      );
      const hasMirroredArr = await checkIfMirrored(
        descryptedPosts,
        lensProfile
      );
      const hasCollectedArr = descryptedPosts.map((obj: Publication) =>
        obj?.__typename === "Mirror"
          ? obj?.mirrorOf?.hasCollectedByMe
          : obj?.hasCollectedByMe
      );
      setFollowerOnlyTimeline(
        descryptedPosts.map((obj: Publication) =>
          obj?.__typename === "Mirror"
            ? obj?.mirrorOf?.referenceModule?.type ===
              "FollowerOnlyReferenceModule"
              ? true
              : false
            : obj?.referenceModule?.type === "FollowerOnlyReferenceModule"
            ? true
            : false
        )
      );
      dispatch(setTimelinesRedux(descryptedPosts));
      dispatch(
        setReactionTimelineCount({
          actionLike: descryptedPosts.map((obj: Publication) =>
            obj?.__typename === "Mirror"
              ? obj?.mirrorOf?.stats?.totalUpvotes
              : obj?.stats?.totalUpvotes
          ),
          actionMirror: descryptedPosts.map((obj: Publication) =>
            obj?.__typename === "Mirror"
              ? obj?.mirrorOf?.stats?.totalAmountOfMirrors
              : obj?.stats?.totalAmountOfMirrors
          ),
          actionCollect: descryptedPosts.map((obj: Publication) =>
            obj?.__typename === "Mirror"
              ? obj?.mirrorOf?.stats?.totalAmountOfCollects
              : obj?.stats?.totalAmountOfCollects
          ),
          actionComment: descryptedPosts.map((obj: Publication) =>
            obj?.__typename === "Mirror"
              ? obj?.mirrorOf?.stats?.totalAmountOfComments
              : obj?.stats?.totalAmountOfComments
          ),
          actionHasLiked: hasReactedArr,
          actionHasMirrored: hasMirroredArr,
          actionHasCollected: hasCollectedArr,
        })
      );
    } catch (err: any) {
      console.error(err.message);
    }
    setPostsLoading(false);
  };

  const fetchMoreTimeline = async () => {
    try {
      if (!paginated?.paginatedTimeline?.next) {
        // fix apollo duplications on null next
        setHasMoreTimeline(false);
        return;
      }
      const data = await feedTimeline(
        {
          profileIds: LENS_CREATORS,
          publicationTypes: ["POST", "COMMENT", "MIRROR"],
          limit: 10,
          cursor: paginated?.paginatedTimeline?.next,
        },
        lensProfile
      );

      const arr: any[] = [...data?.data?.publications?.items];
      const sortedArr = arr.sort(
        (a: any, b: any) => Date.parse(b.createdAt) - Date.parse(a.createdAt)
      );
      if (sortedArr?.length < 10) {
        setHasMoreTimeline(false);
      }
      {
        setHasMoreTimeline(true);
      }

      const sdk = await LensGatedSDK.create({
        provider: new Web3Provider(window?.ethereum as any),
        signer: signer as Signer,
        env: LensEnvironment.Polygon,
      });

      const descryptedPosts = await Promise.all(
        sortedArr.map(async (post) => {
          if (post.canDecrypt && post.canDecrypt.result) {
            try {
              const data = await fetchIPFSJSON(
                post.onChainContentURI
                  ?.split("ipfs://")[1]
                  .replace(/"/g, "")
                  .trim()
              );
              const { decrypted, error } = await sdk.gated.decryptMetadata(
                data.json
              );
              if (decrypted) {
                return decrypted;
              } else if (error) {
                return {
                  ...post,
                  gated: true,
                };
              }
            } catch (err: any) {
              console.error(err.message);
              return {
                ...post,
                gated: true,
              };
            }
          } else if (
            post?.metadata?.content.includes("This publication is gated")
          ) {
            return {
              ...post,
              gated: true,
            };
          } else {
            return post;
          }
        })
      );

      dispatch(setTimelinesRedux([...timelineDispatch, ...descryptedPosts]));
      dispatch(
        setPaginated({
          actionPaginated: paginated.paginated,
          actionPaginatedTimeline: data?.data?.publications?.pageInfo,
        })
      );
      const hasMirroredArr = await checkIfMirrored(
        descryptedPosts,
        lensProfile
      );
      const hasReactedArr = await checkPostReactions(
        {
          profileIds: LENS_CREATORS,
          publicationTypes: ["POST", "COMMENT", "MIRROR"],
          limit: 10,
          cursor: paginated?.paginatedTimeline?.next,
        },
        lensProfile
      );
      const hasCollectedArr = descryptedPosts.map((obj: Publication) =>
        obj?.__typename === "Mirror"
          ? obj?.mirrorOf?.hasCollectedByMe
          : obj?.hasCollectedByMe
      );
      dispatch(
        setReactionTimelineCount({
          actionLike: [
            ...reactionTimelineCount.like,
            ...descryptedPosts.map((obj: Publication) =>
              obj?.__typename === "Mirror"
                ? obj?.mirrorOf?.stats?.totalUpvotes
                : obj?.stats?.totalUpvotes
            ),
          ],
          actionMirror: [
            ...reactionTimelineCount.mirror,
            ...descryptedPosts.map((obj: Publication) =>
              obj?.__typename === "Mirror"
                ? obj?.mirrorOf?.stats?.totalAmountOfMirrors
                : obj?.stats?.totalAmountOfMirrors
            ),
          ],
          actionCollect: [
            ...reactionTimelineCount.collect,
            ...descryptedPosts.map((obj: Publication) =>
              obj?.__typename === "Mirror"
                ? obj?.mirrorOf?.stats?.totalAmountOfCollects
                : obj?.stats?.totalAmountOfCollects
            ),
          ],
          actionComment: [
            ...reactionTimelineCount.comment,
            ...descryptedPosts.map((obj: Publication) =>
              obj?.__typename === "Mirror"
                ? obj?.mirrorOf?.stats?.totalAmountOfComments
                : obj?.stats?.totalAmountOfComments
            ),
          ],
          actionHasLiked: [...reactionTimelineCount.hasLiked, ...hasReactedArr],
          actionHasMirrored: [
            ...reactionTimelineCount.hasMirrored,
            ...hasMirroredArr,
          ],
          actionHasCollected: [
            ...reactionTimelineCount.hasCollected,
            ...hasCollectedArr,
          ],
        })
      );
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const refetchInteractions = () => {
    try {
      const index = (feedSwitch ? feedDispatch : timelineDispatch)?.findIndex(
        (feed) =>
          (feed.__typename === "Mirror" ? feed.mirrorOf.id : feed.id) ===
          feedId.value
      );
      if (index !== -1) {
        dispatch(
          setIndividualFeedCount({
            actionLike:
              feedId.type === 0 ? individual.like + 1 : individual.like,
            actionMirror:
              feedId.type === 1 ? individual.mirror + 1 : individual.mirror,
            actionCollect:
              feedId.type === 2 ? individual.collect + 1 : individual.collect,
            actionComment:
              feedId.type === 3 ? individual.comment + 1 : individual.comment,
            actionHasLiked: feedId.type === 0 ? true : individual.hasLiked,
            actionHasMirrored: feedId.type === 1 ? true : individual.mirror,
            actionHasCollected: feedId.type === 2 ? true : individual.collect,
          })
        );

        if (feedSwitch) {
          dispatch(
            setReactionFeedCount({
              actionLike:
                feedId.type === 0
                  ? reactionFeedCount.like.map((obj: number, number: number) =>
                      number === index ? obj + 1 : obj
                    )
                  : reactionFeedCount.like,
              actionMirror:
                feedId.type === 1
                  ? reactionFeedCount.mirror.map(
                      (obj: number, number: number) =>
                        number === index ? obj + 1 : obj
                    )
                  : reactionFeedCount.mirror,
              actionCollect:
                feedId.type === 2
                  ? reactionFeedCount.collect.map(
                      (obj: number, number: number) =>
                        number === index ? obj + 1 : obj
                    )
                  : reactionFeedCount.collect,
              actionComment:
                feedId.type === 3
                  ? reactionFeedCount.comment.map(
                      (obj: number, number: number) =>
                        number === index ? obj + 1 : obj
                    )
                  : reactionFeedCount.comment,
              actionHasLiked:
                feedId.type === 0
                  ? reactionFeedCount.hasLiked.map(
                      (obj: boolean, number: number) =>
                        number === index ? true : obj
                    )
                  : reactionFeedCount.hasLiked,
              actionHasMirrored:
                feedId.type === 1
                  ? reactionFeedCount.hasMirrored.map(
                      (obj: boolean, number: number) =>
                        number === index ? true : obj
                    )
                  : reactionFeedCount.mirror,
              actionHasCollected:
                feedId.type === 2
                  ? reactionFeedCount.hasCollected.map(
                      (obj: boolean, number: number) =>
                        number === index ? true : obj
                    )
                  : reactionFeedCount.collect,
            })
          );
        } else {
          dispatch(
            setReactionTimelineCount({
              actionLike:
                feedId.type === 0
                  ? reactionTimelineCount.like.map(
                      (obj: number, number: number) =>
                        number === index ? obj + 1 : obj
                    )
                  : reactionTimelineCount.like,
              actionMirror:
                feedId.type === 1
                  ? reactionTimelineCount.mirror.map(
                      (obj: number, number: number) =>
                        number === index ? obj + 1 : obj
                    )
                  : reactionTimelineCount.mirror,
              actionCollect:
                feedId.type === 2
                  ? reactionTimelineCount.collect.map(
                      (obj: number, number: number) =>
                        number === index ? obj + 1 : obj
                    )
                  : reactionTimelineCount.collect,
              actionComment:
                feedId.type === 3
                  ? reactionTimelineCount.comment.map(
                      (obj: number, number: number) =>
                        number === index ? obj + 1 : obj
                    )
                  : reactionTimelineCount.comment,
              actionHasLiked:
                feedId.type === 0
                  ? reactionTimelineCount.hasLiked.map(
                      (obj: boolean, number: number) =>
                        number === index ? true : obj
                    )
                  : reactionTimelineCount.hasLiked,
              actionHasMirrored:
                feedId.type === 1
                  ? reactionTimelineCount.hasMirrored.map(
                      (obj: boolean, number: number) =>
                        number === index ? true : obj
                    )
                  : reactionTimelineCount.mirror,
              actionHasCollected:
                feedId.type === 2
                  ? reactionTimelineCount.hasCollected.map(
                      (obj: boolean, number: number) =>
                        number === index ? true : obj
                    )
                  : reactionTimelineCount.collect,
            })
          );
        }
      } else {
        dispatch(
          setIndividualFeedCount({
            actionLike:
              feedId.type === 0 ? individual.like + 1 : individual.like,
            actionMirror:
              feedId.type === 1 ? individual.mirror + 1 : individual.mirror,
            actionCollect:
              feedId.type === 2 ? individual.collect + 1 : individual.collect,
            actionComment:
              feedId.type === 3 ? individual.comment + 1 : individual.comment,
            actionHasLiked: feedId.type === 0 ? true : individual.hasLiked,
            actionHasMirrored: feedId.type === 1 ? true : individual.mirror,
            actionHasCollected: feedId.type === 2 ? true : individual.collect,
          })
        );
      }
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const refetchComments = () => {
    const index = comments?.findIndex((comment) => comment.id === feedId.value);

    if (index !== -1) {
      dispatch(
        setCommentFeedCount({
          actionLike:
            feedId.type === 0
              ? commentFeed.like.map((obj: number, number: number) =>
                  number === index ? obj + 1 : obj
                )
              : commentFeed.like,
          actionMirror:
            feedId.type === 1
              ? commentFeed.mirror.map((obj: number, number: number) =>
                  number === index ? obj + 1 : obj
                )
              : commentFeed.mirror,
          actionCollect:
            feedId.type === 2
              ? commentFeed.collect.map((obj: number, number: number) =>
                  number === index ? obj + 1 : obj
                )
              : commentFeed.collect,
          actionComment:
            feedId.type === 3
              ? commentFeed.comment.map((obj: number, number: number) =>
                  number === index ? obj + 1 : obj
                )
              : commentFeed.comment,
          actionHasLiked:
            feedId.type === 0
              ? commentFeed.hasLiked.map((obj: boolean, number: number) =>
                  number === index ? true : obj
                )
              : commentFeed.hasLiked,
          actionHasMirrored:
            feedId.type === 1
              ? commentFeed.hasMirrored.map((obj: boolean, number: number) =>
                  number === index ? true : obj
                )
              : commentFeed.mirror,
          actionHasCollected:
            feedId.type === 2
              ? commentFeed.hasCollected.map((obj: boolean, number: number) =>
                  number === index ? true : obj
                )
              : commentFeed.collect,
        })
      );
    }
  };

  const setScrollPos = (e: MouseEvent) => {
    if (feedSwitch) {
      dispatch(
        setScrollPosRedux({
          actionFeed: (e.target as HTMLDivElement)?.scrollTop,
          actionTimeline: scrollPos.timeline,
        })
      );
    } else {
      dispatch(
        setScrollPosRedux({
          actionFeed: scrollPos.feed,
          actionTimeline: (e.target as HTMLDivElement)?.scrollTop,
        })
      );
    }
  };

  useEffect(() => {
    if (page === "token gated") {
      if (indexer.message === "Successfully Indexed") {
        refetchInteractions();

        if (feedType !== "") {
          refetchComments();
        }
      }
    }
  }, [indexer.message]);

  useEffect(() => {
    if (auth) {
      if (feedSwitch) {
        if (!feedDispatch || feedDispatch.length < 1) {
          getFeed();
        }
      } else {
        if (!timelineDispatch || timelineDispatch.length < 1) {
          getTimeline();
        }
      }
    }
  }, [feedSwitch, auth]);

  useEffect(() => {
    const comm = getPostData();
    if (auth && feedSwitch && postImages?.length < 1 && !comm) {
      getFeed();
    }
  }, [postImages]);

  return {
    followerOnly,
    postsLoading,
    fetchMore,
    hasMore,
    fetchMoreTimeline,
    hasMoreTimeline,
    followerOnlyTimeline,
    setScrollPos,
  };
};

export default useAllPosts;
