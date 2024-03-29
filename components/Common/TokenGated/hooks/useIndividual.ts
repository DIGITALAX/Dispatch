import {
  whoCommentedPublications,
  whoCommentedPublicationsAuth,
} from "@/graphql/lens/queries/getVideos";
import { getPublicationAuth } from "@/graphql/lens/queries/getPublication";
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
import { setIndividualFeedCount } from "@/redux/reducers/individualFeedCountSlice";
import { LensEnvironment, LensGatedSDK } from "@lens-protocol/sdk-gated";
import { Signer } from "ethers";
import { Web3Provider } from "@ethersproject/providers";
import { useSigner } from "wagmi";
import fetchIPFSJSON from "@/lib/helpers/fetchIPFSJSON";

const useIndividual = () => {
  const dispatch = useDispatch();
  const { data: signer } = useSigner();
  const lensProfile = useSelector(
    (state: RootState) => state.app.lensProfileReducer.profile?.id
  );
  const feedType = useSelector(
    (state: RootState) => state.app.feedTypeReducer.value
  );
  const page = useSelector((state: RootState) => state.app.pageReducer.value);
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
          limit: 10,
        });
      } else {
        comments = await whoCommentedPublications({
          commentsOf: feedType,
          limit: 10,
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
      if (sortedArr?.length < 10) {
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

      let hasMirroredArr, hasReactedArr;
      if (lensProfile) {
        hasMirroredArr = await checkIfMirrored(sortedArr, lensProfile);
        hasReactedArr = await checkPostReactions(
          {
            commentsOf: feedType,
            limit: 10,
            commentsOfOrdering: "RANKING",
            commentsRankingFilter: "RELEVANT",
          },
          lensProfile
        );
      }

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
          limit: 10,
          cursor: paginated?.next,
          commentsOfOrdering: "RANKING",
          commentsRankingFilter: "RELEVANT",
        });
      } else {
        comments = await whoCommentedPublications({
          commentsOf: feedType,
          limit: 10,
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
      if (sortedArr?.length < 10) {
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

      let hasMirroredArr, hasReactedArr;
      if (lensProfile) {
        hasMirroredArr = await checkIfMirrored(sortedArr, lensProfile);
        hasReactedArr = await checkPostReactions(
          {
            commentsOf: feedType,
            limit: 10,
            cursor: paginated?.next,
            commentsOfOrdering: "RANKING",
            commentsRankingFilter: "RELEVANT",
          },
          lensProfile
        );
      }
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
          actionHasLiked: [
            ...commentFeedCount.hasLiked,
            ...(hasReactedArr ? hasReactedArr : []),
          ],
          actionHasMirrored: [
            ...commentFeedCount.hasMirrored,
            ...(hasMirroredArr ? hasMirroredArr : []),
          ],
          actionHasCollected: [
            ...commentFeedCount.hasCollected,
            ...hasCollectedArr,
          ],
        })
      );
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
      const { data } = await getPublicationAuth(
        {
          publicationId: feedType,
        },
        lensProfile
      );

      const sdk = await LensGatedSDK.create({
        provider: new Web3Provider(window?.ethereum as any),
        signer: signer as Signer,
        env: LensEnvironment.Polygon,
      });

      let decryptedData: any;

      if (data?.publication.canDecrypt && data?.publication.canDecrypt.result) {
        try {
          const value = await fetchIPFSJSON(
            data?.publication.onChainContentURI?.includes("ipfs://")
              ? data?.publication.onChainContentURI
                  ?.split("ipfs://")[1]
                  ?.replace(/"/g, "")
                  ?.trim()
              : data?.publication.onChainContentURI?.trim()
          );
          const { decrypted, error } = await sdk.gated.decryptMetadata(
            value.json
          );
          if (decrypted) {
            decryptedData = {
              ...data?.publication,
              decrypted,
            };
          } else {
            decryptedData = {
              ...data?.publication,
              gated: true,
            };
          }
        } catch (err: any) {
          console.error(err.message);
          decryptedData = {
            ...data?.publication,
            gated: true,
          };
        }
      } else if (
        data?.publication?.metadata?.content?.includes(
          "This publication is gated"
        ) ||
        (data?.publication?.__typename === "Mirror" &&
          data?.publication?.mirrorOf.metadata.content.includes(
            "This publication is gated"
          ))
      ) {
        decryptedData = {
          ...data?.publication,
          gated: true,
        };
      } else {
        decryptedData = data?.publication;
      }

      setMainPost(decryptedData);
      setFollowerOnly(
        decryptedData?.__typename === "Mirror"
          ? decryptedData?.mirrorOf?.referenceModule?.type ===
            "FollowerOnlyReferenceModule"
            ? true
            : false
          : decryptedData?.referenceModule?.type ===
            "FollowerOnlyReferenceModule"
          ? true
          : false
      );
      let hasMirroredArr, hasReactedArr;
      if (lensProfile) {
        hasMirroredArr = await checkIfMirrored([decryptedData], lensProfile);
        hasReactedArr = await checkPostReactions(
          {
            publicationId: feedType,
          },
          lensProfile,
          true
        );
      }
      dispatch(
        setIndividualFeedCount({
          actionLike: decryptedData?.stats.totalUpvotes,
          actionMirror: decryptedData?.stats.totalAmountOfMirrors,
          actionCollect: decryptedData?.stats.totalAmountOfCollects,
          actionComment: decryptedData?.stats.totalAmountOfComments,
          actionHasLiked: hasReactedArr ? hasReactedArr?.[0] : false,
          actionHasMirrored: hasMirroredArr ? hasMirroredArr?.[0] : false,
          actionHasCollected: decryptedData?.hasCollectedByMe,
        })
      );
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
    if (feedType !== "" && page === "token gated") {
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
