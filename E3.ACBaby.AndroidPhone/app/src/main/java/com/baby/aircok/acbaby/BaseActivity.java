package com.baby.aircok.acbaby;

import android.app.AlertDialog;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.IntentFilter;
import android.os.Bundle;
import android.support.annotation.NonNull;
import android.view.View;
import android.view.inputmethod.InputMethodManager;
import android.widget.Button;
import android.widget.ImageButton;
import android.widget.ImageView;
import android.widget.TextView;

import com.baby.aircok.acbaby.common.PermissionManager;
import com.baby.aircok.acbaby.common.widget.CXProgressDialog;

import net.cruxware.android.net.client.NetworkClient;
import net.cruxware.android.net.client.NetworkProcessor;
import net.cruxware.android.net.transaction.Transaction;
import net.cruxware.android.net.transaction.TransactionException;

/**
 * 베이스 액티비티 클래스<br/>
 * 모든 액티비티는 베이스 클래스를 상속받아 생성한다.<br/>
 * [변경이력]<br/>
 * @author neon2231@cruxware.net
 * @version 1.0.0
 * @since 1.0.0
 */
public class BaseActivity extends android.support.v7.app.AppCompatActivity implements NetworkClient {

	private static final String ACTION_FINISH_ALL = "action_kill_process";

	/**
	 * 베이스 브로드캐스트리시브<br/>
	 * @since 1.0.0
	 */
	private BaseReceiver baseReceiver;
	
	/**
	 * 공통 알림 다이얼로그<br/>
	 * @since 1.0.0
	 */
	private CXProgressDialog progressDialog;

	private AlertDialog alertDialog;

	private PermissionManager permissionManager;

	/**
	 * 베이스 브로드캐스트리시브 클래스<br/>
	 * CXBaseActivity를 상속받아 생성한 클래스에 전체콜백이나 특정클래스에 콜백을 받기위한 리시브<br/>
	 * [변경이력]<br/>
	 * @author neon2231@cruxware.net
	 * @version 1.0.0
	 * @since 1.0.0
	 */
	public class BaseReceiver extends BroadcastReceiver {

		@Override
		public void onReceive(Context context, Intent intent) {
			String action = intent.getAction();
			if (ACTION_FINISH_ALL.equals(action)) {
//				if (!(context instanceof MainActivity)) ((Activity)context).finish();
			}
		}
	}
	
	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		permissionManager = new PermissionManager(this);
		getSupportActionBar().hide();
		registeBaseReceiver();
	}

	@Override
	protected void onPause() {
		super.onPause();
		hideKeyPad();
	}

	@Override
	protected void onDestroy() {
		super.onDestroy();
		unRegisteBaseReceiver();
		progressStop();
		dismissDialog();
	}

	@Override
	public final void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
		if (requestCode == PermissionManager.REQUEST_CODE_ACCESS_FINE_LOCATION) {
			permissionManager.onRequestPermissionsResult(requestCode, permissions, grantResults);
		}
		else {
			super.onRequestPermissionsResult(requestCode, permissions, grantResults);
		}
	}
	
	/**
	 * BaseReceiver를 등록한다.<br/>
	 * @since 1.0.0
	 */
	private void registeBaseReceiver() {
		IntentFilter filter;
		if (baseReceiver == null)	baseReceiver = new BaseReceiver();
		filter = new IntentFilter();
		filter.addAction(ACTION_FINISH_ALL);
    	registerReceiver(baseReceiver, filter);
	}
	
	/**
	 * BaseReceiver의 등록을 해제한다.<br/>
	 * @since 1.0.0
	 */
	private void unRegisteBaseReceiver(){
		if(baseReceiver != null) unregisterReceiver(baseReceiver);
	}
	
	/**
	 * 키보드를 실행한다.<br/>
	 * @since 1.0.0
	 */
	public void showKeyPad() {
		InputMethodManager imm = (InputMethodManager)getSystemService(INPUT_METHOD_SERVICE);
        imm.showSoftInput(getWindow().getDecorView(), InputMethodManager.SHOW_FORCED);
	}
	
	/**
	 * 키보드를 종료한다.<br/>
	 * @since 1.0.0
	 */
	public void hideKeyPad(){
		InputMethodManager imm = (InputMethodManager) getSystemService(INPUT_METHOD_SERVICE);
		imm.hideSoftInputFromWindow(getWindow().getDecorView().getWindowToken(), 0);
	}

	/**
	 * 공통 프로그레스바를 실행한다.<br/>
	 * @since 1.0.0
	 */
	public void progressStart() {
		if ( progressDialog != null ) {
			progressDialog.cancel();
			progressDialog = null;
		}
		progressDialog = new CXProgressDialog(this);
		progressDialog.setMessage(getString(R.string.net_progress_message));
		progressDialog.show();
	}

	/**
	 * 공통 프로그래스바를 해제한다.<br/>
	 * @since 1.0.0
	 */
	public void progressStop() {
		if ( progressDialog != null ) {
			progressDialog.cancel();
			progressDialog = null;
		}
	}
	public void showSingleDialog(String title, String message, int icon,
										final String positive, String negative, final DialogInterface.OnClickListener listener) {
		dismissDialog();
		alertDialog = createAlert(title, message, icon, positive,negative, listener);
		alertDialog.show();
	}

	public void dismissDialog() {
		if (alertDialog != null) {
			alertDialog.cancel();
			alertDialog.dismiss();
			alertDialog = null;
		}
	}
	public void showAlert(String title, String message, int icon,
								 final String positive, String negative, final DialogInterface.OnClickListener listener) {
		AlertDialog dialog = createAlert(title, message, icon, positive,negative, listener);
		dialog.show();
	}

	private AlertDialog createAlert(String title, String message, int icon,
									final String positive, String negative, final DialogInterface.OnClickListener listener) {
		final AlertDialog dialog = new AlertDialog.Builder(this).create();
		View view = View.inflate(this, R.layout.view_dialog, null);
		if (title != null) {
			TextView tv_dialog_title = (TextView) view.findViewById(R.id.tv_dialog_title);
			tv_dialog_title.setText(title);
			tv_dialog_title.setVisibility(View.VISIBLE);
			view.findViewById(R.id.view_dialog_title_line).setVisibility(View.VISIBLE);
		}

		if (message != null) {
			TextView tv_dialog_contents = (TextView) view.findViewById(R.id.tv_dialog_contents);
			tv_dialog_contents.setText(message);
			tv_dialog_contents.setVisibility(View.VISIBLE);
		}

		if (icon != -1) {
			ImageView iv_dialog_icon = (ImageView) view.findViewById(R.id.iv_dialog_icon);
			iv_dialog_icon.setImageResource(icon);
			iv_dialog_icon.setVisibility(View.VISIBLE);
		}

		Button btn_dialog_right = (Button) view.findViewById(R.id.btn_dialog_right);
		if (positive != null) {
			view.findViewById(R.id.layout_btn).setVisibility(View.VISIBLE);
			btn_dialog_right.setText(positive);
			btn_dialog_right.setVisibility(View.VISIBLE);
			btn_dialog_right.setOnClickListener(new View.OnClickListener() {
				@Override
				public void onClick(View v) {
					dialog.dismiss();
					if (listener != null) {
						listener.onClick(dialog, 0);
					}
				}
			});
		}

		Button btn_dialog_left = (Button) view.findViewById(R.id.btn_dialog_left);
		if (negative != null) {
			view.findViewById(R.id.layout_btn).setVisibility(View.VISIBLE);
			btn_dialog_left.setText(negative);
			btn_dialog_left.setVisibility(View.VISIBLE);
			btn_dialog_left.setOnClickListener(new View.OnClickListener() {
				@Override
				public void onClick(View v) {
					dialog.dismiss();
					if (listener != null) {
						listener.onClick(dialog, 1);
					}
				}
			});
		}
		dialog.setView(view);
		return dialog;
	}
	
	/**
	 * 실행중인 전체 액티비티를 종료한다.<br/>
	 * @since 1.0.0
	 */
	public void finishAllActivity(){		
		Intent intent = new Intent();
		intent.setAction(ACTION_FINISH_ALL);
		sendBroadcast(intent);
	}

	public PermissionManager getPermissionManager() {
		return permissionManager;
	}

	public void setHeader(int left, int titleId, int title, int right) {
		View header = findViewById(R.id.layout_header);
		if (header != null) {
			if (left != -1) {
				ImageButton btn_header_left_icon = (ImageButton) header.findViewById(R.id.btn_header_left_icon);
				btn_header_left_icon.setVisibility(View.VISIBLE);
				btn_header_left_icon.setImageResource(left);
				btn_header_left_icon.setOnClickListener(new View.OnClickListener() {
					@Override
					public void onClick(View v) {
						onClickLeftMenu(v);
					}
				});
			}

			if (titleId != -1) {
				ImageView iv_header_title = (ImageView) header.findViewById(R.id.iv_header_title);
				iv_header_title.setVisibility(View.VISIBLE);
				iv_header_title.setImageResource(titleId);
			}

			if (title != -1) {
				TextView tv_header_title = (TextView) header.findViewById(R.id.tv_header_title);
				tv_header_title.setVisibility(View.VISIBLE);
				tv_header_title.setText(title);
			}

			if (right != -1) {
				ImageButton btn_header_right_icon = (ImageButton) header.findViewById(R.id.btn_header_right_icon);
				btn_header_right_icon.setVisibility(View.VISIBLE);
				btn_header_right_icon.setImageResource(right);
				btn_header_right_icon.setOnClickListener(new View.OnClickListener() {
					@Override
					public void onClick(View v) {
						onClickRightMenu(v);
					}
				});
			}
		}
	}

	public void onClickLeftMenu(View view){}
	public void onClickRightMenu(View view){}
	
//	/**
//	 * 비즈니스 로직 서버에 전문을 전송한다.<br/>
//	 * @param tr 크룩스 HTTP 전문 객체
//	 * @since 1.0.0
//	 */
//	protected void sendToBLServer(C2HTTPTransaction tr) {
//		tr.setNetworkClient(this);
//		Application application = getApplication();
//		if (application instanceof C2Application) {
//			((C2Application)application).sendToBLServer(tr);
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
		runOnUiThread(new Runnable(){
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
		runOnUiThread(new Runnable(){
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
		runOnUiThread(new Runnable(){
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
		runOnUiThread(new Runnable(){
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
