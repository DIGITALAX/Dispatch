import {
  CHROMADIN_COLLECTION_CONTRACT,
  CHROMADIN_NFT_CONTRACT,
  LENS_HUB_PROXY_ADDRESS_MATIC,
} from "@/lib/constants";
import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  useContractWrite,
  usePrepareContractWrite,
  useSignTypedData,
  useSigner,
} from "wagmi";
import LensHubProxy from "../../../../abis/LensHubProxy.json";
import handleIndexCheck from "@/lib/helpers/handleIndexCheck";
import {
  createPostTypedData,
  createDispatcherPostData,
} from "@/graphql/lens/mutations/postGate";
import { RootState } from "@/redux/store";
import { splitSignature } from "ethers/lib/utils.js";
import broadcast from "@/graphql/lens/mutations/broadcast";
import { omit } from "lodash";
import uploadPostContent from "@/lib/helpers/uploadPostContent";
import { getPostData, removePostData, setPostData } from "@/lib/lens/utils";
import { setIndexModal } from "@/redux/reducers/indexModalSlice";
import getPostHTML from "@/lib/helpers/commentHTML";
import { Profile } from "@/components/Home/types/lens.types";
import getCaretPos from "@/lib/helpers/getCaretPos";
import { waitForTransaction } from "@wagmi/core";
import { MediaType, UploadedMedia } from "../types/allPosts.types";
import { searchProfile } from "@/graphql/lens/queries/searchProfile";
import { Web3Provider } from "@ethersproject/providers";
import {
  ContractType,
  LensGatedSDK,
  LensEnvironment,
  EncryptedMetadata,
} from "@lens-protocol/sdk-gated";
import { Signer } from "ethers";
import { setPostGateImages } from "@/redux/reducers/postGatedImageSlice";

const useMakePost = () => {
  const { data: signer } = useSigner();
  const [postLoading, setPostLoading] = useState<boolean>(false);
  const [postArgs, setPostArgs] = useState<any>();
  const [postDescription, setPostDescription] = useState<string>("");
  const [caretCoord, setCaretCoord] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [profilesOpen, setProfilesOpen] = useState<boolean>(false);
  const textElement = useRef<HTMLTextAreaElement>(null);
  const [mentionProfiles, setMentionProfiles] = useState<Profile[]>([]);
  const [results, setResults] = useState<any>([]);
  const [gifs, setGifs] = useState<UploadedMedia[]>(
    JSON.parse(getPostData() || "{}").images || []
  );
  const [searchGif, setSearchGif] = useState<string>("");
  const [postHTML, setPostHTML] = useState<string>("");
  const [tokenIds, setTokenIds] = useState<string[]>([]);
  const { signTypedDataAsync } = useSignTypedData();
  const dispatch = useDispatch();
  const profileId = useSelector(
    (state: RootState) => state.app.lensProfileReducer.profile
  );
  const dispatcher = useSelector(
    (state: RootState) => state.app.dispatcherReducer.value
  );
  const postImages = useSelector(
    (state: RootState) => state?.app?.postGatedImageReducer?.value
  );
  const collectModuleType = useSelector(
    (state: RootState) => state?.app?.collectValueTypeReducer?.type
  );
  const collections = useSelector(
    (state: RootState) => state.app.allCollectionsReducer.value
  );

  const { config, isSuccess } = usePrepareContractWrite({
    address: LENS_HUB_PROXY_ADDRESS_MATIC,
    abi: LensHubProxy,
    functionName: "postWithSig",
    enabled: Boolean(postArgs),
    args: [postArgs],
  });

  const { writeAsync } = useContractWrite(config);

  const handleGif = (e: FormEvent): void => {
    setSearchGif((e.target as HTMLFormElement).value);
  };

  const handleGifSubmit = async (): Promise<void> => {
    const getGifs = await fetch("/api/giphy", {
      method: "POST",
      body: JSON.stringify(searchGif),
    });
    const allGifs = await getGifs.json();
    setResults(allGifs?.json?.results);
  };

  const handleSetGif = (result: any): void => {
    if ((postImages as any)?.length < 4) {
      setGifs([
        ...(postImages as any),
        {
          cid: result,
          type: MediaType.Gif,
        },
      ]);
      const postStorage = JSON.parse(getPostData() || "{}");
      setPostData(
        JSON.stringify({
          ...postStorage,
          images: [
            ...(postImages as any),
            {
              cid: result,
              type: MediaType.Gif,
            },
          ],
        })
      );
    }
  };

  const handleKeyDownDelete = (e: KeyboardEvent<Element>) => {
    const highlightedContent = document.querySelector("#highlighted-content")!;
    const selection = window.getSelection();
    const postStorage = JSON.parse(getPostData() || "{}");
    if (e.key === "Backspace" && selection?.toString() !== "") {
      const start = textElement.current!.selectionStart;
      const end = textElement.current!.selectionEnd;

      if (start === 0 && end === textElement.current!.value?.length) {
        setPostDescription("");
        setPostHTML("");
        // highlightedContent.innerHTML = "";
        setPostData(
          JSON.stringify({
            ...postStorage,
            post: "",
          })
        );
      } else {
        const selectedText = selection!.toString();
        const selectedHtml = highlightedContent.innerHTML.substring(start, end);
        const strippedHtml = selectedHtml.replace(
          /( style="[^"]*")|( style='[^']*')/g,
          ""
        );
        const strippedText = selectedText.replace(/<[^>]*>/g, "");

        const newHTML =
          postHTML.slice(0, start) + strippedHtml + postHTML.slice(end);
        const newDescription =
          postDescription.slice(0, start) +
          strippedText +
          postDescription.slice(end);

        setPostHTML(newHTML);
        setPostDescription(newDescription);
        (e.currentTarget! as any).value = newDescription;
        // highlightedContent.innerHTML = newHTML;
        setPostData(
          JSON.stringify({
            ...postStorage,
            post: newDescription,
          })
        );
      }
    } else if (
      e.key === "Backspace" &&
      postDescription?.length === 0 &&
      postHTML?.length === 0
    ) {
      (e.currentTarget! as any).value = "";
      // highlightedContent.innerHTML = "";
      setPostData(
        JSON.stringify({
          ...postStorage,
          post: "",
        })
      );
      e.preventDefault();
    }
  };

  const handlePostDescription = async (e: any): Promise<void> => {
    let resultElement = document.querySelector("#highlighted-content");
    const newValue = e.target.value.endsWith("\n")
      ? e.target.value + " "
      : e.target.value;
    setPostHTML(getPostHTML(e, resultElement as Element));
    setPostDescription(newValue);
    const postStorage = JSON.parse(getPostData() || "{}");
    setPostData(
      JSON.stringify({
        ...postStorage,
        post: e.target.value,
      })
    );
    if (
      e.target.value.split(" ")[e.target.value.split(" ")?.length - 1][0] ===
        "@" &&
      e.target.value.split(" ")[e.target.value.split(" ")?.length - 1]
        ?.length === 1
    ) {
      setCaretCoord(getCaretPos(e, textElement));
      setProfilesOpen(true);
    }
    if (
      e.target.value.split(" ")[e.target.value.split(" ")?.length - 1][0] ===
      "@"
    ) {
      const allProfiles = await searchProfile({
        query: e.target.value.split(" ")[e.target.value.split(" ")?.length - 1],
        type: "PROFILE",
        limit: 50,
      });
      setMentionProfiles(allProfiles?.data?.search?.items);
    } else {
      setProfilesOpen(false);
      setMentionProfiles([]);
    }
  };

  const clearPost = () => {
    setPostLoading(false);
    setPostDescription("");
    setPostHTML("");
    setTokenIds([]);
    setGifs([]);
    dispatch(setPostGateImages([]));
    // (document as any).querySelector("#highlighted-content").innerHTML = "";
    removePostData();
    dispatch(
      setIndexModal({
        actionValue: true,
        actionMessage: "Indexing Interaction",
      })
    );
  };

  const uploadMetadataHandler = async (
    data: EncryptedMetadata
  ): Promise<string> => {
    const response = await fetch("/api/ipfs", {
      method: "POST",
      body: JSON.stringify(data),
    });
    let responseJSON = await response.json();
    return Promise.resolve("ipfs://" + responseJSON.cid);
  };

  const tokenGatePost = async (): Promise<void> => {
    if (
      (!postDescription ||
        postDescription === "" ||
        postDescription.trim()?.length < 0) &&
      (!postImages?.length || postImages?.length < 1)
    ) {
      return;
    }
    setPostLoading(true);
    let result: any;
    try {
      const sdk = await LensGatedSDK.create({
        provider: new Web3Provider(window?.ethereum as any),
        signer: signer as Signer,
        env: LensEnvironment.Polygon,
      });

      await sdk.connect({
        address: profileId?.ownedBy,
        env: LensEnvironment.Polygon,
      });

      const contentURIValue = await uploadPostContent(
        postImages,
        postDescription,
        undefined,
        undefined,
        true
      );

      const { contentURI, encryptedMetadata } =
        await sdk.gated.encryptMetadata(
          contentURIValue,
          profileId?.id,
          {
            nft: {
              contractAddress: CHROMADIN_NFT_CONTRACT,
              chainID: 137,
              contractType: ContractType.Erc721,
              tokenIds: collections.filter((item) => {
                return tokenIds.some((tokenId) =>
                  item.tokenIds.includes(tokenId)
                );
              }),
            },
          },
          uploadMetadataHandler
        );

      console.log({ contentURI, encryptedMetadata });

      // if (dispatcher) {
      //   result = await createDispatcherPostData({
      //     profileId: profileId?.id,
      //     contentURI: contentURI,
      //     collectModule: collectModuleType,
      //     referenceModule: {
      //       followerOnlyReferenceModule: false,
      //     },
      //     gated: {
      //       nft: {
      //         contractAddress: CHROMADIN_COLLECTION_CONTRACT,
      //         chainID: 137,
      //         contractType: ContractType.Erc721,
      //         tokenIds: tokenIds,
      //       },
      //       encryptedSymmetricKey:
      //         encryptedMetadata?.encryptionParams.providerSpecificParams
      //           .encryptionKey,
      //     },
      //   });
      //   clearPost();
      //   setTimeout(async () => {
      //     await handleIndexCheck(
      //       result?.data?.createPostViaDispatcher?.txHash,
      //       dispatch,
      //       true
      //     );
      //   }, 7000);
      // } else {
      //   result = await createPostTypedData({
      //     profileId: profileId?.id,
      //     contentURI: contentURI,
      //     collectModule: collectModuleType,
      //     referenceModule: {
      //       followerOnlyReferenceModule: false,
      //     },
      //     gated: {
      //       nft: {
      //         contractAddress: CHROMADIN_COLLECTION_CONTRACT,
      //         chainID: 137,
      //         contractType: ContractType.Erc721,
      //         tokenIds: tokenIds,
      //       },
      //       encryptedSymmetricKey:
      //         encryptedMetadata?.encryptionParams.providerSpecificParams
      //           .encryptionKey,
      //     },
      //   });

      //   const typedData: any = result.data.createPostTypedData.typedData;

      //   const signature: any = await signTypedDataAsync({
      //     domain: omit(typedData?.domain, ["__typename"]),
      //     types: omit(typedData?.types, ["__typename"]) as any,
      //     value: omit(typedData?.value, ["__typename"]) as any,
      //   });

      //   const broadcastResult: any = await broadcast({
      //     id: result?.data?.createPostTypedData?.id,
      //     signature,
      //   });

      //   if (broadcastResult?.data?.broadcast?.__typename !== "RelayerResult") {
      //     const { v, r, s } = splitSignature(signature);

      //     const postArgs = {
      //       profileId: typedData.value.profileId,
      //       contentURI: typedData.value.contentURI,
      //       profileIdPointed: typedData.value.profileIdPointed,
      //       pubIdPointed: typedData.value.pubIdPointed,
      //       referenceModuleData: typedData.value.referenceModuleData,
      //       referenceModule: typedData.value.referenceModule,
      //       referenceModuleInitData: typedData.value.referenceModuleInitData,
      //       collectModule: typedData.value.collectModule,
      //       collectModuleInitData: typedData.value.collectModuleInitData,
      //       sig: {
      //         v,
      //         r,
      //         s,
      //         deadline: typedData.value.deadline,
      //       },
      //     };
      //     setPostArgs(postArgs);
      //   } else {
      //     clearPost();
      //     setTimeout(async () => {
      //       await handleIndexCheck(
      //         broadcastResult?.data?.broadcast?.txHash,
      //         dispatch,
      //         true
      //       );
      //     }, 7000);
      //   }
      // }
    } catch (err: any) {
      console.error(err.message);
    }
    setPostLoading(false);
  };

  const handlePostWrite = async (): Promise<void> => {
    setPostLoading(true);
    try {
      const tx = await writeAsync?.();
      clearPost();
      const res = await waitForTransaction({
        hash: tx?.hash!,
      });
      await handleIndexCheck(res?.transactionHash, dispatch, true);
    } catch (err) {
      console.error(err);
      setPostLoading(false);
    }
  };

  const handleMentionClick = (user: any) => {
    setProfilesOpen(false);
    let resultElement = document.querySelector("#highlighted-content");
    const newHTMLPost =
      postHTML?.substring(0, postHTML.lastIndexOf("@")) +
      `@${user?.handle}</span>`;
    const newElementPost =
      postDescription?.substring(0, postDescription.lastIndexOf("@")) +
      `@${user?.handle}`;
    setPostDescription(newElementPost);

    const postStorage = JSON.parse(getPostData() || "{}");
    setPostData(
      JSON.stringify({
        ...postStorage,
        post: newElementPost,
      })
    );

    // if (newHTMLPost) (resultElement as any).innerHTML = newHTMLPost;
    setPostHTML(newHTMLPost);
  };

  useEffect(() => {
    if (isSuccess) {
      handlePostWrite();
    }
  }, [isSuccess]);

  useEffect(() => {
    const savedData = getPostData();
    if (savedData) {
      setPostDescription(JSON.parse(savedData).post);
      let resultElement = document.querySelector("#highlighted-content");
      if (
        JSON.parse(savedData).post[JSON.parse(savedData).post?.length - 1] ==
        "\n"
      ) {
        JSON.parse(savedData).post += " ";
      }
      setPostHTML(
        getPostHTML(JSON.parse(savedData).post, resultElement as Element, true)
      );
    }
  }, []);

  useEffect(() => {
    dispatch(setPostGateImages(gifs));
  }, [gifs]);

  useEffect(() => {
    if (searchGif === "" || searchGif === " ") {
      setResults([]);
    }
  }, [searchGif]);

  useEffect(() => {
    if (document.querySelector("#highlighted-content")) {
      document.querySelector("#highlighted-content")!.innerHTML =
        postHTML.length === 0 ? "Have something to say?" : postHTML;
    }
  }, [postHTML]);

  return {
    tokenGatePost,
    postDescription,
    textElement,
    handlePostDescription,
    postLoading,
    caretCoord,
    mentionProfiles,
    profilesOpen,
    handleMentionClick,
    handleGifSubmit,
    handleGif,
    results,
    gifs,
    handleSetGif,
    handleKeyDownDelete,
    tokenIds,
    setTokenIds,
  };
};

export default useMakePost;
