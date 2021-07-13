package com.ethree.iot.api;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.ethree.iot.cons.BaseDataEnumParticipation;
import com.ethree.iot.cons.ResponseBaseDTO;
import com.ethree.iot.cons.BaseDataEnumParticipation.EnumForSaveRecentDataAndFindDevice;
import com.ethree.iot.cons.ResponseBaseDTO.ServiceResponseCodeWithAPI;
import com.ethree.iot.service.RecentDataService;

@RestController
public class RecentDataController {
	
	@Autowired
	private RecentDataService recentDataService;
	
	@PostMapping(value= "/device", consumes=MediaType.TEXT_PLAIN_VALUE, produces=MediaType.TEXT_PLAIN_VALUE)
	public String saveRecentData(HttpServletRequest req, @RequestBody String data) throws Exception  {
		return recentDataService.saveRecentDataAndFindDevice(data, setParamForExceptionAndReturnParamDt(req, data));
	}

	private String setParamForExceptionAndReturnParamDt(HttpServletRequest req, String data) {
		String paramDtStr = data.split("\\|")[EnumForSaveRecentDataAndFindDevice.REG_DT_STR.getArrIdx()];
		if(BaseDataEnumParticipation.FIND_DEVICE_KEY_12.equals(paramDtStr)) {
			paramDtStr = BaseDataEnumParticipation.DATE_FOR_9999;
		}else {
			paramDtStr = Timestamp
					.valueOf(LocalDateTime.from(DateTimeFormatter.ofPattern("yyyyMMddHHmmss")
							.parse(paramDtStr + "00")))
					.toString().replaceAll("\\.\\d+", "");
		}
		req.setAttribute(BaseDataEnumParticipation.PARAM_DT, paramDtStr);
		req.setAttribute(BaseDataEnumParticipation.REQUEST_PARAM_STR, data);
		
		return paramDtStr;
	}
	 
	@GetMapping(value= "/time", produces=MediaType.TEXT_PLAIN_VALUE)
	public String getTime(HttpServletRequest req) throws Exception  {
		return  new ResponseBaseDTO.Builder<String>(ServiceResponseCodeWithAPI.SELECT_DEVICE).items(LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"))).build();
	}

}
