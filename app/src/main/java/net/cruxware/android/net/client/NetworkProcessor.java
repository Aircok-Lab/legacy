package net.cruxware.android.net.client;

import net.cruxware.android.net.transaction.Transaction;

/**
 * 표준 프로세서 클래스 <br/>
 * 모든 네트워크 프로세서는 해당 클래스를 상속 받아야 한다.<br/>
 * [변경이력]<br/>
 * 1.0.0: 최초생성<br/>
 * @author fmthead@cruxware.net
 * @version 1.0.1
 * @since 1.0.0
 */
public abstract class NetworkProcessor {

	/**
	 * 전문을 전송한다.
	 * @param transaction 전문 객체
	 * @since 1.0.0
	 */
	public abstract void send(Transaction transaction);
	
	/**
	 * 수신된 데이터로 전문을 생성한다.
	 * @param sent 전송한 전문 객체
	 * @param bytes 수신된 데이터
	 * @return 수신된 전문 객체
	 * @throws Exception 예외
	 * @since 1.0.0
	 */
	public Transaction createTransaction(Transaction sent, byte[] bytes) throws Exception {
		Class<? extends Transaction> clazz = Class.forName(sent.getPrefix() + getTransactionCode(sent, bytes)).asSubclass(Transaction.class);
		Transaction transaction = clazz.newInstance();
		transaction.setBytes(bytes);
		return transaction;
	}
	
	/**
	 * 프로세스를 셧다운 한다.<br/>
	 * @since 1.0.0
	 */
	public void shutdown() {
	}
	
	/**
	 * 전문 코드를 얻는다.
	 * @param sent 전송한 전문 객체
	 * @param bytes 수신된 데이터
	 * @return 전문코드
	 * @throws Exception 예외
	 */
	public abstract String getTransactionCode(Transaction sent, byte[] bytes) throws Exception;
}
