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
  const reactionFeedCount = useSelector(
    (state: RootState) => state.app.reactionFeedCountReducer
  );
  const reactionTimelineCount = useSelector(
    (state: RootState) => state.app.reactionTimelineCountReducer
  );
  const dispatch = useDispatch();
  const [feedSwitch, setFeedSwitch] = useState<boolean>(true);
  const [paginated, setPaginated] = useState<any>();
  const [hasMirrored, setHasMirrored] = useState<boolean[]>([]);
  const [hasReacted, setHasReacted] = useState<boolean[]>([]);
  const [hasCollected, setHasCollected] = useState<boolean[]>([]);
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
  const [hasMirroredTimeline, setHasMirroredTimeline] = useState<boolean[]>([]);
  const [hasReactedTimeline, setHasReactedTimeline] = useState<boolean[]>([]);
  const [hasCollectedTimeline, setHasCollectedTimeline] = useState<boolean[]>(
    []
  );

  const getFeed = async (): Promise<void> => {
    setPostsLoading(true);
    try {
      const data = await profilePublicationsAuth({
        profileId: lensProfile,
        publicationTypes: ["POST", "COMMENT", "MIRROR"],
        limit: 30,
      });
      if (!data || !data?.data || !data?.data?.publications) {
        setPostsLoading(false);
        return;
      }
      const arr: any[] = [...data?.data.publications?.items];
      const sortedArr = arr.sort(
        (a: any, b: any) => Date.parse(b.createdAt) - Date.parse(a.createdAt)
      );
      if (sortedArr?.length < 30) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }
      setPaginated(data?.data?.publications?.pageInfo);
      const hasReactedArr = await checkPostReactions(
        {
          profileId: lensProfile,
          publicationTypes: ["POST", "COMMENT", "MIRROR"],
          limit: 30,
        },
        lensProfile
      );
      const hasMirroredArr = await checkIfMirrored(sortedArr, lensProfile);
      const hasCollectedArr = sortedArr.map((obj: Publication) =>
        obj.__typename === "Mirror"
          ? obj.mirrorOf.hasCollectedByMe
          : obj.hasCollectedByMe
      );
      setHasReacted(hasReactedArr);
      setHasMirrored(hasMirroredArr);
      setHasCollected(hasCollectedArr);
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
        limit: 30,
        cursor: paginated?.next,
      });

      const arr: any[] = [...data?.data?.publications?.items];
      const sortedArr = arr.sort(
        (a: any, b: any) => Date.parse(b.createdAt) - Date.parse(a.createdAt)
      );
      if (sortedArr?.length < 30) {
        setHasMore(false);
      }
      setFeed([...feed, ...sortedArr]);
      dispatch(setFeedsRedux([...feed, ...sortedArr]));
      setPaginated(data?.data?.publications?.pageInfo);
      const hasMirroredArr = await checkIfMirrored(sortedArr, lensProfile);
      setHasMirrored([...hasMirrored, ...hasMirroredArr]);
      const hasReactedArr = await checkPostReactions(
        {
          profileId: lensProfile,
          publicationTypes: ["POST", "COMMENT", "MIRROR"],
          limit: 30,
        },
        lensProfile
      );
      setHasReacted([...hasReacted, ...hasReactedArr]);
      const hasCollectedArr = sortedArr.map((obj: Publication) =>
        obj.__typename === "Mirror"
          ? obj.mirrorOf.hasCollectedByMe
          : obj.hasCollectedByMe
      );
      setHasCollected([...hasCollected, ...hasCollectedArr]);
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
      if (sortedArr?.length < 30) {
        setHasMoreTimeline(false);
      } else {
        setHasMoreTimeline(true);
      }
      setPaginatedTimeline(data?.data?.feed?.pageInfo);
      const hasReactedArr = await checkPostReactions(
        {
          profileId: lensProfile,
          limit: 30,
        },
        lensProfile
      );
      const hasMirroredArr = await checkIfMirrored(sortedArr, lensProfile);
      const hasCollectedArr = sortedArr.map((obj: Publication) =>
        obj.__typename === "Mirror"
          ? obj.mirrorOf.hasCollectedByMe
          : obj.hasCollectedByMe
      );
      setHasReactedTimeline(hasReactedArr);
      setHasMirroredTimeline(hasMirroredArr);
      setHasCollectedTimeline(hasCollectedArr);
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
        limit: 30,
        cursor: paginatedTimeline?.next,
      });

      const arr: any[] = [...data?.data?.feed?.items];
      const newArray = arr.map(({ root, other }) => {
        return { ...root, ...other };
      });
      const sortedArr = newArray.sort(
        (a: any, b: any) => Date.parse(b.createdAt) - Date.parse(a.createdAt)
      );
      if (sortedArr?.length < 30) {
        setHasMoreTimeline(false);
      }
      setTimeline([...timeline, ...sortedArr]);
      dispatch(setTimelinesRedux([...timeline, ...sortedArr]));
      setPaginatedTimeline(data?.data?.feed?.pageInfo);
      const hasMirroredArr = await checkIfMirrored(sortedArr, lensProfile);
      setHasMirroredTimeline([...hasMirroredTimeline, ...hasMirroredArr]);
      const hasReactedArr = await checkPostReactions(
        {
          profileId: lensProfile,
          publicationTypes: ["POST", "COMMENT", "MIRROR"],
          limit: 30,
        },
        lensProfile
      );
      setHasReactedTimeline([...hasReactedTimeline, ...hasReactedArr]);
      const hasCollectedArr = sortedArr.map((obj: Publication) =>
        obj.__typename === "Mirror"
          ? obj.mirrorOf.hasCollectedByMe
          : obj.hasCollectedByMe
      );
      setHasCollectedTimeline([...hasCollectedTimeline, ...hasCollectedArr]);
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
        })
      );
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const refetchInteractions = async () => {
    try {
      const data = await profilePublicationsAuth({
        profileId: lensProfile,
        publicationTypes: ["POST", "COMMENT", "MIRROR"],
        limit: 30,
      });

      const arr: any[] = [...data?.data?.publications?.items];
      let sortedArr = arr.sort(
        (a: any, b: any) => Date.parse(b.createdAt) - Date.parse(a.createdAt)
      );
      let paginated = data?.data?.publications?.pageInfo;

      const hasReacted = await checkPostReactions(
        {
          profileId: lensProfile,
          publicationTypes: ["POST", "COMMENT", "MIRROR"],
          limit: 30,
        },
        lensProfile
      );

      let hasReactedArray: boolean[] = hasReacted;
      let finalArr: any[] = [];
      while (sortedArr.length === 30) {
        const data = await profilePublicationsAuth({
          profileId: lensProfile,
          publicationTypes: ["POST", "COMMENT", "MIRROR"],
          limit: 30,
          cursor: paginated?.next,
        });
        const hasReacted = await checkPostReactions(
          {
            profileId: lensProfile,
            publicationTypes: ["POST", "COMMENT", "MIRROR"],
            limit: 30,
            cursor: paginated?.next,
          },
          lensProfile
        );

        sortedArr = [...data?.data?.publications?.items].sort(
          (a: any, b: any) => Date.parse(b.createdAt) - Date.parse(a.createdAt)
        );
        paginated = data?.data?.publications?.pageInfo;
        hasReactedArray = [...hasReactedArray, ...hasReacted];

        finalArr = [...finalArr, ...sortedArr];
      }

      const hasMirrored = await checkIfMirrored(finalArr, lensProfile);
      const hasCollected = finalArr.map((obj: Publication) =>
        obj.__typename === "Mirror"
          ? obj.mirrorOf.hasCollectedByMe
          : obj.hasCollectedByMe
      );
      setHasReacted(hasReactedArray);
      setHasMirrored(hasMirrored);
      setHasCollected(hasCollected);
      dispatch(
        setReactionFeedCount({
          actionLike: finalArr.map((obj: Publication) =>
            obj.__typename === "Mirror"
              ? obj.mirrorOf.stats.totalUpvotes
              : obj.stats.totalUpvotes
          ),
          actionMirror: finalArr.map((obj: Publication) =>
            obj.__typename === "Mirror"
              ? obj.mirrorOf.stats.totalAmountOfMirrors
              : obj.stats.totalAmountOfMirrors
          ),
          actionCollect: finalArr.map((obj: Publication) =>
            obj.__typename === "Mirror"
              ? obj.mirrorOf.stats.totalAmountOfCollects
              : obj.stats.totalAmountOfCollects
          ),
          actionComment: finalArr.map((obj: Publication) =>
            obj.__typename === "Mirror"
              ? obj.mirrorOf.stats.totalAmountOfComments
              : obj.stats.totalAmountOfComments
          ),
        })
      );
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
    if (feedSwitch) {
      if (!feedDispatch || feedDispatch.length < 1) {
        getFeed();
      }
    } else {
      if (!timelineDispatch || timelineDispatch.length < 1) {
        getTimeline();
      }
    }
  }, [feedSwitch]);

  return {
    feed,
    hasMirrored,
    hasReacted,
    hasCollected,
    followerOnly,
    postsLoading,
    fetchMore,
    hasMore,
    setFeedSwitch,
    feedSwitch,
    timeline,
    fetchMoreTimeline,
    hasMoreTimeline,
    hasCollectedTimeline,
    hasMirroredTimeline,
    hasReactedTimeline,
    followerOnlyTimeline,
  };
};

export default useAllPost;
