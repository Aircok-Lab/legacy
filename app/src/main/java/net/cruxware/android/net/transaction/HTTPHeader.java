package net.cruxware.android.net.transaction;

import java.util.HashMap;
import java.util.Map;

/**
 * 표준 HTTP 전문 헤더 클래스 <br/>
 * [변경이력]<br/>
 * 1.0.0: 최초생성<br/>
 * @author fmthead@cruxware.net
 * @version 1.0.1
 * @since 1.0.1
 */
public class HTTPHeader {
	
	/**
	 * 헤더 필드<br/>
	 * @since 1.0.1
	 */
	protected Map<String, String> headerFields;
	
	/**
	 * 타임스탬프<br/>
	 * @since 1.0.1
	 */
	protected long timestamp;
	
	/**
	 * 생성자<br/>
	 * @since 1.0.1
	 */
	public HTTPHeader() {
		headerFields = new HashMap<String, String>();
	}
	
	/**
	 * 생성자<br/>
	 * @param headerFields 헤더 필드 맵
	 * @since 1.0.1
	 */
	public HTTPHeader(Map<String, String> headerFields) {
		this.headerFields = headerFields;
	}
	
	/**
	 * 타임스탬프를 얻는다.<br/>
	 * @since 1.0.1
	 * @return 타임스탬프
	 */
	public long getTimestamp() {
		return timestamp;
	}
	
	/**
	 * 헤더 필드를 얻는다.<br/>
	 * @since 1.0.1
	 * @return 헤더 필드
	 */
	public Map<String, String> getHeaderFields() {
		return headerFields;
	}
	
	/**
	 * 타임스탬프를 마킹한다.<br/>
	 * @since 1.0.1
	 */
	public void markTimestamp() {
		timestamp = System.currentTimeMillis();
	}
}
