import { FunctionComponent } from "react";

const MakePost: FunctionComponent = (): JSX.Element => {
  return (
    <div className="relative w-full h-fit flex flex-col p-2">
      <div className="relative w-full h-full rounded-md p-2">
        <textarea
          className="relative w-full h-48 preG:h-fit xl:h-60 rounded-md flex items-center justify-center bg-black text-white font-earl p-3 text-center"
          style={{ resize: "none" }}
          defaultValue="Token Gated Posts Coming Soon. Connect Your Collectors with Encrypted Content."
          disabled
        ></textarea>
      </div>
    </div>
  );
};

export default MakePost;
