const fileLimitAlert = (file: File): boolean | void => {
    if (!file) return;
  
    if (file.size > 4194304) {
      alert("Maximum File Size of 4MB, Try Reducing It");
      return true;
    } else {
      return false;
    }
  };
  
  export default fileLimitAlert;
  