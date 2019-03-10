const responseDataProcess = responseData => {
  // console.log("responseData", responseData);
  if (responseData.statusCode == "OK") {
    return responseData.data;
  } else {
    alert(responseData.message);
  }
  return null;
};

export default responseDataProcess;
