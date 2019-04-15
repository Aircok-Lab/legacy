//// 개발시 자동 입력할때는 true로 설정
const setData = true;

const setInitValue = value => {
  if (setData) {
    return value;
  }
  return "";
};

export default setInitValue;
