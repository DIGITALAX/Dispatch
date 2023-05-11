import {
    whoCommentedPublications,
    whoCommentedPublicationsAuth,
  } from "@/graphql/lens/queries/getVideos";
  import checkPostReactions from "@/lib/helpers/checkPostReactions";
  import checkIfMirrored from "@/lib/helpers/checkIfMirrored";
  import { Publication } from "@/components/Home/types/lens.types";
import { useState } from "react";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
  

const useIndividual = () => {
    const [commentInfoLoading, setCommentInfoLoading] = useState<boolean>(false);
    const [commentors, setCommentors] = useState<any[]>([]);
    const [commentPageInfo, setCommentPageInfo] = useState<any>();
  
    const lensProfile = useSelector(
        (state: RootState) => state.app.lensProfileReducer.profile?.id
      );

    const getPostComments = async (): Promise<void> => {
        setCommentInfoLoading(true);
        try {
          let comments: any;
    
          if (lensProfile) {
            comments = await whoCommentedPublicationsAuth({
              commentsOf: ,
              limit: 30,
              commentsOfOrdering: "RANKING",
              commentsRankingFilter: "RELEVANT",
            });
          } else {
            comments = await whoCommentedPublications({
              commentsOf: ,
              limit: 30,
              commentsOfOrdering: "RANKING",
              commentsRankingFilter: "RELEVANT",
            });
          }
          const arr: any[] = [...comments.data.publications.items];
          const sortedArr = arr.sort(
            (a: any, b: any) => Date.parse(b.createdAt) - Date.parse(a.createdAt)
          );
          setCommentors(sortedArr);
          setCommentPageInfo(comments.data.publications.pageInfo);
          const hasMirroredArr = await checkIfMirrored(sortedArr, lensProfile);
          const hasReactedArr = await checkPostReactions(
            {
              commentsOf: ,
              limit: 30,
              commentsOfOrdering: "RANKING",
              commentsRankingFilter: "RELEVANT",
            },
            lensProfile
          );
          const hasCollectedArr = sortedArr.map(
            (obj: Publication) => obj.hasCollectedByMe
          );
        } catch (err: any) {
          console.error(err.message);
        }
        setCommentInfoLoading(false);
      };
    
      const getMorePostComments = async () => {
        try {
        } catch (err: any) {
          console.error(err.message);
        }
      };

      return {commentInfoLoading, getMorePostComments, commentors}
}

export default useIndividual;