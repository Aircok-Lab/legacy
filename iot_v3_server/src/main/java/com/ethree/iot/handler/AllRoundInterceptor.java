package com.ethree.iot.handler;

import java.util.UUID;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

import com.ethree.iot.cons.BaseDataEnumParticipation;

public class AllRoundInterceptor extends HandlerInterceptorAdapter{

	private static final Logger logger = Logger.getLogger(AllRoundInterceptor.class);
	
	@Override
	public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
		UUID uuid = UUID.randomUUID();
		request.setAttribute(BaseDataEnumParticipation.REQUEST_ID, uuid);
		logger.info("["+request.getMethod()+"] ["+uuid+ "] " +request.getRequestURI());
		return true;
	}
	
	/*종료시,*/
	@Override
	public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex)
			throws Exception {
	}
}
