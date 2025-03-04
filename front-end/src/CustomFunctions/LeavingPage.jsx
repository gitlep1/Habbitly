const LeavingPage = async (token, navigate) => {
  const warnUserLeavingPage = () => {
    window.addEventListener("beforeunload", alertUser);
    window.addEventListener("unload", handleEndPoint);
    return () => {
      window.removeEventListener("beforeunload", alertUser);
      window.removeEventListener("unload", handleEndPoint);
    };
  };

  const alertUser = (e) => {
    e.preventDefault();
    e.returnValue = "Are you sure you want to leave this page?";
  };

  const handleEndPoint = async () => {
    console.log("user left page");
    navigate("/");
  };

  return warnUserLeavingPage();
};

export default LeavingPage;
