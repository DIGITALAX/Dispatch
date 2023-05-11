import { FunctionComponent } from "react";

const MakePost: FunctionComponent = (): JSX.Element => {
  return (
    <div className="relative w-full h-full flex flex-col p-2">
      <div className="relative w-full h-96 rounded-md  p-2">
        <textarea
          className="relative w-full h-full rounded-md flex items-center justify-center bg-black text-white font-earl p-3"
          style={{ resize: "none" }}
          defaultValue="Token Gated Posts Coming Soon. Connect Your Collectors with Encrypted Content."
          disabled
        ></textarea>
      </div>
    </div>
  );
};

export default MakePost;
