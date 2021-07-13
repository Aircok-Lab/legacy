package com.ethree.iot.mapper;

import java.util.List;
import java.util.Map;

import egovframework.rte.psl.dataaccess.mapper.Mapper;

@Mapper("commonMapper")
public interface CommonMapper {
	List<Map<String, Object>> findAllIndexTable();
	List<Map<String, Object>> findAllAlarmTable();
}
