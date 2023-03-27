package com.family.aircok.acfamily;

import android.content.DialogInterface;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.view.View;

import net.cruxware.android.net.client.NetworkClient;
import net.cruxware.android.net.client.NetworkProcessor;
import net.cruxware.android.net.transaction.Transaction;
import net.cruxware.android.net.transaction.TransactionException;

/**
 * 베이스 플래그먼트 클래스<br/>
 * 모든플래그먼트는 베이스 플래그먼트를 상속받아 생성한다.<br/>
 * [변경이력]<br/>
 * @author neon2231@cruxware.net
 * @version 1.0.0
 * @since 1.0.0
 */
public class BaseFragment extends Fragment implements NetworkClient {

	/**
	 * 베이스 액티비티<br/>
	 * @since 1.0.0
	 */
	protected BaseActivity baseActivity;

	protected View baseView;
	
	@Override
	public void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		this.baseActivity = (BaseActivity) getActivity();
	}
	
	@Override
	public void onDestroy() {
		super.onDestroy();
		progressStop();
		dismissDialog();
	}
	
	/**
	 * 공통 프로그레스바를 실행한다.<br/>
	 * @since 1.0.0
	 */
	public void progressStart() {
		baseActivity.progressStart();
	}
	
	/**
	 * 공통 프로그래스바를 해제한다.<br/>
	 * @since 1.0.0
	 */
	public void progressStop() {
		baseActivity.progressStop();
	}

	public void showSingleDialog(String title, String message, int icon,
								 final String positive, String negative, final DialogInterface.OnClickListener listener) {
		dismissDialog();
		baseActivity.showSingleDialog(title, message, icon, positive, negative, listener);
	}

	public void dismissDialog() {
		baseActivity.dismissDialog();
	}

	public void showAlert(String title, String message, int icon, final String positive, String negative, final DialogInterface.OnClickListener listener) {
		baseActivity.showAlert(title, message, icon, positive, negative, listener);
	}
//	/**
//	 * 비즈니스 로직 서버에 전문을 전송한다.<br/>
//	 * @param tr 크룩스 HTTP 전문 객체
//	 * @since 1.0.0
//	 */
//	protected void sendToBLServer(CruxHTTPTransaction tr) {
//		tr.setNetworkClient(this);
//		Application application = baseActivity.getApplication();
//		if (application instanceof CXBaseApplication) {
//			((CXBaseApplication)application).sendToBLServer(tr);
//		}
//	}
	
	@Override
	public void onConnected(NetworkProcessor networkProcessor) {
		// 아무것도 처리할 필요 없음
	}

	@Override
	public void onDisconnected(NetworkProcessor networkProcessor) {
		// 아무것도 처리할 필요 없음
	}

	@Override
	public final void onStarted(final NetworkProcessor networkProcessor) {
		onStartedOnWorkerThread(networkProcessor);
		baseActivity.runOnUiThread(new Runnable(){
			@Override
			public void run() {
				onStartedOnUiThread(networkProcessor);				
			}
		});
	}
	
	/**
	 * 네트워킹 시작 이벤트 함수(워커 쓰레드)<br/>
	 * @param networkProcessor 이벤트가 발생한 네트워크 프로세서
	 * @since 1.0.0
	 */
	protected void onStartedOnWorkerThread(NetworkProcessor networkProcessor) {}

	/**
	 * 네트워킹 시작 이벤트 함수(UI 쓰레드)<br/>
	 * @param networkProcessor 이벤트가 발생한 네트워크 프로세서
	 * @since 1.0.0
	 */
	protected void onStartedOnUiThread(NetworkProcessor networkProcessor) {}
	
	@Override
	public final void onEnded(final NetworkProcessor networkProcessor) {
		onEndedOnWorkerThread(networkProcessor);
		baseActivity.runOnUiThread(new Runnable(){
			@Override
			public void run() {
				onEndedOnUiThread(networkProcessor);				
			}
		});
	}

	/**
	 * 네트워킹 종료 이벤트 함수(워커 쓰레드)<br/>
	 * @param networkProcessor 이벤트가 발생한 네트워크 프로세서
	 * @since 1.0.0
	 */
	protected void onEndedOnWorkerThread(NetworkProcessor networkProcessor) {}

	/**
	 * 네트워킹 종료 이벤트 함수(UI 쓰레드)<br/>
	 * @param networkProcessor 이벤트가 발생한 네트워크 프로세서
	 * @since 1.0.0
	 */
	protected void onEndedOnUiThread(NetworkProcessor networkProcessor) {}
	
	@Override
	public final void onExceptionThrown(final NetworkProcessor networkProcessor, final TransactionException e) {
		onExceptionThrownOnWorkerThread(networkProcessor, e);
		baseActivity.runOnUiThread(new Runnable(){
			@Override
			public void run() {
				onExceptionThrownOnUiThread(networkProcessor, e);				
			}
		});
	}

	/**
	 * 예외(오류)발생 이벤트 함수(워커 쓰레드)<br/>
	 * @param networkProcessor 이벤트가 발생한 네트워크 프로세서
	 * @param e 예외(오류)
	 * @since 1.0.0
	 */
	protected void onExceptionThrownOnWorkerThread(NetworkProcessor networkProcessor, TransactionException e) {}
	
	/**
	 * 예외(오류)발생 이벤트 함수(UI 쓰레드)<br/>
	 * @param networkProcessor 이벤트가 발생한 네트워크 프로세서
	 * @param e 예외(오류)
	 * @since 1.0.0
	 */
	protected void onExceptionThrownOnUiThread(NetworkProcessor networkProcessor, TransactionException e) {
		showSingleDialog(getString(R.string.network_alert_title_error), getString(R.string.network_alert_message_error), -1, getString(R.string.common_ok), null, null);
	}
	
	@Override
	public final void onTransactionReceived(final NetworkProcessor networkProcessor, final Transaction transaction) {
		onTransactionReceivedOnWorkerThread(networkProcessor, transaction);
		baseActivity.runOnUiThread(new Runnable(){
			@Override
			public void run() {
				onTransactionReceivedOnUiThread(networkProcessor, transaction);				
			}
		});
	}
	
	/**
	 * 전문 수신 이벤트 함수(워커 쓰레드)<br/>
	 * @param networkProcessor 이벤트가 발생한 네트워크 프로세서
	 * @param transaction 수신된 전문 객체
	 * @since 1.0.0
	 */
	protected void onTransactionReceivedOnWorkerThread(NetworkProcessor networkProcessor, Transaction transaction) {}
	
	/**
	 * 전문 수신 이벤트 함수(UI 쓰레드)<br/>
	 * @param networkProcessor 이벤트가 발생한 네트워크 프로세서
	 * @param transaction 수신된 전문 객체
	 * @since 1.0.0
	 */
	protected void onTransactionReceivedOnUiThread(NetworkProcessor networkProcessor, Transaction transaction) {}
}
