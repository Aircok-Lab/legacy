package com.baby.aircok.acbaby.common;

import android.util.Log;

/**
 * 로그 유틸리티<br/>
 * [변경이력]<br/>
 * 
 * @author neon2231@cruxware.net
 * @version 1.0.0
 * @since 1.0.0
 */
public class LogUtil {

	/**
	 * 로그 태그명<br/>
	 * @since 1.0.0
	 */
	private static final String TAG = Config.sAppName;

	/**
	 * 로그 출력<br/>
	 * @param msg
	 * @since 1.0.0
	 */
	public static void LOGE(String msg) {
		if (!Config.DEBUG) {
			return;
		}
		Log.e(TAG, new Throwable().getStackTrace()[1].getFileName() + "["
				+ new Throwable().getStackTrace()[1].getLineNumber() + "] : "
				+ msg);
	}

	/**
	 * 로그 출력<br/>
	 * @param msg
	 * @since 1.0.0
	 */
	public static void LOGV(String msg) {
		if (!Config.DEBUG) {
			return;
		}
		Log.v(TAG, new Throwable().getStackTrace()[1].getFileName() + "["
				+ new Throwable().getStackTrace()[1].getLineNumber() + "] : "
				+ msg);
	}

	/**
	 * 로그 출력<br/>
	 * @param msg
	 * @since 1.0.0
	 */
	public static void LOGI(String msg) {
		if (!Config.DEBUG) {
			return;
		}
		Log.i(TAG, new Throwable().getStackTrace()[1].getFileName() + "["
				+ new Throwable().getStackTrace()[1].getLineNumber() + "] : " + msg);
	}
}
