package com.ethree.iot.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Param;

import com.ethree.iot.vo.RecentDataVO;

import egovframework.rte.psl.dataaccess.mapper.Mapper;

@Mapper("deviceMapper")
public interface DeviceMapper {
	Map<String, Object> findDeviceBySerialNumber(@Param("recentDataVO") RecentDataVO recentDataVO);
	
	List<Map<String, Object>> findDeviceYulBySerialNumber(@Param("recentDataVO") RecentDataVO recentDataVO);
	
	void updateDeviceResetInfoBySerialNumber(@Param("recentDataVO") RecentDataVO recentDataVO);
}
