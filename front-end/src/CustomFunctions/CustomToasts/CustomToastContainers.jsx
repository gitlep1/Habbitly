import { ToastContainer } from "react-toastify";

const CustomToastContainers = () => {
  return (
    <>
      <ToastContainer
        containerId={"general-toast"}
        autoClose={4500}
        theme="dark"
        limit={1}
        position="top-right"
        closeOnClick={false}
        pauseOnHover={false}
        pauseOnFocusLoss={false}
        enableMultiContainer
      />

      <ToastContainer
        containerId={"toast-notify"}
        autoClose={3000}
        theme="dark"
        limit={1}
        position="top-center"
        closeOnClick={false}
        pauseOnHover={false}
        pauseOnFocusLoss={false}
        enableMultiContainer
      />

      <ToastContainer
        containerId={"notify-success"}
        autoClose={2000}
        theme="dark"
        limit={1}
        position="top-right"
        closeOnClick={false}
        pauseOnHover={false}
        pauseOnFocusLoss={false}
        enableMultiContainer
      />

      <ToastContainer
        containerId={"nonEmptyMsg"}
        autoClose={2000}
        theme="dark"
        limit={1}
        position="top-right"
        closeOnClick={true}
        pauseOnHover={false}
        pauseOnFocusLoss={false}
        enableMultiContainer
      />
    </>
  );
};

export default CustomToastContainers;
