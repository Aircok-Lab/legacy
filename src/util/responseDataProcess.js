import toaster from "./toaster";
const responseDataProcess = responseData => {
  if (responseData.statusCode == "OK") {
    return true;
  } else {
    // alert(responseData.message);
    toaster(responseData.message, 3000, "bg-warning");
  }
  return null;
};

export default responseDataProcess;
