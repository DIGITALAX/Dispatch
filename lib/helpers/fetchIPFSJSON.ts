import { INFURA_GATEWAY } from "../constants";

const fetchIPFSJSON = async (uri: string): Promise<any> => {
  const response = await fetch(`${INFURA_GATEWAY}/ipfs/${uri}`);
  const json = await response.json();

  const header = await fetch(
    `${INFURA_GATEWAY}/ipfs/${
      json.image?.includes("ipfs://")
        ? json.image?.split("ipfs://")[1]
        : json.image
    }`,
    {
      method: "HEAD",
    }
  );
  const type = header.headers.get("Content-Type");
  return { json, type };
};

export default fetchIPFSJSON;
