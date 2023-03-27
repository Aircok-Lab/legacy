package net.cruxware.android.net.transaction;

import com.baby.aircok.acbaby.common.LogUtil;

import java.io.UnsupportedEncodingException;
import java.util.List;
import java.util.Map;

/**
 * 표준 HTTP 전문 클래스 <br/>
 * HTTP 프로토콜을 이용한 전문은 해당 클래스를 상속 받아야 한다.<br/>
 * [변경이력]<br/>
 * 1.0.0: 최초생성<br/>
 * 1.0.1: HTTP header interface 추가, GET 방식 처리<br/>
 * @author fmthead@cruxware.net
 * @version 1.0.1
 * @since 1.0.0
 */
public abstract class HTTPTransaction extends Transaction {

	/**
	 * 디폴트 URL<br/>
	 * @since 1.0.0
	 */
	private static final String DEFAULT_URL = "http://localhost";

	/**
	 * 디폴트 커넥션 타임아웃<br/>
	 * @since 1.0.0
	 */
	private static final int DEFAULT_CONNECTION_TIMEOUT = 30000;

	/**
	 * 디폴트 메소트<br/>
	 * @since 1.0.0
	 */
	private static final String DEFAULT_METHOD = "GET";

	/**
	 * 디폴트 캐릭터 셋<br/>
	 * @since 1.0.0
	 */
	private static final String DEFAULT_CHARSET = "UTF-8";

	/**
	 * 커넥션 URL<br/>
	 * @since 1.0.0
	 */
	protected String connectionURL = DEFAULT_URL;

	/**
	 * 커넥션 타임아웃<br/>
	 * @since 1.0.0
	 */
	protected int connectionTimeout = DEFAULT_CONNECTION_TIMEOUT;

	/**
	 * 메소드<br/>
	 * 허용되는 메소드틑 GET과 POST이다.<br/>
	 * @since 1.0.0
	 */
	protected String method = DEFAULT_METHOD;

	/**
	 * 캐릭터 셋<br/>
	 * @since 1.0.0
	 */
	protected String charset = DEFAULT_CHARSET;

	/**
	 * HTTP Header<br/>
	 * @since 1.0.1
	 */
	protected HTTPHeader httpHeader;

	/**
	 * 커넥션 URL을 얻는다.<br/>
	 * @return 커넥션 URL
	 * @throws Exception 예외
	 * @throws UnsupportedEncodingException 지원하지 않는 인코딩 예외
	 * @since 1.0.0
	 */
	public String getConnectionURL() throws UnsupportedEncodingException, Exception {
		if (method.equals("GET")) {
			String string = new String(getBytes(), charset);
			connectionURL = connectionURL + "?" + string;
		}
		LogUtil.LOGE("[SND]connectionURL : " + connectionURL);
		return connectionURL;
	}

	public String getRawConnectionURL() {
		return connectionURL;
	}

	/**
	 * 커넥션 URL을 설정한다.<br/>
	 * @param connectionURL 커넥션 URL
	 * @since 1.0.0
	 */
	public void setConnectionURL(String connectionURL) {
		this.connectionURL = connectionURL;
	}

	/**
	 * 커넥션 타임아웃을 얻는다.<br/>
	 * @return 커넥션 타임아웃(ms)
	 * @since 1.0.0
	 */
	public int getConnectionTimeout() {
		return connectionTimeout;
	}

	/**
	 * 메소드를 얻는다.<br/>
	 * @return 메소드
	 * @since 1.0.0
	 */
	public String getMethod() {
		return method;
	}

	/**
	 * 캐릭터 셋을 얻는다.<br/>
	 * @return 캐릭터 셋
	 * @since 1.0.0
	 */
	public String getCharset() {
		return charset;
	}

	/**
	 * HTTP Header를 얻는다.<br/>
	 * @return HTTP Header
	 * @since 1.0.1
	 */
	public HTTPHeader getHTTPHeader() {
		return httpHeader;
	}

	/**
	 * HTTP Header를 설정한다.
	 * @param httpHeader HTTP Header
	 * @since 1.0.1
	 */
	public void setHTTPHeader(HTTPHeader httpHeader) {
		this.httpHeader = httpHeader;

		Map<String, String> headerFields  = httpHeader.headerFields;
		String contentType = null;
		if (headerFields.containsKey("Content-Type")) {
			contentType = headerFields.get("Content-Type");
		} else if (headerFields.containsKey("content-type")) {
			contentType = headerFields.get("content-type");
		} else if (headerFields.containsKey("Content-type")) {
			contentType = headerFields.get("Content-type");
		} else if (headerFields.containsKey("content-Type")) {
			contentType = headerFields.get("content-Type");
		} else if (headerFields.containsKey("ContentType")) {
			contentType = headerFields.get("ContentType");
		} else if (headerFields.containsKey("contenttype")) {
			contentType = headerFields.get("contenttype");
		} else if (headerFields.containsKey("Contenttype")) {
			contentType = headerFields.get("Contenttype");
		} else if (headerFields.containsKey("contentType")) {
			contentType = headerFields.get("contentType");
		}

		if (contentType != null) {
			contentType = contentType.toUpperCase();
			int index = contentType.indexOf("CHARSET=");
			if (index >= 0) {
				String charset = (contentType.substring(index + "CHARSET=".length())).trim();
				index = charset.indexOf(";");
				if (index >= 0) {
					charset = contentType.substring(0, index + 1);
				}
				index = charset.indexOf("/");
				if (index >= 0) {
					charset = contentType.substring(0, index + 1);
				}
				this.charset = charset;
			}
		}
	}
	
	public boolean isMultipart() {
		return false;
	}
	
	public List<MultipartItem> getMultiparts() throws Exception {
		return null;
	}
}
