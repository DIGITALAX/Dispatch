const CREATOR_STORAGE_KEY = "IS_CREATOR";

export const setCreatorToken = (value: boolean) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(CREATOR_STORAGE_KEY, JSON.stringify(value));
    return;
  }
};

export const getCreaterToken = () => {
  if (typeof window !== "undefined") {
    const data = localStorage.getItem(CREATOR_STORAGE_KEY);
    
    if (!data) {
      return false;
    }

    return data;
  }
};
