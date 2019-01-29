package net.cruxware.android.net.transaction;

/**
 * 표준 전문 예외 클래스 <br/>
 * [변경이력]<br/>
 * 1.0.0: 최초생성<br/>
 * @author fmthead@cruxware.net
 * @version 1.0.1
 * @since 1.0.0
 */
public class TransactionException extends Exception {

	/**
	 * serialVersionUID<br/>
	 * @since 1.0.0
	 */
	private static final long serialVersionUID = 3383215546172625420L;
	
	/**
	 * 오류(클래스) 명<br/>
	 * @since 1.0.0
	 */
	private String exception;
	
	/**
	 * 이동(다운로드) URL<br/>
	 * @since 1.0.0
	 */
	private String url;
	
	/**
	 * 어플리케이션 강제종료 여부<br/>
	 * @since 1.0.0
	 */
	private boolean terminate;
	
	/**
	 * 서버로 부터 수신된 오류인지에 대한 여부<br/>
	 * @since 1.0.0
	 */
	private boolean fromServer;
	
	/**
	 * 생성자<br/>
	 * @param exception 오류(클래스) 명 
	 * @param message 오류 메시지
	 * @param url 이동(다운로드) URL
	 * @param terminate 어플리케이션 강제종료 여부
	 * @since 1.0.0
	 */
	public TransactionException(String exception, String message, String url, boolean terminate) {
		super(message);
		this.exception = exception;
		this.url = url;
		this.terminate = terminate;
		fromServer = true;
	}
	
	/**
	 * 생성자<br/>
	 * @param e 에외 객체
	 * @since 1.0.0
	 */
	public TransactionException(Exception e) {
		super(e.getLocalizedMessage());
		this.exception = e.getClass().getName();
		fromServer = false;
	}
	
	/**
	 * 오류(클래스) 명을 얻는다.<br/>
	 * @return 오류(클래스) 명 
	 * @since 1.0.0
	 */
	public String getException() {
		return exception;
	}
	
	/**
	 * 이동(다운로드) URL을 얻는다.<br/>
	 * @return 이동(다운로드) URL
	 * @since 1.0.0
	 */
	public String getURL() {
		return url;
	}
	
	/**
	 * 어플리케이션 강제종료 여부를 얻는다.<br/>
	 * @return 어플리케이션 강제종료 여부
	 * @since 1.0.0
	 */
	public boolean getTerminate() {
		return terminate;
	}

	/**
	 * 오류 메시지를 얻는다.<br/>
	 * @return 오류 메시지
	 * @since 1.0.0
	 */
	public boolean isFromServer() {
		return fromServer;
	}
}
