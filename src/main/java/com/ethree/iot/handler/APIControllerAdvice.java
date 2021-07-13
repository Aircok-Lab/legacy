package com.ethree.iot.handler;

import java.io.PrintWriter;
import java.io.StringWriter;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.ethree.iot.cons.BaseDataEnumParticipation;
import com.ethree.iot.cons.ResponseBaseDTO;
import com.ethree.iot.cons.ResponseBaseDTO.ServiceResponseCodeWithAPI;

@RestControllerAdvice 
public class APIControllerAdvice {
	
	private static Logger logger = Logger.getLogger(APIControllerAdvice.class);

	@ExceptionHandler(Exception.class)
	public String superExceptionHandler(final HttpServletRequest request, final HttpServletResponse response, final Exception e) throws Exception {
		logger.error("[SUPER_EXCEPTION] ["+ request.getAttribute(BaseDataEnumParticipation.REQUEST_ID) +"] " + getPrintStackTrace(e));
		logger.error("[PARAM] ["+ request.getAttribute(BaseDataEnumParticipation.REQUEST_ID) +"] "  + request.getAttribute(BaseDataEnumParticipation.REQUEST_PARAM_STR));
		return new ResponseBaseDTO.Builder<String>(ServiceResponseCodeWithAPI.NO_DEVICE)
				.items((String)request.getAttribute(BaseDataEnumParticipation.PARAM_DT)).build();
	}
	
	/*추후 정의하여 사용 아직 Exception에 대한 미 설계*/
	@ExceptionHandler(APIBaseException.class)
	public String customExceptionHandler(final HttpServletRequest request, final HttpServletResponse response, final Exception e) throws Exception {
		logger.error("[CUSTOM_EXCEPTION] ["+ request.getAttribute(BaseDataEnumParticipation.REQUEST_ID) +"] "  + getPrintStackTrace(e));
		logger.error("[PARAM] ["+ request.getAttribute(BaseDataEnumParticipation.REQUEST_ID) +"] "  + request.getAttribute(BaseDataEnumParticipation.REQUEST_PARAM_STR));
		return new ResponseBaseDTO.Builder<String>(ServiceResponseCodeWithAPI.NO_DEVICE)
				.items((String)request.getAttribute(BaseDataEnumParticipation.PARAM_DT)).build();
	}
	
	private String getPrintStackTrace(Exception e) {
	    StringWriter errors = new StringWriter();
	    e.printStackTrace(new PrintWriter(errors));
	    return errors.toString().substring(0, 500);
	}
}
