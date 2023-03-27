export const rowsPerPage = 7;

export const measureCycles = [
  { value: 60, label: "1분" },
  { value: 300, label: "5분" },
  { value: 600, label: "10분" },
  { value: 3600, label: "60분" },
  { value: 86400, label: "1Day" }
];

export const measureOrders = [
  "PM10",
  "PM25",
  "HCHO",
  "CO2",
  "VOC",
  "TEMPERATURE",
  "HUMIDITY",
  // "NOISE",
  "NO2",
  "SO2",
  "CO",
  "O3",
  "H2S",
  "NH4",
  "WIND_DIRECTION",
  "WIND_SPEED",
  "INTERNAL_TEMP",
  "INTERNAL_HUMIDITY"
];

export const COLORS = [
  "#1db7a2",
  "#f5bf39",
  "#eb8222",
  "#e9256a",
  "#4ea9e7",
  "#307bd5",
  "#a491d8",
  "#5e5dc0",
  "#3e516f"
];

export const OPTIONS = {
  responsive: true,
  maintainAspectRatio: false,
  legend: {
    display: false
  },
  labels: {
    fontSize: 0,
    display: false,
    labels: {
      fontSize: 0
    }
  },
  tooltips: {
    enabled: false
  },
  rotation: 0.65 * Math.PI,
  circumference: 1.7 * Math.PI
};

export const MEASURES = [
  // { key: "TOTALINDEX", ko_name: "통합공기질관리지수", en_name: "", unit: "" },
  { key: "TEMPERATURE", ko_name: "온도", en_name: "", unit: "℃" },
  { key: "HUMIDITY", ko_name: "습도", en_name: "", unit: "%RH" },
  { key: "PM10", ko_name: "미세먼지", en_name: "PM10", unit: "μg/㎥" },
  { key: "PM25", ko_name: "초미세먼지", en_name: "PM2.5", unit: "μg/㎥" },
  { key: "CO2", ko_name: "이산화탄소", en_name: "CO2", unit: "ppm" },
  { key: "HCHO", ko_name: "포름알데히드", en_name: "HCHO", unit: "μg/㎥" },
  { key: "VOC", ko_name: "휘발성유기화합물", en_name: "VOCs", unit: "ppb" }
  // { key: "NOISE", ko_name: "소음", en_name: "", unit: "dB" }
  // { key: "NO2", ko_name: "이산화질소", en_name: "NO2", unit: "ppm" },
  // { key: "SO2", ko_name: "이산화황", en_name: "SO2", unit: "ppm" },
  // { key: "CO", ko_name: "일산화탄소", en_name: "CO", unit: "ppm" },
  // { key: "O3", ko_name: "오존", en_name: "O3", unit: "ppm" },
  // { key: "H2S", ko_name: "황화수소", en_name: "H2S", unit: "ppm" },
  // { key: "NH3", ko_name: "암모니아", en_name: "NH3", unit: "ppm" },
  // { key: "WIND_DIRECTION", ko_name: "풍향", en_name: "", unit: "방위" },
  // { key: "WIND_SPEED", ko_name: "풍속", en_name: "", unit: "m/s" },
  // { key: "INTERNAL_TEMP", ko_name: "내부온도", en_name: "", unit: "℃" },
  // { key: "INTERNAL_HUMIDITY", ko_name: "내부습도", en_name: "", unit: "%" }
];

export const MEASURES_M = [
  { key: "TOTALINDEX", ko_name: "통합공기질관리지수", en_name: "", unit: "" },
  { key: "PM10", ko_name: "미세먼지", en_name: "PM10", unit: "μg/㎥" },
  { key: "PM25", ko_name: "초미세먼지", en_name: "PM2.5", unit: "μg/㎥" },
  { key: "TEMPERATURE", ko_name: "온도", en_name: "", unit: "℃" },
  { key: "HUMIDITY", ko_name: "습도", en_name: "", unit: "%RH" },
  { key: "CO2", ko_name: "이산화탄소", en_name: "CO2", unit: "ppm" },
  { key: "HCHO", ko_name: "포름알데히드", en_name: "HCHO", unit: "μg/㎥" },
  { key: "VOC", ko_name: "휘발성유기화합물", en_name: "VOCs", unit: "ppb" }
  // { key: "NOISE", ko_name: "소음", en_name: "", unit: "dB" }
  // { key: "NO2", ko_name: "이산화질소", en_name: "NO2", unit: "ppm" },
  // { key: "SO2", ko_name: "이산화황", en_name: "SO2", unit: "ppm" },
  // { key: "CO", ko_name: "일산화탄소", en_name: "CO", unit: "ppm" },
  // { key: "O3", ko_name: "오존", en_name: "O3", unit: "ppm" },
  // { key: "H2S", ko_name: "황화수소", en_name: "H2S", unit: "ppm" },
  // { key: "NH3", ko_name: "암모니아", en_name: "NH3", unit: "ppm" },
  // { key: "WIND_DIRECTION", ko_name: "풍향", en_name: "", unit: "방위" },
  // { key: "WIND_SPEED", ko_name: "풍속", en_name: "", unit: "m/s" },
  // { key: "INTERNAL_TEMP", ko_name: "내부온도", en_name: "", unit: "℃" },
  // { key: "INTERNAL_HUMIDITY", ko_name: "내부습도", en_name: "", unit: "%" }
];

export const MEASURES43 = [
  { key: "PM10", ko_name: "미세먼지", en_name: "PM10", unit: "μg/㎥" },
  { key: "PM25", ko_name: "초미세먼지", en_name: "PM2.5", unit: "μg/㎥" },
  { key: "IN_TEMPERATURE", ko_name: "내부온도", en_name: "", unit: "℃" },
  { key: "OUT_TEMPERATURE", ko_name: "외부온도", en_name: "", unit: "℃" },
  { key: "IN_HUMIDITY", ko_name: "내부습도", en_name: "", unit: "%RH" },
  { key: "OUT_HUMIDITY", ko_name: "외부습도", en_name: "", unit: "%RH" },
  { key: "NO2", ko_name: "이산화질소", en_name: "NO2", unit: "ppm" },
  { key: "SO2", ko_name: "이산화황", en_name: "SO2", unit: "ppm" },
  { key: "CO", ko_name: "일산화탄소", en_name: "CO", unit: "ppm" },
  { key: "O3", ko_name: "오존", en_name: "O3", unit: "ppm" },
  { key: "WIND_DIRECTION", ko_name: "풍향", en_name: "", unit: "방위" },
  { key: "WIND_SPEED", ko_name: "풍속", en_name: "", unit: "m/s" }
];

export const MEASURES43_2 = [
  { key: "r", ko_name: "R", en_name: "", unit: "" },
  { key: "s", ko_name: "S", en_name: "", unit: "" },
  { key: "t", ko_name: "T", en_name: "", unit: "" }
];

export const MEASURES43_3 = [
  { key: "avg", ko_name: "평균", en_name: "", unit: "" },
  { key: "min", ko_name: "최소", en_name: "", unit: "" },
  { key: "max", ko_name: "최대", en_name: "", unit: "" },
  { key: "std", ko_name: "표준편차", en_name: "", unit: "" }
];

export const DeviceDetail = {
  HCHO_name: "HCHO",
  VOC_threshold: 500.0,
  CO2: 558.0,
  HCHO_alertCheck: false,
  NOISE: 0.0,
  PM10_name: "PM10",
  CO2_alertCheck: false,
  deviceName: "측정기1",
  deviceId: 22,
  CO2_threshold: 1000.0,
  facilityName: "시설물1",
  CO2_name: "CO2",
  deviceType: "IND",
  branchId: 1,
  address: "서울특별시 강남구",
  HCHO: 0.0,
  PM10_alertCheck: false,
  branchName: "마곡사이언스",
  deviceCode: "18010002356170062262937",
  VOC: 10.0,
  NOISE_threshold: 1000.0,
  VOC_alertCheck: false,
  NOISE_alertCheck: false,
  VOC_name: "VOC",
  PM10_threshold: 150.0,
  NOISE_name: "소음",
  PM10: 49.0,
  measuredAt: "2018-11-15 18:04:00",
  HCHO_threshold: 100.0,
  status: "false"
};

export const linechartData = {
  labels: [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July"
  ],
  datasets: [
    {
      label: "My First dataset",
      fill: false,
      lineTension: 0.1,
      backgroundColor: "rgba(75,192,192,0.4)",
      borderColor: "rgba(75,192,192,1)",
      borderCapStyle: "butt",
      borderDash: [],
      borderDashOffset: 0.0,
      borderJoinStyle: "miter",
      pointBorderColor: "rgba(75,192,192,1)",
      pointBackgroundColor: "#fff",
      pointBorderWidth: 1,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: "rgba(75,192,192,1)",
      pointHoverBorderColor: "rgba(220,220,220,1)",
      pointHoverBorderWidth: 2,
      pointRadius: 1,
      pointHitRadius: 10,
      data: [
        65,
        59,
        80,
        81,
        56,
        55,
        40,
        65,
        59,
        80,
        81,
        56,
        55,
        40,
        65,
        59,
        80,
        81,
        56,
        55,
        40,
        65,
        59,
        80,
        81,
        56,
        55,
        40,
        65,
        59,
        80,
        81,
        56,
        55,
        40,
        65,
        59,
        80,
        81,
        56,
        55,
        40
      ]
    }
  ]
};

// const COLORS = [
//   "#1db7a2",
//   "#f5bf39",
//   "#eb8222",
//   "#e9256a",
//   "#4ea9e7",
//   "#307bd5",
//   "#a491d8",
//   "#5e5dc0",
//   "#3e516f"
// ];

export const dataSet1 = [
  {
    name: "Johson",
    amount: 30000,
    sex: "M",
    is_married: true
  },
  {
    name: "Monika",
    amount: 355000,
    sex: "F",
    is_married: false
  },
  {
    name: "John",
    amount: 250000,
    sex: "M",
    is_married: false
  },
  {
    name: "Josef",
    amount: 450500,
    sex: "M",
    is_married: true
  }
];

export const dataSet2 = [
  {
    name: "Johnson",
    total: 25,
    remainig: 16
  },
  {
    name: "Josef",
    total: 25,
    remainig: 7
  }
];
