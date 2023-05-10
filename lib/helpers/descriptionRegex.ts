const descriptionRegex = (description: string, messages?: boolean) => {
  const styledText = description?.split(" ")?.map((word: string, index: number, array: string[]) => {
    if (word[0] === "#") {
      if (messages) {
        return `<em id="hashtags" style="color: #ff494a; cursor: pointer; font-style: normal; white-space: nowrap;">${word}</em>`;
      } else {
        return `<em id="hashtags" style="color: #81A8F8; cursor: pointer; font-style: normal; white-space: nowrap;">${word}</em>`;
      }
    } else if (word[0] === "@") {
      if (messages) {
        return `
          <a href="${`/profile/${
            word?.replace("@", "")?.split(".test")[0]
          }`}" rel="noreferrer" style="white-space: nowrap;${index < array.length - 1 ? 'margin-right: 4px' : ''}">
            <span style="color: #ff494a;">${word}</span>
          </a>
        `;
      } else {
        return `
          <a href="${`/profile/${
            word?.replace("@", "")?.split(".test")[0]
          }`}" rel="noreferrer" style="white-space: nowrap;${index < array.length - 1 ? 'margin-right: 4px' : ''}">
            <span style="color: #81A8F8;">${word}</span>
          </a>
        `;
      }
    } else if (
      (word[0] && word[1] && word[2] === "w" && word[3] === ".") ||
      (word[word.length] === "z" &&
        word[word.length - 1] === "y" &&
        word[word.length - 2] === "x" &&
        word[word.length - 3] === ".") ||
      (word[word.length] === "m" &&
        word[word.length - 1] === "o" &&
        word[word.length - 2] === "c" &&
        word[word.length - 3] === ".")
    ) {
      if (messages) {
        return `
          <a href=${
            word?.includes("//") ? word : `//${word}`
          } target="_blank" rel="noreferrer" style="white-space: nowrap;">
            <span style="color: #ff494a;">${word}</span>
          </a>
        `;
      } else {
        return `
          <a href=${
            word?.includes("//") ? word : `//${word}`
          } target="_blank" rel="noreferrer" style="white-space: nowrap;">
            <span style="color: #81A8F8;">${word}</span>
          </a>
        `;
      }
    } else {
      return word;
    }
  });

  const wrappedText = `<div style="white-space: pre-wrap;">${styledText?.join(" ")}</div>`;
  return wrappedText;
};

export default descriptionRegex;