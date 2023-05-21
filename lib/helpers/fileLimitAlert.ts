const fileLimitAlert = (file: File): boolean | void => {
  if (!file) return;

  if (file.size > 26214400) {
    alert("Maximum File Size of 25MB, Try Reducing It");
    return true;
  } else {
    return false;
  }
};

export default fileLimitAlert;
