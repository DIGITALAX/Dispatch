import { Publication } from "@/components/Home/types/lens.types";
import feedTimeline from "@/graphql/lens/queries/getTimeline";
import { profilePublicationsAuth } from "@/graphql/lens/queries/getVideos";
import checkIfMirrored from "@/lib/helpers/checkIfMirrored";
import checkPostReactions from "@/lib/helpers/checkPostReactions";
import { setFeedsRedux } from "@/redux/reducers/feedSlice";
import { setReactionFeedCount } from "@/redux/reducers/reactionFeedCountSlice";
import { setReactionTimelineCount } from "@/redux/reducers/reactionTimelineCountSlice";
import { setTimelinesRedux } from "@/redux/reducers/timelineSlice";
import { RootState } from "@/redux/store";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const useAllPost = () => {
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
  const dispatch = useDispatch();
  const [paginated, setPaginated] = useState<any>();
  const [feed, setFeed] = useState<any[]>([]);
  const [timeline, setTimeline] = useState<any[]>([]);
  const [followerOnly, setFollowerOnly] = useState<boolean[]>([]);
  const [postsLoading, setPostsLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [hasMoreTimeline, setHasMoreTimeline] = useState<boolean>(true);
  const [paginatedTimeline, setPaginatedTimeline] = useState<any>();
  const [followerOnlyTimeline, setFollowerOnlyTimeline] = useState<boolean[]>(
    []
  );

  const getFeed = async (): Promise<void> => {
    setPostsLoading(true);
    try {
      const data = await profilePublicationsAuth({
        profileId: lensProfile,
        publicationTypes: ["POST", "COMMENT", "MIRROR"],
        limit: 20,
      });
      if (!data || !data?.data || !data?.data?.publications) {
        setPostsLoading(false);
        return;
      }
      const arr: any[] = [...data?.data.publications?.items];
      const sortedArr = arr.sort(
        (a: any, b: any) => Date.parse(b.createdAt) - Date.parse(a.createdAt)
      );
      if (sortedArr?.length < 20) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }
      setPaginated(data?.data?.publications?.pageInfo);
      const hasReactedArr = await checkPostReactions(
        {
          profileId: lensProfile,
          publicationTypes: ["POST", "COMMENT", "MIRROR"],
          limit: 20,
        },
        lensProfile
      );
      const hasMirroredArr = await checkIfMirrored(sortedArr, lensProfile);
      const hasCollectedArr = sortedArr.map((obj: Publication) =>
        obj.__typename === "Mirror"
          ? obj.mirrorOf.hasCollectedByMe
          : obj.hasCollectedByMe
      );
      setFollowerOnly(
        sortedArr.map((obj: Publication) =>
          obj.__typename === "Mirror"
            ? obj.mirrorOf.referenceModule?.type ===
              "FollowerOnlyReferenceModule"
              ? true
              : false
            : obj.referenceModule?.type === "FollowerOnlyReferenceModule"
            ? true
            : false
        )
      );
      setFeed(sortedArr);
      dispatch(setFeedsRedux(sortedArr));
      dispatch(
        setReactionFeedCount({
          actionLike: sortedArr.map((obj: Publication) =>
            obj.__typename === "Mirror"
              ? obj.mirrorOf.stats.totalUpvotes
              : obj.stats.totalUpvotes
          ),
          actionMirror: sortedArr.map((obj: Publication) =>
            obj.__typename === "Mirror"
              ? obj.mirrorOf.stats.totalAmountOfMirrors
              : obj.stats.totalAmountOfMirrors
          ),
          actionCollect: sortedArr.map((obj: Publication) =>
            obj.__typename === "Mirror"
              ? obj.mirrorOf.stats.totalAmountOfCollects
              : obj.stats.totalAmountOfCollects
          ),
          actionComment: sortedArr.map((obj: Publication) =>
            obj.__typename === "Mirror"
              ? obj.mirrorOf.stats.totalAmountOfComments
              : obj.stats.totalAmountOfComments
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

  const fetchMore = async (): Promise<void> => {
    try {
      if (!paginated?.next) {
        // fix apollo duplications on null next
        setHasMore(false);
        return;
      }
      const data = await profilePublicationsAuth({
        profileId: lensProfile,
        publicationTypes: ["POST", "COMMENT", "MIRROR"],
        limit: 20,
        cursor: paginated?.next,
      });

      const arr: any[] = [...data?.data?.publications?.items];
      const sortedArr = arr.sort(
        (a: any, b: any) => Date.parse(b.createdAt) - Date.parse(a.createdAt)
      );
      if (sortedArr?.length < 20) {
        setHasMore(false);
      }
      setFeed([...feed, ...sortedArr]);
      dispatch(setFeedsRedux([...feed, ...sortedArr]));
      setPaginated(data?.data?.publications?.pageInfo);
      const hasMirroredArr = await checkIfMirrored(sortedArr, lensProfile);
      const hasReactedArr = await checkPostReactions(
        {
          profileId: lensProfile,
          publicationTypes: ["POST", "COMMENT", "MIRROR"],
          limit: 20,
        },
        lensProfile
      );
      const hasCollectedArr = sortedArr.map((obj: Publication) =>
        obj.__typename === "Mirror"
          ? obj.mirrorOf.hasCollectedByMe
          : obj.hasCollectedByMe
      );
      dispatch(
        setReactionFeedCount({
          actionLike: [
            ...reactionFeedCount.like,
            ...sortedArr.map((obj: Publication) =>
              obj.__typename === "Mirror"
                ? obj.mirrorOf.stats.totalUpvotes
                : obj.stats.totalUpvotes
            ),
          ],
          actionMirror: [
            ...reactionFeedCount.mirror,
            ...sortedArr.map((obj: Publication) =>
              obj.__typename === "Mirror"
                ? obj.mirrorOf.stats.totalAmountOfMirrors
                : obj.stats.totalAmountOfMirrors
            ),
          ],
          actionCollect: [
            ...reactionFeedCount.collect,
            ...sortedArr.map((obj: Publication) =>
              obj.__typename === "Mirror"
                ? obj.mirrorOf.stats.totalAmountOfCollects
                : obj.stats.totalAmountOfCollects
            ),
          ],
          actionComment: [
            ...reactionFeedCount.comment,
            ...sortedArr.map((obj: Publication) =>
              obj.__typename === "Mirror"
                ? obj.mirrorOf.stats.totalAmountOfComments
                : obj.stats.totalAmountOfComments
            ),
          ],
          actionHasLiked: [...reactionFeedCount.hasLiked, ...hasReactedArr],
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
      const data = await feedTimeline({
        profileId: lensProfile,
        limit: 30,
      });
      if (!data || !data?.data || !data?.data?.feed) {
        setPostsLoading(false);
        return;
      }
      const arr: any[] = [...data?.data.feed?.items];
      const newArray = arr.map(({ root, other }) => {
        return { ...root, ...other };
      });
      const sortedArr = newArray.sort(
        (a: any, b: any) => Date.parse(b.createdAt) - Date.parse(a.createdAt)
      );

      if (sortedArr?.length < 20) {
        setHasMoreTimeline(false);
      } else {
        setHasMoreTimeline(true);
      }
      setPaginatedTimeline(data?.data?.feed?.pageInfo);
      const hasReactedArr = await checkPostReactions(
        {
          profileId: lensProfile,
          limit: 20,
        },
        lensProfile,
        true
      );
      const hasMirroredArr = await checkIfMirrored(sortedArr, lensProfile);
      const hasCollectedArr = sortedArr.map((obj: Publication) =>
        obj.__typename === "Mirror"
          ? obj.mirrorOf.hasCollectedByMe
          : obj.hasCollectedByMe
      );
      setFollowerOnlyTimeline(
        sortedArr.map((obj: Publication) =>
          obj.__typename === "Mirror"
            ? obj.mirrorOf.referenceModule?.type ===
              "FollowerOnlyReferenceModule"
              ? true
              : false
            : obj.referenceModule?.type === "FollowerOnlyReferenceModule"
            ? true
            : false
        )
      );
      setTimeline(sortedArr);
      dispatch(setTimelinesRedux(sortedArr));
      dispatch(
        setReactionTimelineCount({
          actionLike: sortedArr.map((obj: Publication) =>
            obj.__typename === "Mirror"
              ? obj.mirrorOf.stats.totalUpvotes
              : obj.stats.totalUpvotes
          ),
          actionMirror: sortedArr.map((obj: Publication) =>
            obj.__typename === "Mirror"
              ? obj.mirrorOf.stats.totalAmountOfMirrors
              : obj.stats.totalAmountOfMirrors
          ),
          actionCollect: sortedArr.map((obj: Publication) =>
            obj.__typename === "Mirror"
              ? obj.mirrorOf.stats.totalAmountOfCollects
              : obj.stats.totalAmountOfCollects
          ),
          actionComment: sortedArr.map((obj: Publication) =>
            obj.__typename === "Mirror"
              ? obj.mirrorOf.stats.totalAmountOfComments
              : obj.stats.totalAmountOfComments
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
      if (!paginatedTimeline?.next) {
        // fix apollo duplications on null next
        setHasMoreTimeline(false);
        return;
      }
      const data = await feedTimeline({
        profileId: lensProfile,
        limit: 20,
        cursor: paginatedTimeline?.next,
      });

      const arr: any[] = [...data?.data?.feed?.items];
      const newArray = arr.map(({ root, other }) => {
        return { ...root, ...other };
      });
      const sortedArr = newArray.sort(
        (a: any, b: any) => Date.parse(b.createdAt) - Date.parse(a.createdAt)
      );
      if (sortedArr?.length < 20) {
        setHasMoreTimeline(false);
      }
      setTimeline([...timeline, ...sortedArr]);
      dispatch(setTimelinesRedux([...timeline, ...sortedArr]));
      setPaginatedTimeline(data?.data?.feed?.pageInfo);
      const hasMirroredArr = await checkIfMirrored(sortedArr, lensProfile);
      const hasReactedArr = await checkPostReactions(
        {
          profileId: lensProfile,
          limit: 20,
        },
        lensProfile,
        true
      );
      const hasCollectedArr = sortedArr.map((obj: Publication) =>
        obj.__typename === "Mirror"
          ? obj.mirrorOf.hasCollectedByMe
          : obj.hasCollectedByMe
      );
      dispatch(
        setReactionTimelineCount({
          actionLike: [
            ...reactionTimelineCount.like,
            ...sortedArr.map((obj: Publication) =>
              obj.__typename === "Mirror"
                ? obj.mirrorOf.stats.totalUpvotes
                : obj.stats.totalUpvotes
            ),
          ],
          actionMirror: [
            ...reactionTimelineCount.mirror,
            ...sortedArr.map((obj: Publication) =>
              obj.__typename === "Mirror"
                ? obj.mirrorOf.stats.totalAmountOfMirrors
                : obj.stats.totalAmountOfMirrors
            ),
          ],
          actionCollect: [
            ...reactionTimelineCount.collect,
            ...sortedArr.map((obj: Publication) =>
              obj.__typename === "Mirror"
                ? obj.mirrorOf.stats.totalAmountOfCollects
                : obj.stats.totalAmountOfCollects
            ),
          ],
          actionComment: [
            ...reactionTimelineCount.comment,
            ...sortedArr.map((obj: Publication) =>
              obj.__typename === "Mirror"
                ? obj.mirrorOf.stats.totalAmountOfComments
                : obj.stats.totalAmountOfComments
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

  const refetchInteractions = async () => {
    try {
      const index = (feedSwitch ? feedDispatch : timelineDispatch)?.findIndex(
        (feed) => feed.id === feedId.value
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
                ? reactionFeedCount.mirror.map((obj: number, number: number) =>
                    number === index ? obj + 1 : obj
                  )
                : reactionFeedCount.mirror,
            actionCollect:
              feedId.type === 2
                ? reactionFeedCount.collect.map((obj: number, number: number) =>
                    number === index ? obj + 1 : obj
                  )
                : reactionFeedCount.collect,
            actionComment:
              feedId.type === 3
                ? reactionFeedCount.comment.map((obj: number, number: number) =>
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
    } catch (err: any) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    if (indexer.message === "Successfully Indexed") {
      refetchInteractions();
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

  return {
    feed,
    followerOnly,
    postsLoading,
    fetchMore,
    hasMore,
    timeline,
    fetchMoreTimeline,
    hasMoreTimeline,
    followerOnlyTimeline,
  };
};

export default useAllPost;
