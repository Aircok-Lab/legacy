package com.ethree.iot.mapper;

import org.apache.ibatis.annotations.Param;

import com.ethree.iot.vo.RecentDataVO;

import egovframework.rte.psl.dataaccess.mapper.Mapper;

@Mapper("recentDataMapper")
public interface RecentDataMapper {
	void saveRecentDataSerialNumber(@Param("recentVO")RecentDataVO recentDataVO, @Param("tableName")String tableName);
	void saveRecentData(@Param("recentVO")RecentDataVO recentDataVO, @Param("deviceSN") String deviceSN);
}
