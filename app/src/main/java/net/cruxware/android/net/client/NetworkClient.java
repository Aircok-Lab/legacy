package net.cruxware.android.net.client;


import net.cruxware.android.net.transaction.Transaction;
import net.cruxware.android.net.transaction.TransactionException;

/**
 * 네트워크 클라이언트 인터페이스 <br/>
 * 네트워크 프로세서로 통신을 객체는 이 인터페이스를 상속 받아야 한다.<br/>
 * [변경이력]<br/>
 * 1.0.0: 최초생성<br/>
 * @author fmthead@cruxware.net
 * @version 1.0.1
 * @since 1.0.0
 */
public interface NetworkClient {

	/**
	 * 접속 이벤트 함수<br/>
	 * @param networkProcessor 이벤트가 발생한 네트워크 프로세서
	 * @since 1.0.0
	 */
	void onConnected(NetworkProcessor networkProcessor);
	
	/**
	 * 접속 끊김 이벤트 함수<br/>
	 * @param networkProcessor 이벤트가 발생한 네트워크 프로세서
	 * @since 1.0.0
	 */
	void onDisconnected(NetworkProcessor networkProcessor);
	
	/**
	 * 네트워킹 시작 이벤트 함수<br/>
	 * @param networkProcessor 이벤트가 발생한 네트워크 프로세서
	 * @since 1.0.0
	 */
	void onStarted(NetworkProcessor networkProcessor);
	
	/**
	 * 네트워킹 종료 이벤트 함수<br/>
	 * @param networkProcessor 이벤트가 발생한 네트워크 프로세서
	 * @since 1.0.0
	 */
	void onEnded(NetworkProcessor networkProcessor);

	/**
	 * 예외(오류)발생 이벤트 함수<br/>
	 * @param networkProcessor 이벤트가 발생한 네트워크 프로세서
	 * @param e 예외(오류)
	 * @since 1.0.0
	 */
	void onExceptionThrown(NetworkProcessor networkProcessor, TransactionException e);
	
	/**
	 * 전문 수신 이벤트 함수<br/>
	 * @param networkProcessor 이벤트가 발생한 네트워크 프로세서
	 * @param transaction 수신된 전문 객체
	 * @since 1.0.0
	 */
	void onTransactionReceived(NetworkProcessor networkProcessor, Transaction transaction);
}
