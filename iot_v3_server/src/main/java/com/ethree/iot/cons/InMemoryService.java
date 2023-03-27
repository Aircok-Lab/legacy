package com.ethree.iot.cons;

import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

import javax.annotation.PostConstruct;
import javax.annotation.Resource;

import org.apache.log4j.Logger;
import org.springframework.stereotype.Service;
import org.springframework.util.ObjectUtils;

import com.ethree.iot.cons.BaseDataEnumParticipation.EnumForDeviceYul;
import com.ethree.iot.mapper.CommonMapper;


@Service
public class InMemoryService {
	
	@Resource(name = "commonMapper")
	private CommonMapper commonMapper;
	
	private static Logger logger = Logger.getLogger(InMemoryService.class);

	private static Map<String, List<Map<String,Object>>> globalIndexMap = new ConcurrentHashMap<String, List<Map<String,Object>>>();

	@SuppressWarnings("unchecked")
	@PostConstruct
	public void resetGlobalIndexList() {
		if(ObjectUtils.isEmpty(globalIndexMap)) {
			
			logger.info("[GLOBAL_INDEX_MAP] LOADING...");
			
			List<Map<String, Object>> dataList = commonMapper.findAllIndexTable();
			
			globalIndexMap.put(EnumForDeviceYul.PM10.value(), (List<Map<String, Object>>) dataList.stream().filter(map -> map.get(
					EnumForDeviceYul.SENSOR_TYPE.value()).equals(EnumForDeviceYul.PM10.value())).collect(Collectors.toList()));
			globalIndexMap.put(EnumForDeviceYul.PM25.value(), (List<Map<String, Object>>) dataList.stream().filter(map -> map.get(
					EnumForDeviceYul.SENSOR_TYPE.value()).equals(EnumForDeviceYul.PM25.value())).collect(Collectors.toList()));
			globalIndexMap.put(EnumForDeviceYul.CO2.value(), (List<Map<String, Object>>) dataList.stream().filter(map -> map.get(
					EnumForDeviceYul.SENSOR_TYPE.value()).equals(EnumForDeviceYul.CO2.value())).collect(Collectors.toList()));
			globalIndexMap.put(EnumForDeviceYul.HCHO.value(), (List<Map<String, Object>>) dataList.stream().filter(map -> map.get(
					EnumForDeviceYul.SENSOR_TYPE.value()).equals(EnumForDeviceYul.HCHO.value())).collect(Collectors.toList()));
			globalIndexMap.put(EnumForDeviceYul.VOC.value(), (List<Map<String, Object>>) dataList.stream().filter(map -> map.get(
					EnumForDeviceYul.SENSOR_TYPE.value()).equals(EnumForDeviceYul.VOC.value())).collect(Collectors.toList()));
			globalIndexMap.put(EnumForDeviceYul.NOISE.value(), (List<Map<String, Object>>) dataList.stream().filter(map -> map.get(
					EnumForDeviceYul.SENSOR_TYPE.value()).equals(EnumForDeviceYul.NOISE.value())).collect(Collectors.toList()));
			globalIndexMap.put(EnumForDeviceYul.CO.value(), (List<Map<String, Object>>) dataList.stream().filter(map -> map.get(
					EnumForDeviceYul.SENSOR_TYPE.value()).equals(EnumForDeviceYul.CO.value())).collect(Collectors.toList()));
			globalIndexMap.put(EnumForDeviceYul.SCORE.value(), (List<Map<String, Object>>) dataList.stream().filter(map -> map.get(
					EnumForDeviceYul.SENSOR_TYPE.value()).equals(EnumForDeviceYul.SCORE.value())).collect(Collectors.toList()));
			globalIndexMap.put(EnumForDeviceYul.TEMPERATURE.value(), (List<Map<String, Object>>) dataList.stream().filter(map -> map.get(
					EnumForDeviceYul.SENSOR_TYPE.value()).equals(EnumForDeviceYul.TEMPERATURE.value())).collect(Collectors.toList()));
			globalIndexMap.put(EnumForDeviceYul.HUMIDITY.value(), (List<Map<String, Object>>) dataList.stream().filter(map -> map.get(
					EnumForDeviceYul.SENSOR_TYPE.value()).equals(EnumForDeviceYul.HUMIDITY.value())).collect(Collectors.toList()));
			globalIndexMap.put(EnumForDeviceYul.TEMPERATURE_PUBLIC.value(), (List<Map<String, Object>>) dataList.stream().filter(map -> map.get(
					EnumForDeviceYul.SENSOR_TYPE.value()).equals(EnumForDeviceYul.TEMPERATURE_PUBLIC.value())).collect(Collectors.toList()));
			globalIndexMap.put(EnumForDeviceYul.HUMIDITY_PUBLIC.value(), (List<Map<String, Object>>) dataList.stream().filter(map -> map.get(
					EnumForDeviceYul.SENSOR_TYPE.value()).equals(EnumForDeviceYul.HUMIDITY_PUBLIC.value())).collect(Collectors.toList()));

		}
	}
	
	public List<Map<String, Object>> findGlobalIndexMapBySensorType(EnumForDeviceYul sensorType){
		return globalIndexMap.get(sensorType.value());
	}
}
