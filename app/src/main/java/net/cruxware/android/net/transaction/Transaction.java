package net.cruxware.android.net.transaction;

import net.cruxware.android.net.client.NetworkClient;

import java.util.UUID;


/**
 * 표준 전문 클래스 <br/>
 * 모든 전문은 해당 클래스를 상속 받아야 한다.<br/>
 * [변경이력]<br/>
 * 1.0.0: 최초생성<br/>
 * @author fmthead@cruxware.net
 * @version 1.0.1
 * @since 1.0.0
 */
public abstract class Transaction {
	
	/**
	 * 디폴트 송수신 타임아웃<br/>
	 * @since 1.0.0
	 */
	private static final int DEFAULT_SO_TIMEOUT = 30000;
	
	/**
	 * 패킷 아이디<br/>
	 * @since 1.0.0
	 */
	protected String pid = UUID.randomUUID().toString();
	
	/**
	 * 네트워크 클라이언트 인터페이스 객체<br/>
	 * @since 1.0.0
	 */
	protected NetworkClient networkClient;
	
	/**
	 * 전문 클래스 프리픽스(프리픽스 + 전문코드 = 전문클래스 풀네임)<br/>
	 * @since 1.0.0
	 */
	protected String prefix;
	
	/**
	 * 디폴트 송수신 타임아웃<br/>
	 * @since 1.0.0
	 */
	protected int soTimeout = DEFAULT_SO_TIMEOUT;
	
	/**
	 * 전문 송신 시간<br/>
	 * @since 1.0.0
	 */
	protected long startTime = System.currentTimeMillis();
	
	/**
	 * 폴링 전문 여부<br/>
	 * 폴링이 설정되면 해당 전문이 송수신 될 때 onStarted, onEnded 이벤트 함수가 불리지 않는다.<br/>
	 * @since 1.0.0
	 */
	protected boolean polling = false;
	
	/**
	 * 생성자<br/>
	 * @since 1.0.0
	 */
	public Transaction() {
		super();
	}
		
	/**
	 * 네트워크 클라이언트 인터페이스를 얻는다.<br/>
	 * @return 네트워크 클라이언트 인터페이스
	 * @since 1.0.0
	 */
	public NetworkClient getNetworkClient() {
		return networkClient;
	}
	
	/**
	 * 네트워크 클라이언트 인터페이스 설정한다.<br/>
	 * @param networkClient 네트워크 클라이언트 인터페이스
	 * @since 1.0.0
	 */
	public void setNetworkClient(NetworkClient networkClient) {
		this.networkClient = networkClient;
	}
	
	/**
	 * 전문 클래스 프리픽스를 얻는다.<br/>
	 * @return 전문 클래스 프리픽스
	 * @since 1.0.0
	 */
	public String getPrefix() {
		return prefix;
	}
		
	/**
	 * 전문 클래스 프리픽스를 설정한다.(프리픽스 + 전문코드 = 전문클래스 풀네임)<br/>
	 * @param prefix 전문 클래스 프리픽스
	 * @since 1.0.0
	 */
	public void setPrefix(String prefix) {
		this.prefix = prefix;
	}
	
	/**
	 * 송수신 타임아웃을 얻는다.<br/>
	 * @return 송수신 타임아웃(ms)
	 * @since 1.0.0
	 */
	public int getSoTimeout() {
		return soTimeout;
	}
	
	/**
	 * 전문 송신 시간을 설정한다.<br/>
	 * @since 1.0.0
	 */
	public void markStartTime() {
		startTime = System.currentTimeMillis();
	}
	
	/**
	 * 송수신 타임아웃 여부를 얻는다.<br/>
	 * @return 송수신 타임아웃 여부
	 * @since 1.0.0
	 */
	public boolean isSoTimeout() {
		return startTime + soTimeout < System.currentTimeMillis();
	}
		
	/**
	 * 패킷 아이디를 얻는다.<br/>
	 * @return 패킷 아이디
	 * @since 1.0.0
	 */
	public String getPid() {
		return pid;
	}
	
	/**
	 * 패킷 아이디를 설정한다.<br/>
	 * @param pid 패킷 아이디
	 * @since 1.0.0
	 */
	public void setPid(String pid) {
		this.pid = pid;
	}
	
	/**
	 * 폴링 전문 여부를 얻는다.<br/>
	 * @return 폴링 전문 여부
	 * @since 1.0.0
	 */
	public boolean isPolling() {
		return polling;
	}

	@Override
	public boolean equals(Object obj) {
		if (obj instanceof Transaction) {
			return pid.equals(((Transaction)obj).pid);
		}
		return super.equals(obj);
	}
	
	/**
	 * 전문을 바이트 배열로 시리얼라이즈 한다.<br/>
	 * @return 시리얼라이즈 된 전문 바이트 배열
	 * @throws Exception 예외
	 * @since 1.0.0
	 */
	public abstract byte[] getBytes() throws Exception;
	
	/**
	 * 전문 바이트 배열을 설정한다.<br/>
	 * @param bytes 시리얼라이즈 된 전문 바이트 배열
	 * @throws Exception 예외
	 * @since 1.0.0
	 */
	public abstract void setBytes(byte[] bytes) throws Exception;
}
