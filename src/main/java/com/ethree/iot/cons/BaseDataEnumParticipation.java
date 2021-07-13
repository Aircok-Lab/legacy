package com.ethree.iot.cons;

public class BaseDataEnumParticipation {

	public static final String SERIAL_NUMBER_TABLE_PREFIX = "DATA_";
	public static final int ARR_1ST = 1;
	public static final String FIND_DEVICE_KEY_12 = "999999999999";
	public static final String FIND_DEVICE_KEY_3 = "999";
	public static final String FIND_DEVICE_KEY_4 = "9999";
	public static final String FIND_DEVICE_KEY_5 = "99999";
	public static final String DATE_FOR_9999 = "9999-99-99 99:99:00";
	
	public static final String NEW_KINDERGARTEN = "NewKindergarten";
	public static final String KINDERGARTEN = "Kindergarten";
	public static final String NEW_POSTPARTUM = "NewPostpartum";
	public static final String POSTPARTUM = "Postpartum";
	public static final String NEW_OFFICE = "NewOffice";
	public static final String OFFICE = "Office";
	public static final String NEW_HOUSE = "NewHouse";
	public static final String HOUSE = "House";
	public static final String PARAM_DT = "paramDt";
	
	public static final String REQUEST_ID = "requestId";
	public static final String REQUEST_PARAM_STR = "requestParamStr";

	/*arrIdx : | 스플릿 배열 순서
	 *subStrSt : 문자열 자르기 시작위치
	 *subStrEd : 문자열 자르기 종료위치
	 *field : RecentData 필드명
	 * */
	public enum EnumForSaveRecentDataAndFindDevice{
		
        SERIAL_NUMBER(1, 6, "serialNumber"), REG_DT_STR(0, "regDtStr"), DEVICE_TP(1, 2, 4, "deviceTp"), INDOOR(1, 4, 6, "indoor")
        ,PM10(3, "pm10"), PM25(4, "pm25"), CO2(5, "co2"), VOC(6, "voc"), NOISE(7, "noise"), HCHO(8, "hcho"), TEMPERATURE(9, "temperature")
        ,HUMIDITY(10, "humidity"), CO(11, "co");
		
        private int arrIdx;
        private int subStrSt;
        private int subStrEd;
        private String field;
        
        EnumForSaveRecentDataAndFindDevice(int arrIdx, String field){
            this.arrIdx = arrIdx;
            this.field = field;
        }

        EnumForSaveRecentDataAndFindDevice(int arrIdx, int subStrSt, String field){
            this.arrIdx = arrIdx;
            this.subStrSt = subStrSt;
            this.field = field;
        }

        EnumForSaveRecentDataAndFindDevice(int arrIdx, int subStrSt, int subStrEd, String field){
            this.arrIdx = arrIdx;
            this.subStrSt = subStrSt;
            this.subStrEd = subStrEd;
            this.field = field;
        }

        public int getArrIdx() {
            return arrIdx;
        }

        public int getSubStrSt() {
            return subStrSt;
        }

        public int getSubStrEd() {
            return subStrEd;
        }
	}
	
	public enum EnumForDeviceYul{
		CO2("co2"), PM25("pm25"), PM10("pm10"), NOISE("noise"), HCHO("hcho"), TEMPERATURE("temperature"), CO("co"), VOC("voc"), HUMIDITY("humidity"),
		SENSOR_TYPE("sensor_type"), CALC("calc"), MIN("min"), MAX("max"), SCORE("score"), INDEX("index"), ALARM("alarm"), VALUE("value"), GRADE("grade"),
		TEMPERATURE_PUBLIC("temperaturePublic"), HUMIDITY_PUBLIC("humidityPublic");
		
		private String value;
		EnumForDeviceYul(String value){
			this.value = value;
		}
		public String value() {
			return this.value;
		}
	}
	
	/*리스트 순서
	 * grade = index
	 * */
	public enum EnumForIndex{
		GOOD(1, 0, 0, 1, 0, 1), NORMAL(2, 1, 1, 2, 1, 2), UNHEALTHY_FOR_SENSITIVE_GROUP1(3, 2, 2, 3, 2, 3)
		, UNHEALTHY_FOR_SENSITIVE_GROUP2(4, 3, 3, 4, 3, 4), VERY_UNHEALTHY(5, 4, 4, 5, 4, 5), HAZARDOUS(6, 5, 5, 5, 5, 6);
		

		private int compare;
		private int cMax;
		private int cMin;
		private int sMax;
		private int sMin;
		private int index;

		EnumForIndex(int compare, int cMax, int cMin, int sMax, int sMin, int index){
			this.compare = compare;
			this.cMax = cMax;
			this.cMin = cMin;
			this.sMax = sMax;
			this.sMin = sMin;
			this.index = index;
		}
		
		public int getcMax() {
			return cMax;
		}

		public int getcMin() {
			return cMin;
		}

		public int getsMax() {
			return sMax;
		}

		public int getsMin() {
			return sMin;
		}

		public int getCompare() {
			return compare;
		}

		public int getIndex() {
			return index;
		}

	}
	
	public enum EnumForTempIndex{
		
		MONTH_2_6(2, 6, 0, 0), MONTH_5_9(5, 9, 1, 1), MONTH_8_12(8, 12, 2, 2), MONTH_ELSE(3, 3);

		private int strMonth;
		private int endMonth;
		private int cMin;
		private int cMax;
		private int index;
		
		EnumForTempIndex(int index){
			this.index = index;
		}
		
		EnumForTempIndex(int cMin, int cMax){

			this.cMin = cMin;
			this.cMax = cMax;
		}

		EnumForTempIndex(int strMonth, int endMonth, int cMin, int cMax){
			this.strMonth = strMonth;
			this.endMonth = endMonth;
			this.cMin = cMin;
			this.cMax = cMax;
		}

		public int getStrMonth() {
			return strMonth;
		}

		public int getEndMonth() {
			return endMonth;
		}

		public int getcMin() {
			return cMin;
		}

		public int getcMax() {
			return cMax;
		}

		public int getIndex() {
			return index;
		}

	}
	
	public enum EnumForBuildingType{
		NEW_KINDERGARTEN("NewKindergarten", 0.1, 0.1, 0.3, 0.2, 0.1, 0.1, 0.1, 0, 0),
		KINDERGARTEN("Kindergarten", 0.2, 0.3, 0.1, 0.1, 0.1, 0.1, 0.1, 0, 0),
		NEW_POSTPARTUM("NewPostpartum", 0.1, 0.1, 0.3, 0.1, 0.2, 0.1, 0.1, 0, 0),
		POSTPARTUM("Postpartum", 0.15, 0.25, 0.1, 0.1, 0.2, 0.1, 0.1, 0, 0),
		
		
		
		NEW_OFFICE_MONTH_2_6("NewOffice", 0.1, 0.1, 0.1, 0.1, 0.4, 0.1, 0.1, 2, 6),
		NEW_OFFICE_MONTH_5_9("NewOffice", 0.1, 0.1, 0.05, 0.05, 0.4, 0.15, 0.15, 5, 9),
		NEW_OFFICE_MONTH_8_12("NewOffice", 0.1, 0.1, 0.1, 0.1, 0.4, 0.1, 0.1, 8, 12),
		NEW_OFFICE_MONTH_ELSE("NewOffice", 0.1, 0.1, 0.05, 0.05, 0.4, 0.15, 0.15, 0, 0),
		
		
		OFFICE_MONTH_2_6("Office", 0.1, 0.1, 0.15, 0.15, 0.4, 0.05, 0.05, 2, 6),
		OFFICE_MONTH_5_9("Office", 0.1, 0.1, 0.1, 0.1, 0.4, 0.1, 0.1, 5, 9),
		OFFICE_MONTH_8_12("Office", 0.1, 0.1, 0.15, 0.15, 0.4, 0.05, 0.05, 8, 12),
		OFFICE_MONTH_ELSE("Office", 0.1, 0.1, 0.1, 0.1, 0.4, 0.1, 0.1, 0, 0),
		
		NEW_HOUSE("NewHouse", 0.1, 0.3, 0.2, 0.1, 0.1, 0.1, 0.1, 0, 0),
		
		HOUSE("House", 0.1, 0.3, 0.2, 0.1, 0.1, 0.1, 0.1, 0, 0);
		
		private int strMonth;
		private int endMonth;
		
		private String buildingType;
		private double pm10X;
		private double pm25X;
		private double vocX;
		private double hchoX;
		private double co2X;
		private double tempX;
		private double humiX;
		
		EnumForBuildingType(String buildingType, double pm10X, double pm25X, double vocX, double hchoX, double co2X, double tempX, double humiX, int strMonth, int endMonth){
			this.strMonth = strMonth;
			this.endMonth = endMonth;
			this.buildingType = buildingType;
			this.pm10X = pm10X;
			this.pm25X = pm25X;
			this.vocX = vocX;
			this.hchoX = hchoX;
			this.co2X = co2X;
			this.tempX = tempX;
			this.humiX = humiX;
		}

		public int getStrMonth() {
			return strMonth;
		}

		public int getEndMonth() {
			return endMonth;
		}

		public String getBuildingType() {
			return buildingType;
		}

		public double getPm10X() {
			return pm10X;
		}

		public double getPm25X() {
			return pm25X;
		}

		public double getVocX() {
			return vocX;
		}

		public double getHchoX() {
			return hchoX;
		}

		public double getCo2X() {
			return co2X;
		}

		public double getTempX() {
			return tempX;
		}

		public double getHumiX() {
			return humiX;
		}
		
		
	}
}
