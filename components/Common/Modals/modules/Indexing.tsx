import { FunctionComponent } from "react";
import { IndexingProps } from "../types/modals.types";

const Indexing: FunctionComponent<IndexingProps> = ({
  message,
}): JSX.Element => {
  return (
    <div className="sticky bottom-10 right-10 grid grid-flow-col auto-cols-auto z-50">
      <div className="w-full h-fit grid grid-flow-col auto-cols-auto col-start-1 bottom-10 galaxy:pr-6 absolute col-start-1">
        <div className="relative w-fit h-fit sm:h-16 grid grid-flow-col auto-cols-auto bg-gradient-to-r from-white to-black rounded-lg p-2 sticky font-arcade text-black border-2 border-black justify-self-end self-center break-words">
          <div className="relative w-fit h-fit col-start-1 place-self-center px-4 py-2">
            {message}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Indexing;
