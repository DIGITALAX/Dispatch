const fileLimitAlert = (file: File): boolean | void => {
  if (!file) return;

  if (file.type === "image/png") {
    if (file.size > 4194304) {
      alert("Maximum File Size of 4MB, Try Reducing It");
      return true;
    } else {
      return false;
    }
  } else {
    if (file.size > 15728640) {
      alert("Maximum File Size of 15MB, Try Reducing It");
      return true;
    } else {
      return false;
    }
  }
};

export default fileLimitAlert;
