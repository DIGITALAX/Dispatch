import {
  whoCommentedPublications,
  whoCommentedPublicationsAuth,
} from "@/graphql/lens/queries/getVideos";
import {
  getPublication,
  getPublicationAuth,
} from "@/graphql/lens/queries/getPublication";
import checkPostReactions from "@/lib/helpers/checkPostReactions";
import checkIfMirrored from "@/lib/helpers/checkIfMirrored";
import { useEffect, useState } from "react";
import { RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { Publication } from "@/components/Home/types/lens.types";
import canCommentPub from "@/graphql/lens/queries/canComment";
import { setCanComment } from "@/redux/reducers/canCommentSlice";
import { setCommentFeedCount } from "@/redux/reducers/commentCountSlice";
import { setCommentsRedux } from "@/redux/reducers/commentsSlice";

const useIndividual = () => {
  const dispatch = useDispatch();
  const lensProfile = useSelector(
    (state: RootState) => state.app.lensProfileReducer.profile?.id
  );
  const feedType = useSelector(
    (state: RootState) => state.app.feedTypeReducer.value
  );
  const commentFeedCount = useSelector(
    (state: RootState) => state.app.commentCountReducer
  );
  const index = useSelector((state: RootState) => state.app.indexModalReducer);
  const commentors = useSelector(
    (state: RootState) => state.app.commentsReducer.value
  );
  const [commentsLoading, setCommentsLoading] = useState<boolean>(false);
  const [paginated, setPaginated] = useState<any>();
  const [hasMoreComments, setHasMoreComments] = useState<boolean>(true);
  const [mainPost, setMainPost] = useState<Publication>();
  const [mainPostLoading, setMainPostLoading] = useState<boolean>(false);
  const [followerOnly, setFollowerOnly] = useState<boolean>(false);
  const [followerOnlyComments, setFollowerOnlyComments] = useState<boolean[]>(
    []
  );
  const [reactCommentLoading, setReactCommentLoading] = useState<boolean[]>(
    Array.from({ length: commentors.length }, () => false)
  );
  const [mirrorCommentLoading, setMirrorCommentLoading] = useState<boolean[]>(
    Array.from({ length: commentors.length }, () => false)
  );
  const [collectCommentLoading, setCollectCommentLoading] = useState<boolean[]>(
    Array.from({ length: commentors.length }, () => false)
  );
  const [collectPostLoading, setCollectPostLoading] = useState<boolean[]>([
    false,
  ]);
  const [mirrorPostLoading, setMirrorPostLoading] = useState<boolean[]>([
    false,
  ]);
  const [reactPostLoading, setReactPostLoading] = useState<boolean[]>([false]);

  const getPostComments = async (): Promise<void> => {
    setCommentsLoading(true);
    try {
      let comments: any;

      if (lensProfile) {
        comments = await whoCommentedPublicationsAuth({
          commentsOf: feedType,
          limit: 30,
        });
      } else {
        comments = await whoCommentedPublications({
          commentsOf: feedType,
          limit: 30,
        });
      }
      if (!comments || !comments?.data || !comments?.data?.publications) {
        setCommentsLoading(false);
        return;
      }
      const arr: any[] = [...comments?.data?.publications?.items];
      const sortedArr = arr.sort(
        (a: any, b: any) => Date.parse(b.createdAt) - Date.parse(a.createdAt)
      );
      if (sortedArr?.length < 30) {
        setHasMoreComments(false);
      } else {
        setHasMoreComments(true);
      }
      dispatch(setCommentsRedux(sortedArr));
      setPaginated(comments?.data?.publications?.pageInfo);
      setFollowerOnlyComments(
        sortedArr?.map((obj: Publication) =>
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
      if (lensProfile) {
        const hasMirroredArr = await checkIfMirrored(sortedArr, lensProfile);
        const hasReactedArr = await checkPostReactions(
          {
            commentsOf: feedType,
            limit: 30,
            commentsOfOrdering: "RANKING",
            commentsRankingFilter: "RELEVANT",
          },
          lensProfile
        );
        const hasCollectedArr = sortedArr.map(
          (obj: Publication) => obj.hasCollectedByMe
        );
        dispatch(
          setCommentFeedCount({
            actionLike: sortedArr.map(
              (obj: Publication) => obj.stats.totalUpvotes
            ),
            actionMirror: sortedArr.map(
              (obj: Publication) => obj.stats.totalAmountOfMirrors
            ),
            actionCollect: sortedArr.map(
              (obj: Publication) => obj.stats.totalAmountOfCollects
            ),
            actionComment: sortedArr.map(
              (obj: Publication) => obj.stats.totalAmountOfComments
            ),
            actionHasLiked: hasReactedArr,
            actionHasMirrored: hasMirroredArr,
            actionHasCollected: hasCollectedArr,
          })
        );
      }
    } catch (err: any) {
      console.error(err.message);
    }
    setCommentsLoading(false);
  };

  const getMorePostComments = async (): Promise<void> => {
    try {
      if (!paginated?.next) {
        // fix apollo duplications on null next
        setHasMoreComments(false);
        return;
      }
      let comments: any;
      if (lensProfile) {
        comments = await whoCommentedPublicationsAuth({
          commentsOf: feedType,
          limit: 30,
          cursor: paginated?.next,
          commentsOfOrdering: "RANKING",
          commentsRankingFilter: "RELEVANT",
        });
      } else {
        comments = await whoCommentedPublications({
          commentsOf: feedType,
          limit: 30,
          cursor: paginated?.next,
          commentsOfOrdering: "RANKING",
          commentsRankingFilter: "RELEVANT",
        });
      }
      if (
        !comments ||
        !comments?.data ||
        !comments?.data?.publications ||
        comments?.data?.publications?.items?.length < 1
      ) {
        setCommentsLoading(false);
        return;
      }
      const arr: any[] = [...comments?.data?.publications?.items];
      const sortedArr = arr.sort(
        (a: any, b: any) => Date.parse(b.createdAt) - Date.parse(a.createdAt)
      );
      if (sortedArr?.length < 30) {
        setHasMoreComments(false);
      }
      dispatch(setCommentsRedux([...commentors, ...sortedArr]));
      setPaginated(comments?.data?.publications?.pageInfo);
      setFollowerOnlyComments([
        ...followerOnlyComments,
        ...sortedArr?.map((obj: Publication) =>
          obj.__typename === "Mirror"
            ? obj.mirrorOf.referenceModule?.type ===
              "FollowerOnlyReferenceModule"
              ? true
              : false
            : obj.referenceModule?.type === "FollowerOnlyReferenceModule"
            ? true
            : false
        ),
      ]);
      if (lensProfile) {
        const hasMirroredArr = await checkIfMirrored(sortedArr, lensProfile);
        const hasReactedArr = await checkPostReactions(
          {
            commentsOf: feedType,
            limit: 30,
            cursor: paginated?.next,
            commentsOfOrdering: "RANKING",
            commentsRankingFilter: "RELEVANT",
          },
          lensProfile
        );
        const hasCollectedArr = sortedArr.map(
          (obj: Publication) => obj.hasCollectedByMe
        );
        dispatch(
          setCommentFeedCount({
            actionLike: [
              ...commentFeedCount.like,
              ...sortedArr.map((obj: Publication) => obj.stats.totalUpvotes),
            ],
            actionMirror: [
              ...commentFeedCount.mirror,
              ...sortedArr.map(
                (obj: Publication) => obj.stats.totalAmountOfMirrors
              ),
            ],
            actionCollect: [
              ...commentFeedCount.collect,
              ...sortedArr.map(
                (obj: Publication) => obj.stats.totalAmountOfCollects
              ),
            ],
            actionComment: [
              ...commentFeedCount.comment,
              ...sortedArr.map(
                (obj: Publication) => obj.stats.totalAmountOfComments
              ),
            ],
            actionHasLiked: [...commentFeedCount.hasLiked, ...hasReactedArr],
            actionHasMirrored: [
              ...commentFeedCount.hasMirrored,
              ...hasMirroredArr,
            ],
            actionHasCollected: [
              ...commentFeedCount.hasCollected,
              ...hasCollectedArr,
            ],
          })
        );
      }
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const canComment = async () => {
    try {
      const res = await canCommentPub(
        {
          publicationId: feedType,
        },
        lensProfile
      );
      if (!res.data.publication.canComment.result) {
        dispatch(setCanComment(false));
      }
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const getPostInfo = async () => {
    setMainPostLoading(true);
    try {
      let pubData;
      if (lensProfile) {
        const { data } = await getPublicationAuth({
          publicationId: feedType,
        });
        pubData = data;
      } else {
        const { data } = await getPublication({
          publicationId: feedType,
        });
        pubData = data;
      }
      setMainPost(pubData?.publication);
      setFollowerOnly(
        pubData?.publication.__typename === "Mirror"
          ? pubData?.publication.mirrorOf.referenceModule?.type ===
            "FollowerOnlyReferenceModule"
            ? true
            : false
          : pubData?.publication.referenceModule?.type ===
            "FollowerOnlyReferenceModule"
          ? true
          : false
      );
      if (lensProfile) {
        const hasMirroredArr = await checkIfMirrored(
          [pubData?.publication],
          lensProfile
        );
        const hasReactedArr = await checkPostReactions(
          {
            publicationId: feedType,
          },
          lensProfile,
          true
        );
        dispatch(
          setCommentFeedCount({
            actionLike: [pubData?.publication.stats.totalUpvotes],
            actionMirror: [pubData?.publication.stats.totalAmountOfMirrors],
            actionCollect: [pubData?.publication.stats.totalAmountOfCollects],
            actionComment: [pubData?.publication.stats.totalAmountOfComments],
            actionHasLiked: hasReactedArr,
            actionHasMirrored: hasMirroredArr,
            actionHasCollected: [pubData?.publication.hasCollectedByMe],
          })
        );
      }
    } catch (err: any) {
      console.error(err.message);
    }
    setMainPostLoading(false);
  };

  useEffect(() => {
    if (feedType !== "") {
      canComment();
      getPostInfo();
      getPostComments();
    }
  }, [feedType]);

  useEffect(() => {
    if (feedType !== "") {
      if (index.message === "Successfully Indexed") {
        getPostComments();
      }
    }
  }, [index.message]);

  return {
    getMorePostComments,
    hasMoreComments,
    commentsLoading,
    mainPostLoading,
    followerOnly,
    mainPost,
    followerOnlyComments,
    reactCommentLoading,
    mirrorCommentLoading,
    collectCommentLoading,
    setMirrorCommentLoading,
    setCollectCommentLoading,
    setReactCommentLoading,
    setCollectPostLoading,
    setMirrorPostLoading,
    setReactPostLoading,
    collectPostLoading,
    reactPostLoading,
    mirrorPostLoading,
  };
};

export default useIndividual;
