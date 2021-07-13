package com.ethree.iot.service;

import java.sql.Timestamp;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import javax.annotation.Resource;
import javax.script.ScriptEngine;
import javax.script.ScriptEngineManager;
import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.ObjectUtils;

import com.ethree.iot.cons.BaseDataEnumParticipation;

import com.ethree.iot.cons.BaseDataEnumParticipation.EnumForBuildingType;
import com.ethree.iot.cons.BaseDataEnumParticipation.EnumForDeviceYul;
import com.ethree.iot.cons.BaseDataEnumParticipation.EnumForIndex;
import com.ethree.iot.cons.BaseDataEnumParticipation.EnumForSaveRecentDataAndFindDevice;
import com.ethree.iot.cons.BaseDataEnumParticipation.EnumForTempIndex;
import com.ethree.iot.cons.ResponseBaseDTO.ServiceResponseCodeWithAPI;
import com.ethree.iot.handler.APIBaseException;
import com.ethree.iot.cons.InMemoryService;
import com.ethree.iot.cons.ResponseBaseDTO;
import com.ethree.iot.mapper.DeviceMapper;
import com.ethree.iot.mapper.RecentDataMapper;
import com.ethree.iot.vo.RecentDataVO;

@Service
public class RecentDataService {

	private static Logger logger = Logger.getLogger(RecentDataService.class);

	@Resource(name = "recentDataMapper")
	private RecentDataMapper recentDataMapper;

	@Resource(name = "deviceMapper")
	private DeviceMapper deviceMapper;
	
	@Autowired
	private ScriptEngineManager scriptEngineManager;
	
	@Autowired
	private InMemoryService inMemoryService;

	/*
	 * 1. 기기 정보 조회
	 * 2. 파라미터 파싱
	 * 3. 디바이스 배율 정보 계산
	 * 4. 센서, 온.습도, 토탈, 알람 등의 계산
	 * 5. RECENT_DATA 업데이트, DATA_SERIAL_NUMBER(기기번호) 삽입
	 * 5. 요청 예시
	 * 	(1) 측정정보 삽입
	 * 		202105111646|20060003IE000004|0001|0005|9999|00000|00000|00055|00365|1258|180|0000|00060|v5.1.2|!=
	 * 	(2) 기기 조회
	 * 		999999999999|20060003IE000004|0001|0005|0005|00000|00000|00055|00365|1258|180|0000|00060|v5.1.2|!=
	 * 6. 응답 예시 
	 * 	(1) 측정정보 삽입
	 * 		$$aircok:s$$OK|2021-05-11 16:46:00$$aircok:e$$
	 * 	(2) 측정정보 조회
	 * 		$$aircok:s$$null|null|null|285391|null|null|null|null|null|null|1|null|null|null|0|0|72|0x1dd5$$aircok:e$$
	 * 	(3) 예외상황(internal server err)
	 * 		$$aircok:s$$NO|2021-05-11 16:46:00$$aircok:e$$ 또는 $$aircok:s$$OK|9999-99-99 99:99:00$$aircok:e$$
	 * */

	@SuppressWarnings("unlikely-arg-type")
	@Transactional
	public String saveRecentDataAndFindDevice(String data, String paramDt) throws Exception  {

		RecentDataVO deviceInfoParam = new RecentDataVO();
		deviceInfoParam.setSerialNumber(data.split("\\|")[EnumForSaveRecentDataAndFindDevice.SERIAL_NUMBER.getArrIdx()]
				.substring(EnumForSaveRecentDataAndFindDevice.SERIAL_NUMBER.getSubStrSt()));
		Map<String, Object> deviceInfo = deviceMapper.findDeviceBySerialNumber(deviceInfoParam);
		ScriptEngine scriptEngine = scriptEngineManager.getEngineByName("js");

		if (!ObjectUtils.isEmpty(deviceInfo)) {
			RecentDataVO orinVO = parseForSaveRecentDataAndFindDevice(data);
			
			if (!BaseDataEnumParticipation.DATE_FOR_9999.equals(paramDt)) {
				List<Map<String, Object>> deviceYulInfo = deviceMapper.findDeviceYulBySerialNumber(orinVO);
				if (!ObjectUtils.isEmpty(deviceYulInfo)) {
					for (Map<String, Object> deviceYul : deviceYulInfo) {

						String calcStr = (String) deviceYul.get(EnumForDeviceYul.CALC.value());
						Double min = (Double) deviceYul.get(EnumForDeviceYul.MIN.value());
						Double max = (Double) deviceYul.get(EnumForDeviceYul.MAX.value());
						String sensorType = (String) deviceYul.get(EnumForDeviceYul.SENSOR_TYPE.value());

						if(EnumForDeviceYul.CO2.value().equals(sensorType)
										&& orinVO.getCo2() != null
										&& orinVO.getCo2() >= min
										&& orinVO.getCo2() <= max) {
							orinVO.setCo2Org((Integer) scriptEngine.eval(String.valueOf(orinVO.getCo2()) + calcStr));
						}
						if(EnumForDeviceYul.PM25.value().equals(sensorType)
								&& orinVO.getPm25() != null
								&& orinVO.getPm25() >= min
								&& orinVO.getPm25() <= max){
							orinVO.setPm25((Integer) scriptEngine.eval(String.valueOf(orinVO.getPm25()) + calcStr));
						}
						if(EnumForDeviceYul.PM10.value().equals(sensorType)
								&& orinVO.getPm10() != null
								&& orinVO.getPm10() >= min
								&& orinVO.getPm10() <= max){
							orinVO.setPm10((Integer) scriptEngine.eval(String.valueOf(orinVO.getPm10()) + calcStr));
						}
						if(EnumForDeviceYul.NOISE.value().equals(sensorType)
								&& orinVO.getNoise() != null
								&& orinVO.getNoise() >= min
								&& orinVO.getNoise() <= max){
							orinVO.setNoise((Integer) scriptEngine.eval(String.valueOf(orinVO.getNoise()) + calcStr));
						}
						if(EnumForDeviceYul.HCHO.value().equals(sensorType)
								&& orinVO.getHcho() != null
								&& orinVO.getHcho() >= min
								&& orinVO.getHcho() <= max){
							orinVO.setHcho((Integer) scriptEngine.eval(String.valueOf(orinVO.getHcho()) + calcStr));
						}
						if(EnumForDeviceYul.TEMPERATURE.value().equals(sensorType)
								&& orinVO.getTemperature() != null
								&& orinVO.getTemperature() >= min
								&& orinVO.getTemperature() <= max){
							orinVO.setTemperature((Double) scriptEngine.eval(String.valueOf(orinVO.getTemperature()) + calcStr));
						}
						if(EnumForDeviceYul.CO.value().equals(sensorType)
								&& orinVO.getCo() != null
								&& orinVO.getCo() >= min
								&& orinVO.getCo() <= max){
							orinVO.setCo((Integer) scriptEngine.eval(String.valueOf(orinVO.getCo()) + calcStr));
						}
						if(EnumForDeviceYul.VOC.value().equals(sensorType)
								&& orinVO.getVoc() != null
								&& orinVO.getVoc() >= min
								&& orinVO.getVoc() <= max){
							orinVO.setCo((Integer) scriptEngine.eval(String.valueOf(orinVO.getVoc()) + calcStr));
						}
						if(EnumForDeviceYul.HUMIDITY.value().equals(sensorType)
								&& orinVO.getHumidity() != null
								&& orinVO.getHumidity() >= min
								&& orinVO.getHumidity() <= max){
							orinVO.setHumidity((Double) scriptEngine.eval(String.valueOf(orinVO.getHumidity()) + calcStr));
						}
					}
				}
				
				
				String buildingType = (String) deviceInfo.get("building_type");
				int isPublicBuilding = (int)deviceInfo.get("is_public_building");

				if (StringUtils.isNotBlank(buildingType)) {
					
					EnumForDeviceYul sensorArray[] = new EnumForDeviceYul[]{
							EnumForDeviceYul.PM10, EnumForDeviceYul.PM25,EnumForDeviceYul.CO2,EnumForDeviceYul.HCHO,
							EnumForDeviceYul.VOC,EnumForDeviceYul.NOISE, EnumForDeviceYul.CO};
					
					for(EnumForDeviceYul sensor : sensorArray) {
						setSensorIndex(sensor, orinVO);
					}
					
					EnumForDeviceYul sensorArrayForTempAndHumidity[] = new EnumForDeviceYul[]{
							EnumForDeviceYul.TEMPERATURE, EnumForDeviceYul.HUMIDITY};
					
					for(EnumForDeviceYul sensorForTempAndHumidity : sensorArrayForTempAndHumidity) {
						setTempIndexAndHumidityIndex(isPublicBuilding, sensorForTempAndHumidity, orinVO);
					}
					
					
					setCalcTotalIndex(buildingType, orinVO);

					orinVO.setParamDt(Timestamp.valueOf(paramDt));

					recentDataMapper.saveRecentData(orinVO, orinVO.getSerialNumber());
					recentDataMapper.saveRecentDataSerialNumber(orinVO, BaseDataEnumParticipation.SERIAL_NUMBER_TABLE_PREFIX + orinVO.getSerialNumber());

					if("05".equals(orinVO.getDeviceTp()) || "06".equals(orinVO.getDeviceTp()) || "07".equals(orinVO.getDeviceTp())) {
						return new ResponseBaseDTO.Builder<String>(ServiceResponseCodeWithAPI.INSERT_DEVICE).items(paramDt).build();
					}
				}

			}else {

				String resetInfo = StringUtils.isEmpty((String) deviceInfo.get("reset_info")) ? "null" : (String) deviceInfo.get("reset_info");
				
				StringBuffer result = new StringBuffer();
				result.append(resetInfo);
				result.append("|");
				result.append(StringUtils.isEmpty((String) deviceInfo.get("send_period")) ? "null"
						: deviceInfo.get("send_period"));
				result.append("|");
				result.append(StringUtils.isEmpty((String) deviceInfo.get("version")) ? "null" : deviceInfo.get("version"));
				result.append("|");
				result.append(deviceInfo.get("filesize"));
				result.append("|");
				result.append(
						StringUtils.isEmpty((String) deviceInfo.get("fota_url")) ? "null" : deviceInfo.get("fota_url"));
				result.append("|");
				result.append(
						StringUtils.isEmpty((String) deviceInfo.get("upload_url")) ? "null" : deviceInfo.get("upload_url"));
				result.append("|");
				result.append(StringUtils.isEmpty((String) deviceInfo.get("ethernet_ip")) ? "null"
						: deviceInfo.get("ethernet_ip"));
				result.append("|");
				result.append(StringUtils.isEmpty((String) deviceInfo.get("subnet")) ? "null" : deviceInfo.get("subnet"));
				result.append("|");
				result.append(StringUtils.isEmpty((String) deviceInfo.get("gateway")) ? "null" : deviceInfo.get("gateway"));
				result.append("|");
				result.append(StringUtils.isEmpty((String) deviceInfo.get("dns")) ? "null" : deviceInfo.get("dns"));
				result.append("|");
				result.append(deviceInfo.get("dhcp"));
				result.append("|");
				result.append(
						StringUtils.isEmpty((String) deviceInfo.get("checksum")) ? "null" : deviceInfo.get("checksum"));
				result.append("|");
				result.append(
						StringUtils.isEmpty((String) deviceInfo.get("upload_ip")) ? "null" : deviceInfo.get("upload_ip"));
				result.append("|");
				result.append(StringUtils.isEmpty((String) deviceInfo.get("fota_ip")) ? "null" : deviceInfo.get("fota_ip"));

				int irPm10 = 0;
				int irPm25 = 0;
				int irTemp = 0;
				int irCo2 = 0;
				
				if(StringUtils.isNotBlank((String) deviceInfo.get("serial_number"))) {

					if(orinVO.getPm10() >= (int) deviceInfo.get("pm10_gang_start") && orinVO.getPm10() <= (int) deviceInfo.get("pm10_gang_end")) {
						irPm10 = 3;
					}else if(orinVO.getPm10() >= (int) deviceInfo.get("pm10_jung_start") && orinVO.getPm10() <= (int) deviceInfo.get("pm10_jung_end")) {
						irPm10 = 2;
					}else if(orinVO.getPm10() >= (int) deviceInfo.get("pm10_yag_start") && orinVO.getPm10() <= (int) deviceInfo.get("pm10_yag_end")) {
						irPm10 = 1;
					}
					
	                if (orinVO.getPm25() >= (int) deviceInfo.get("pm25_gang_start") && orinVO.getPm25() <= (int) deviceInfo.get("pm25_gang_end")) {
	                	irPm25 = 3;
	                } else if (orinVO.getPm25() >= (int) deviceInfo.get("pm25_gang_start") && orinVO.getPm25() <= (int) deviceInfo.get("pm25_gang_end")) {
	                	irPm25 = 2;
	                }else if (orinVO.getPm25() >= (int) deviceInfo.get("pm25_gang_start") && orinVO.getPm25() <= (int) deviceInfo.get("pm25_gang_end")) {
	                	irPm25 = 1;
	                }
	                
	                irTemp = orinVO.getTemperature() >= (double) deviceInfo.get("temperature_ir") ? 1 : 0;
	                irCo2 = orinVO.getCo2() >= (double) deviceInfo.get("co2_ir") ? 1 : 0;
				}
				
                
                result.append("|");
                result.append(new LinkedList<>(Arrays.asList(irPm10,irPm25,irCo2)).stream().max(Integer::compare).orElse(-1));
                result.append("|");
                result.append(irTemp);

                if("1".equals(resetInfo)) {
                	deviceMapper.updateDeviceResetInfoBySerialNumber(orinVO);
                }

                String resultStr = result.toString();

                int assci = 0;
                for(int i = 0; i < resultStr.length(); i++) {
                	assci = assci + Character.codePointAt(resultStr.substring(i, i+1), 0);
                }
                
                result.append("|");
                result.append(resultStr.length());
                result.append("|");
                result.append("0x"+String.valueOf(Integer.toHexString(assci)));
				
				return new ResponseBaseDTO.Builder<String>(ServiceResponseCodeWithAPI.SELECT_DEVICE).items(result.toString()).build();
			}
		} else {
			return  new ResponseBaseDTO.Builder<String>(ServiceResponseCodeWithAPI.NO_DEVICE).items(paramDt).build();
		}

		return new ResponseBaseDTO.Builder<String>(ServiceResponseCodeWithAPI.NO_DEVICE).items(paramDt).build();
	}

	private RecentDataVO parseForSaveRecentDataAndFindDevice(String data) {

		RecentDataVO result = new RecentDataVO();
		List<String> paramList = Arrays.asList(data.split("\\|"));

		int idx = 0;
		for (String param : paramList) {
			if (idx == BaseDataEnumParticipation.ARR_1ST) {
				result.setSerialNumber(param.substring(EnumForSaveRecentDataAndFindDevice.SERIAL_NUMBER.getSubStrSt()));
				result.setDeviceTp(param.substring(EnumForSaveRecentDataAndFindDevice.DEVICE_TP.getSubStrSt(),
						EnumForSaveRecentDataAndFindDevice.DEVICE_TP.getSubStrEd()));
				result.setIndoor(param.substring(EnumForSaveRecentDataAndFindDevice.INDOOR.getSubStrSt(),
						EnumForSaveRecentDataAndFindDevice.INDOOR.getSubStrEd()));
			}
			if (idx == EnumForSaveRecentDataAndFindDevice.PM10.getArrIdx()) {
				result.setPm10(
						BaseDataEnumParticipation.FIND_DEVICE_KEY_4.equals(param) ? null : Integer.parseInt(param));
				result.setPm10Org(
						BaseDataEnumParticipation.FIND_DEVICE_KEY_4.equals(param) ? null : Integer.parseInt(param));
			}
			if (idx == EnumForSaveRecentDataAndFindDevice.PM25.getArrIdx()) {
				result.setPm25(
						BaseDataEnumParticipation.FIND_DEVICE_KEY_4.equals(param) ? null : Integer.parseInt(param));
				result.setPm25Org(
						BaseDataEnumParticipation.FIND_DEVICE_KEY_4.equals(param) ? null : Integer.parseInt(param));
			}
			if (idx == EnumForSaveRecentDataAndFindDevice.CO2.getArrIdx()) {
				result.setCo2(
						BaseDataEnumParticipation.FIND_DEVICE_KEY_5.equals(param) ? null : Integer.parseInt(param));
				result.setCo2Org(
						BaseDataEnumParticipation.FIND_DEVICE_KEY_5.equals(param) ? null : Integer.parseInt(param));
			}
			if (idx == EnumForSaveRecentDataAndFindDevice.VOC.getArrIdx()) {
				result.setVoc(
						BaseDataEnumParticipation.FIND_DEVICE_KEY_5.equals(param) ? null : Integer.parseInt(param));
				result.setVocOrg(
						BaseDataEnumParticipation.FIND_DEVICE_KEY_5.equals(param) ? null : Integer.parseInt(param));
			}
			if (idx == EnumForSaveRecentDataAndFindDevice.NOISE.getArrIdx()) {
				result.setNoise(
						BaseDataEnumParticipation.FIND_DEVICE_KEY_5.equals(param) ? null : Integer.parseInt(param));
				result.setNoiseOrg(
						BaseDataEnumParticipation.FIND_DEVICE_KEY_5.equals(param) ? null : Integer.parseInt(param));
			}
			if (idx == EnumForSaveRecentDataAndFindDevice.HCHO.getArrIdx()) {
				result.setHcho(
						BaseDataEnumParticipation.FIND_DEVICE_KEY_5.equals(param) ? null : Integer.parseInt(param));
				result.setHchoOrg(
						BaseDataEnumParticipation.FIND_DEVICE_KEY_5.equals(param) ? null : Integer.parseInt(param));
			}
			if (idx == EnumForSaveRecentDataAndFindDevice.TEMPERATURE.getArrIdx()) {
				result.setTemperature(BaseDataEnumParticipation.FIND_DEVICE_KEY_4.equals(param) ? null
						: (Integer.parseInt(param) - 1000) / 10.0);
				result.setTemperatureOrg(BaseDataEnumParticipation.FIND_DEVICE_KEY_4.equals(param) ? null
						: (Integer.parseInt(param) - 1000) / 10.0);
			}
			if (idx == EnumForSaveRecentDataAndFindDevice.HUMIDITY.getArrIdx()) {
				result.setHumidity(BaseDataEnumParticipation.FIND_DEVICE_KEY_3.equals(param) ? null
						: Float.parseFloat(param) / 10.0);
				result.setHumidityOrg(BaseDataEnumParticipation.FIND_DEVICE_KEY_3.equals(param) ? null
						: Float.parseFloat(param) / 10.0);
			}
			if (idx == EnumForSaveRecentDataAndFindDevice.CO.getArrIdx()) {
				result.setCo(
						BaseDataEnumParticipation.FIND_DEVICE_KEY_4.equals(param) ? null : Integer.parseInt(param));
				result.setCoOrg(
						BaseDataEnumParticipation.FIND_DEVICE_KEY_4.equals(param) ? null : Integer.parseInt(param));
			}

			idx++;
		}

		return result;
	}

	private void setSensorIndex(EnumForDeviceYul sensorType, RecentDataVO calcVO){
		List<Map<String, Object>> dataList = inMemoryService.findGlobalIndexMapBySensorType(sensorType);
		List<Map<String, Object>> scoreList = inMemoryService.findGlobalIndexMapBySensorType(EnumForDeviceYul.SCORE);
		
		int index = 0;
		int alarm = 0;
		double score = 0;
		Integer sensorValue = null;
		
		if(sensorType == EnumForDeviceYul.PM10) {
			sensorValue = calcVO.getPm10();
		}else if(sensorType == EnumForDeviceYul.PM25) {
			sensorValue = calcVO.getPm25();
		}else if(sensorType == EnumForDeviceYul.CO2) {
			sensorValue = calcVO.getCo2();
		}else if(sensorType == EnumForDeviceYul.HCHO) {
			sensorValue = calcVO.getHcho();
		}else if(sensorType == EnumForDeviceYul.VOC) {
			sensorValue = calcVO.getVoc();
		}else if(sensorType == EnumForDeviceYul.NOISE) {
			sensorValue = calcVO.getNoise();
		}else if(sensorType == EnumForDeviceYul.CO) {
			sensorValue = calcVO.getCo();
		}

		if (sensorValue != null) {

			if (sensorValue < (Double) dataList.get(EnumForIndex.GOOD.getCompare()).get(EnumForDeviceYul.MIN.value())) {
				score = calcScoreForSensorIndex(
						(double) dataList.get(EnumForIndex.GOOD.getcMax()).get(EnumForDeviceYul.MAX.value()),
						(double) dataList.get(EnumForIndex.GOOD.getcMin()).get(EnumForDeviceYul.MIN.value()),
						(double) scoreList.get(EnumForIndex.GOOD.getsMax()).get(EnumForDeviceYul.MIN.value()) - 0.1,
						(double) scoreList.get(EnumForIndex.GOOD.getsMin()).get(EnumForDeviceYul.MIN.value()),
						sensorValue);
				index = EnumForIndex.GOOD.getIndex();
			} else if (sensorValue < (Double) dataList.get(EnumForIndex.NORMAL.getCompare())
					.get(EnumForDeviceYul.MIN.value())) {
				score = calcScoreForSensorIndex(
						(double) dataList.get(EnumForIndex.NORMAL.getcMax()).get(EnumForDeviceYul.MAX.value()),
						(double) dataList.get(EnumForIndex.NORMAL.getcMin()).get(EnumForDeviceYul.MIN.value()),
						(double) scoreList.get(EnumForIndex.NORMAL.getsMax()).get(EnumForDeviceYul.MIN.value()) - 0.1,
						(double) scoreList.get(EnumForIndex.NORMAL.getsMin()).get(EnumForDeviceYul.MIN.value()),
						sensorValue);
				index = EnumForIndex.NORMAL.getIndex();
			} else if (sensorValue < (Double) dataList.get(EnumForIndex.UNHEALTHY_FOR_SENSITIVE_GROUP1.getCompare())
					.get(EnumForDeviceYul.MIN.value())) {
				score = calcScoreForSensorIndex(
						(double) dataList.get(EnumForIndex.UNHEALTHY_FOR_SENSITIVE_GROUP1.getcMax())
								.get(EnumForDeviceYul.MAX.value()),
						(double) dataList.get(EnumForIndex.UNHEALTHY_FOR_SENSITIVE_GROUP1.getcMin())
								.get(EnumForDeviceYul.MIN.value()),
						(double) scoreList.get(EnumForIndex.UNHEALTHY_FOR_SENSITIVE_GROUP1.getsMax())
								.get(EnumForDeviceYul.MIN.value()) - 0.1,
						(double) scoreList.get(EnumForIndex.UNHEALTHY_FOR_SENSITIVE_GROUP1.getsMin())
								.get(EnumForDeviceYul.MIN.value()),
						sensorValue);
				index = EnumForIndex.UNHEALTHY_FOR_SENSITIVE_GROUP1.getIndex();
			} else if (sensorValue < (Double) dataList.get(EnumForIndex.UNHEALTHY_FOR_SENSITIVE_GROUP2.getCompare())
					.get(EnumForDeviceYul.MIN.value())) {
				score = calcScoreForSensorIndex(
						(double) dataList.get(EnumForIndex.UNHEALTHY_FOR_SENSITIVE_GROUP2.getcMax())
								.get(EnumForDeviceYul.MAX.value()),
						(double) dataList.get(EnumForIndex.UNHEALTHY_FOR_SENSITIVE_GROUP2.getcMin())
								.get(EnumForDeviceYul.MIN.value()),
						(double) scoreList.get(EnumForIndex.UNHEALTHY_FOR_SENSITIVE_GROUP2.getsMax())
								.get(EnumForDeviceYul.MIN.value()) - 0.1,
						(double) scoreList.get(EnumForIndex.UNHEALTHY_FOR_SENSITIVE_GROUP2.getsMin())
								.get(EnumForDeviceYul.MIN.value()),
						sensorValue);
				index = EnumForIndex.UNHEALTHY_FOR_SENSITIVE_GROUP2.getIndex();
			} else if (sensorValue < (Double) dataList.get(EnumForIndex.VERY_UNHEALTHY.getCompare())
					.get(EnumForDeviceYul.MIN.value())) {
				score = calcScoreForSensorIndex(
						(double) dataList.get(EnumForIndex.VERY_UNHEALTHY.getcMax()).get(EnumForDeviceYul.MAX.value()),
						(double) dataList.get(EnumForIndex.VERY_UNHEALTHY.getcMin()).get(EnumForDeviceYul.MIN.value()),
						(double) scoreList.get(EnumForIndex.VERY_UNHEALTHY.getsMax()).get(EnumForDeviceYul.MIN.value())
								- 0.1,
						(double) scoreList.get(EnumForIndex.VERY_UNHEALTHY.getsMin()).get(EnumForDeviceYul.MIN.value()),
						sensorValue);
				index = EnumForIndex.VERY_UNHEALTHY.getIndex();
			} else {
				score = calcScoreForSensorIndex(
						(double) dataList.get(EnumForIndex.HAZARDOUS.getcMax()).get(EnumForDeviceYul.MAX.value()),
						(double) dataList.get(EnumForIndex.HAZARDOUS.getcMin()).get(EnumForDeviceYul.MIN.value()),
						(double) scoreList.get(EnumForIndex.HAZARDOUS.getsMax()).get(EnumForDeviceYul.MIN.value()),
						(double) scoreList.get(EnumForIndex.HAZARDOUS.getsMin()).get(EnumForDeviceYul.MIN.value()),
						sensorValue);
				index = EnumForIndex.HAZARDOUS.getIndex();
			}
			
			alarm = sensorValue > (double) dataList.get(EnumForIndex.GOOD.getcMax()).get(EnumForDeviceYul.ALARM.value()) ? 1 : 0;

		}
		
		if(sensorType == EnumForDeviceYul.PM10) {
			calcVO.setPm10Score(score);
			calcVO.setPm10Index(index);
			calcVO.setPm10(sensorValue);
			calcVO.setPm10Alarm(alarm);
		}else if(sensorType == EnumForDeviceYul.PM25) {
			calcVO.setPm25Score(score);
			calcVO.setPm25Index(index);
			calcVO.setPm25(sensorValue);
			calcVO.setPm25Alarm(alarm);
		}else if(sensorType == EnumForDeviceYul.CO2) {
			calcVO.setCo2Score(score);
			calcVO.setCo2Index(index);
			calcVO.setCo2(sensorValue);
			calcVO.setCo2Alarm(alarm);
		}else if(sensorType == EnumForDeviceYul.HCHO) {
			calcVO.setHchoScore(score);
			calcVO.setHchoIndex(index);
			calcVO.setHcho(sensorValue);
			calcVO.setHchoAlarm(alarm);
		}else if(sensorType == EnumForDeviceYul.VOC) {
			calcVO.setVocScore(score);
			calcVO.setVocIndex(index);
			calcVO.setVoc(sensorValue);
			calcVO.setVocAlarm(alarm);
		}else if(sensorType == EnumForDeviceYul.NOISE) {
			calcVO.setNoiseScore(score);
			calcVO.setNoiseIndex(index);
			calcVO.setNoise(sensorValue);
			calcVO.setNoiseAlarm(alarm);
		}else if(sensorType == EnumForDeviceYul.CO) {
			calcVO.setCoScore(score);
			calcVO.setCoIndex(index);
			calcVO.setCo(sensorValue);
			calcVO.setCoAlarm(alarm);
		}

	}
	
	private double calcScoreForSensorIndex(double cMax, double cMin, double sMax, double sMin, int sensorValue) {
		return Math.floor(((sMax - sMin) / (cMax - cMin)) * (sensorValue - cMin) + sMin);
	}
	
	private void setTempIndexAndHumidityIndex(int isPublicBuilding, EnumForDeviceYul sensorType, RecentDataVO calcVO){
		
		List<Map<String, Object>> dataList = null;
		List<Map<String, Object>> scoreList = inMemoryService.findGlobalIndexMapBySensorType(EnumForDeviceYul.SCORE);

		int index = 0;
		int alarm = 0;
		double score = 0;
		Double value = null;
		
		int monthPlus1 = LocalDate.now().getMonthValue();

		if(isPublicBuilding == 1 && sensorType == EnumForDeviceYul.TEMPERATURE) {
			dataList = inMemoryService.findGlobalIndexMapBySensorType(EnumForDeviceYul.TEMPERATURE_PUBLIC);
			value = calcVO.getTemperature();
		}else if(sensorType == EnumForDeviceYul.TEMPERATURE) {
			dataList = inMemoryService.findGlobalIndexMapBySensorType(EnumForDeviceYul.TEMPERATURE);
			value = calcVO.getTemperature();
		}else if(isPublicBuilding == 1 && sensorType == EnumForDeviceYul.HUMIDITY) {
			dataList = inMemoryService.findGlobalIndexMapBySensorType(EnumForDeviceYul.HUMIDITY_PUBLIC);
			value = calcVO.getHumidity();
		}else if(sensorType == EnumForDeviceYul.HUMIDITY) {
			dataList = inMemoryService.findGlobalIndexMapBySensorType(EnumForDeviceYul.HUMIDITY);
			value = calcVO.getHumidity();
		}

		if(value != null) {
			if(monthPlus1 > EnumForTempIndex.MONTH_2_6.getStrMonth() &&
					monthPlus1 < EnumForTempIndex.MONTH_2_6.getEndMonth()) {
				score = calcScoreForTempIndexAndHumidityIndex((double)dataList.get(EnumForTempIndex.MONTH_2_6.getcMin()).get(EnumForDeviceYul.MIN.value()),
						(double)dataList.get(EnumForTempIndex.MONTH_2_6.getcMax()).get(EnumForDeviceYul.MAX.value()),
						value
						);
			}else if(monthPlus1 > EnumForTempIndex.MONTH_5_9.getStrMonth() &&
					monthPlus1 < EnumForTempIndex.MONTH_5_9.getEndMonth()) {
				score = calcScoreForTempIndexAndHumidityIndex((double)dataList.get(EnumForTempIndex.MONTH_5_9.getcMin()).get(EnumForDeviceYul.MIN.value()),
						(double)dataList.get(EnumForTempIndex.MONTH_5_9.getcMax()).get(EnumForDeviceYul.MAX.value()),
						value
						);
			}else if(monthPlus1 > EnumForTempIndex.MONTH_8_12.getStrMonth() &&
					monthPlus1 < EnumForTempIndex.MONTH_8_12.getEndMonth()) {
				score = calcScoreForTempIndexAndHumidityIndex((double)dataList.get(EnumForTempIndex.MONTH_8_12.getcMin()).get(EnumForDeviceYul.MIN.value()),
						(double)dataList.get(EnumForTempIndex.MONTH_8_12.getcMax()).get(EnumForDeviceYul.MAX.value()),
						value
						);
			}else{
				score = calcScoreForTempIndexAndHumidityIndex((double)dataList.get(EnumForTempIndex.MONTH_ELSE.getcMin()).get(EnumForDeviceYul.MIN.value()),
						(double)dataList.get(EnumForTempIndex.MONTH_ELSE.getcMax()).get(EnumForDeviceYul.MAX.value()),
						value
						);
			}
			  
			if(score < (double) scoreList.get(EnumForIndex.GOOD.getIndex()).get(EnumForDeviceYul.MIN.value())) {
				index = EnumForIndex.GOOD.getIndex();
			}else if(score < (double) scoreList.get(EnumForIndex.NORMAL.getIndex()).get(EnumForDeviceYul.MIN.value())) {
				index = EnumForIndex.NORMAL.getIndex();
			}else if(score < (double) scoreList.get(EnumForIndex.UNHEALTHY_FOR_SENSITIVE_GROUP1.getIndex()).get(EnumForDeviceYul.MIN.value())) {
				index = EnumForIndex.UNHEALTHY_FOR_SENSITIVE_GROUP1.getIndex();
			}else if(score < (double) scoreList.get(EnumForIndex.UNHEALTHY_FOR_SENSITIVE_GROUP2.getIndex()).get(EnumForDeviceYul.MIN.value())) {
				index = EnumForIndex.UNHEALTHY_FOR_SENSITIVE_GROUP2.getIndex();
			}else if(score < (double) scoreList.get(EnumForIndex.VERY_UNHEALTHY.getIndex()).get(EnumForDeviceYul.MIN.value())) {
				index = EnumForIndex.VERY_UNHEALTHY.getIndex();
			}else{
				index = EnumForIndex.HAZARDOUS.getIndex();
			}
			
			if (sensorType == EnumForDeviceYul.TEMPERATURE) {
				alarm = (((double) dataList.get(EnumForIndex.GOOD.getIndex()).get(EnumForDeviceYul.ALARM.value())
						- 2) >= value
						|| ((double) dataList.get(EnumForIndex.GOOD.getIndex())
								.get(EnumForDeviceYul.ALARM.value()) + 2) <= value) ? 1 : 0;
			}else if(sensorType == EnumForDeviceYul.HUMIDITY) {
				alarm = (((double) dataList.get(EnumForIndex.GOOD.getIndex()).get(EnumForDeviceYul.ALARM.value())
						- 10) >= value
						|| ((double) dataList.get(EnumForIndex.GOOD.getIndex())
								.get(EnumForDeviceYul.ALARM.value()) - 10) <= value) ? 1 : 0;
			}

		}

		if(sensorType == EnumForDeviceYul.TEMPERATURE) {
			calcVO.setTemperatureScore(score);
			calcVO.setTemperatureIndex(index);
			calcVO.setTemperature(value);
			calcVO.setTemperatureAlarm(alarm);
		}else if(sensorType == EnumForDeviceYul.HUMIDITY) {
			calcVO.setHumidityScore(score);
			calcVO.setHumidityIndex(index);
			calcVO.setHumidity(value);
			calcVO.setHumidityAlarm(alarm);
		}

	}
	
	private double calcScoreForTempIndexAndHumidityIndex(double cMin, double cMax, double temperature) {
		return Math.floor(100 * (Math.abs(temperature - (cMin + cMax) / 2) / (cMax - cMin)) * 2);
	}
	
	
	private void setCalcTotalIndex(String buildingType, RecentDataVO calcVO){

		List<Map<String, Object>> scoreList = inMemoryService.findGlobalIndexMapBySensorType(EnumForDeviceYul.SCORE);
		
		int index = 0;
		double score = 0;
		
		int monthPlus1 = LocalDate.now().getMonthValue();
		
		double pm10Score = calcVO.getPm10Score();
		double pm25Score = calcVO.getPm25Score();
		double co2Score = calcVO.getCo2Score();
		double hchoScore = calcVO.getHchoScore();
		double vocScore = calcVO.getVocScore();
		double temperatureScore = calcVO.getTemperatureScore();
		double humidityScore = calcVO.getHumidityScore();
		
		switch (buildingType) {

		case BaseDataEnumParticipation.NEW_KINDERGARTEN:
			score = EnumForBuildingType.NEW_KINDERGARTEN.getPm10X() * pm10Score
					+ EnumForBuildingType.NEW_KINDERGARTEN.getPm25X() * pm25Score
					+ EnumForBuildingType.NEW_KINDERGARTEN.getVocX() * vocScore
					+ EnumForBuildingType.NEW_KINDERGARTEN.getHchoX() * hchoScore
					+ EnumForBuildingType.NEW_KINDERGARTEN.getCo2X() * co2Score
					+ EnumForBuildingType.NEW_KINDERGARTEN.getTempX() * temperatureScore
					+ EnumForBuildingType.NEW_KINDERGARTEN.getHumiX() * humidityScore;
			break;
		case BaseDataEnumParticipation.KINDERGARTEN:
			score = EnumForBuildingType.KINDERGARTEN.getPm10X() * pm10Score
					+ EnumForBuildingType.KINDERGARTEN.getPm25X() * pm25Score
					+ EnumForBuildingType.KINDERGARTEN.getVocX() * vocScore
					+ EnumForBuildingType.KINDERGARTEN.getHchoX() * hchoScore
					+ EnumForBuildingType.KINDERGARTEN.getCo2X() * co2Score
					+ EnumForBuildingType.KINDERGARTEN.getTempX() * temperatureScore
					+ EnumForBuildingType.KINDERGARTEN.getHumiX() * humidityScore;
			break;
		case BaseDataEnumParticipation.NEW_POSTPARTUM:
			score = EnumForBuildingType.NEW_POSTPARTUM.getPm10X() * pm10Score
					+ EnumForBuildingType.NEW_POSTPARTUM.getPm25X() * pm25Score
					+ EnumForBuildingType.NEW_POSTPARTUM.getVocX() * vocScore
					+ EnumForBuildingType.NEW_POSTPARTUM.getHchoX() * hchoScore
					+ EnumForBuildingType.NEW_POSTPARTUM.getCo2X() * co2Score
					+ EnumForBuildingType.NEW_POSTPARTUM.getTempX() * temperatureScore
					+ EnumForBuildingType.NEW_POSTPARTUM.getHumiX() * humidityScore;
			break;

		case BaseDataEnumParticipation.NEW_OFFICE:
			if (monthPlus1 > EnumForBuildingType.NEW_OFFICE_MONTH_2_6.getStrMonth()
					&& monthPlus1 < EnumForBuildingType.NEW_OFFICE_MONTH_2_6.getEndMonth()) {
				score = EnumForBuildingType.NEW_OFFICE_MONTH_2_6.getPm10X() * pm10Score
						+ EnumForBuildingType.NEW_OFFICE_MONTH_2_6.getPm25X() * pm25Score
						+ EnumForBuildingType.NEW_OFFICE_MONTH_2_6.getVocX() * vocScore
						+ EnumForBuildingType.NEW_OFFICE_MONTH_2_6.getHchoX() * hchoScore
						+ EnumForBuildingType.NEW_OFFICE_MONTH_2_6.getCo2X() * co2Score
						+ EnumForBuildingType.NEW_OFFICE_MONTH_2_6.getTempX() * temperatureScore
						+ EnumForBuildingType.NEW_OFFICE_MONTH_2_6.getHumiX() * humidityScore;
			} else if (monthPlus1 > EnumForBuildingType.NEW_OFFICE_MONTH_5_9.getStrMonth()
					&& monthPlus1 < EnumForBuildingType.NEW_OFFICE_MONTH_5_9.getEndMonth()) {
				score = EnumForBuildingType.NEW_OFFICE_MONTH_5_9.getPm10X() * pm10Score
						+ EnumForBuildingType.NEW_OFFICE_MONTH_5_9.getPm25X() * pm25Score
						+ EnumForBuildingType.NEW_OFFICE_MONTH_5_9.getVocX() * vocScore
						+ EnumForBuildingType.NEW_OFFICE_MONTH_5_9.getHchoX() * hchoScore
						+ EnumForBuildingType.NEW_OFFICE_MONTH_5_9.getCo2X() * co2Score
						+ EnumForBuildingType.NEW_OFFICE_MONTH_5_9.getTempX() * temperatureScore
						+ EnumForBuildingType.NEW_OFFICE_MONTH_5_9.getHumiX() * humidityScore;
			} else if (monthPlus1 > EnumForBuildingType.NEW_OFFICE_MONTH_8_12.getStrMonth()
					&& monthPlus1 < EnumForBuildingType.NEW_OFFICE_MONTH_8_12.getEndMonth()) {
				score = EnumForBuildingType.NEW_OFFICE_MONTH_8_12.getPm10X() * pm10Score
						+ EnumForBuildingType.NEW_OFFICE_MONTH_8_12.getPm25X() * pm25Score
						+ EnumForBuildingType.NEW_OFFICE_MONTH_8_12.getVocX() * vocScore
						+ EnumForBuildingType.NEW_OFFICE_MONTH_8_12.getHchoX() * hchoScore
						+ EnumForBuildingType.NEW_OFFICE_MONTH_8_12.getCo2X() * co2Score
						+ EnumForBuildingType.NEW_OFFICE_MONTH_8_12.getTempX() * temperatureScore
						+ EnumForBuildingType.NEW_OFFICE_MONTH_8_12.getHumiX() * humidityScore;
			} else {
				score = EnumForBuildingType.NEW_OFFICE_MONTH_ELSE.getPm10X() * pm10Score
						+ EnumForBuildingType.NEW_OFFICE_MONTH_ELSE.getPm25X() * pm25Score
						+ EnumForBuildingType.NEW_OFFICE_MONTH_ELSE.getVocX() * vocScore
						+ EnumForBuildingType.NEW_OFFICE_MONTH_ELSE.getHchoX() * hchoScore
						+ EnumForBuildingType.NEW_OFFICE_MONTH_ELSE.getCo2X() * co2Score
						+ EnumForBuildingType.NEW_OFFICE_MONTH_ELSE.getTempX() * temperatureScore
						+ EnumForBuildingType.NEW_OFFICE_MONTH_ELSE.getHumiX() * humidityScore;
			}
			break;

		case BaseDataEnumParticipation.OFFICE:
			if (monthPlus1 > EnumForBuildingType.OFFICE_MONTH_2_6.getStrMonth()
					&& monthPlus1 < EnumForBuildingType.OFFICE_MONTH_2_6.getEndMonth()) {
				score = EnumForBuildingType.OFFICE_MONTH_2_6.getPm10X() * pm10Score
						+ EnumForBuildingType.OFFICE_MONTH_2_6.getPm25X() * pm25Score
						+ EnumForBuildingType.OFFICE_MONTH_2_6.getVocX() * vocScore
						+ EnumForBuildingType.OFFICE_MONTH_2_6.getHchoX() * hchoScore
						+ EnumForBuildingType.OFFICE_MONTH_2_6.getCo2X() * co2Score
						+ EnumForBuildingType.OFFICE_MONTH_2_6.getTempX() * temperatureScore
						+ EnumForBuildingType.OFFICE_MONTH_2_6.getHumiX() * humidityScore;
			} else if (monthPlus1 > EnumForBuildingType.OFFICE_MONTH_5_9.getStrMonth()
					&& monthPlus1 < EnumForBuildingType.OFFICE_MONTH_5_9.getEndMonth()) {
				score = EnumForBuildingType.OFFICE_MONTH_5_9.getPm10X() * pm10Score
						+ EnumForBuildingType.OFFICE_MONTH_5_9.getPm25X() * pm25Score
						+ EnumForBuildingType.OFFICE_MONTH_5_9.getVocX() * vocScore
						+ EnumForBuildingType.OFFICE_MONTH_5_9.getHchoX() * hchoScore
						+ EnumForBuildingType.OFFICE_MONTH_5_9.getCo2X() * co2Score
						+ EnumForBuildingType.OFFICE_MONTH_5_9.getTempX() * temperatureScore
						+ EnumForBuildingType.OFFICE_MONTH_5_9.getHumiX() * humidityScore;
			} else if (monthPlus1 > EnumForBuildingType.OFFICE_MONTH_8_12.getStrMonth()
					&& monthPlus1 < EnumForBuildingType.OFFICE_MONTH_8_12.getEndMonth()) {
				score = EnumForBuildingType.OFFICE_MONTH_8_12.getPm10X() * pm10Score
						+ EnumForBuildingType.OFFICE_MONTH_8_12.getPm25X() * pm25Score
						+ EnumForBuildingType.OFFICE_MONTH_8_12.getVocX() * vocScore
						+ EnumForBuildingType.OFFICE_MONTH_8_12.getHchoX() * hchoScore
						+ EnumForBuildingType.OFFICE_MONTH_8_12.getCo2X() * co2Score
						+ EnumForBuildingType.OFFICE_MONTH_8_12.getTempX() * temperatureScore
						+ EnumForBuildingType.OFFICE_MONTH_8_12.getHumiX() * humidityScore;
			} else {
				score = EnumForBuildingType.OFFICE_MONTH_ELSE.getPm10X() * pm10Score
						+ EnumForBuildingType.OFFICE_MONTH_ELSE.getPm25X() * pm25Score
						+ EnumForBuildingType.OFFICE_MONTH_ELSE.getVocX() * vocScore
						+ EnumForBuildingType.OFFICE_MONTH_ELSE.getHchoX() * hchoScore
						+ EnumForBuildingType.OFFICE_MONTH_ELSE.getCo2X() * co2Score
						+ EnumForBuildingType.OFFICE_MONTH_ELSE.getTempX() * temperatureScore
						+ EnumForBuildingType.OFFICE_MONTH_ELSE.getHumiX() * humidityScore;
			}
			break;

		case BaseDataEnumParticipation.NEW_HOUSE:
			score = EnumForBuildingType.NEW_HOUSE.getPm10X() * pm10Score
					+ EnumForBuildingType.NEW_HOUSE.getPm25X() * pm25Score
					+ EnumForBuildingType.NEW_HOUSE.getVocX() * vocScore
					+ EnumForBuildingType.NEW_HOUSE.getHchoX() * hchoScore
					+ EnumForBuildingType.NEW_HOUSE.getCo2X() * co2Score
					+ EnumForBuildingType.NEW_HOUSE.getTempX() * temperatureScore
					+ EnumForBuildingType.NEW_HOUSE.getHumiX() * humidityScore;
			break;

		case BaseDataEnumParticipation.HOUSE:
			score = EnumForBuildingType.HOUSE.getPm10X() * pm10Score + EnumForBuildingType.HOUSE.getPm25X() * pm25Score
					+ EnumForBuildingType.HOUSE.getVocX() * vocScore + EnumForBuildingType.HOUSE.getHchoX() * hchoScore
					+ EnumForBuildingType.HOUSE.getCo2X() * co2Score
					+ EnumForBuildingType.HOUSE.getTempX() * temperatureScore
					+ EnumForBuildingType.HOUSE.getHumiX() * humidityScore;
			break;
		}
		
		/*INDEX*/
		if(score < (double) scoreList.get(EnumForIndex.GOOD.getIndex()).get(EnumForDeviceYul.MIN.value())) {
			index = EnumForIndex.GOOD.getIndex();
		}else if(score < (double) scoreList.get(EnumForIndex.NORMAL.getIndex()).get(EnumForDeviceYul.MIN.value())) {
			index = EnumForIndex.NORMAL.getIndex();
		}else if(score < (double) scoreList.get(EnumForIndex.UNHEALTHY_FOR_SENSITIVE_GROUP1.getIndex()).get(EnumForDeviceYul.MIN.value())) {
			index = EnumForIndex.UNHEALTHY_FOR_SENSITIVE_GROUP1.getIndex();
		}else if(score < (double) scoreList.get(EnumForIndex.UNHEALTHY_FOR_SENSITIVE_GROUP2.getIndex()).get(EnumForDeviceYul.MIN.value())) {
			index = EnumForIndex.UNHEALTHY_FOR_SENSITIVE_GROUP2.getIndex();
		}else if(score < (double) scoreList.get(EnumForIndex.VERY_UNHEALTHY.getIndex()).get(EnumForDeviceYul.MIN.value())) {
			index = EnumForIndex.VERY_UNHEALTHY.getIndex();
		}else{
			index = EnumForIndex.HAZARDOUS.getIndex();
		}
		
		calcVO.setE3Index(index);
		calcVO.setE3Score(Math.floor(score));

	}
	
}
