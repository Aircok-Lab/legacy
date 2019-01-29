package com.family.aircok.acfamily.common.widget;

import android.app.Dialog;
import android.content.Context;
import android.graphics.Color;
import android.graphics.drawable.ColorDrawable;
import android.view.View;
import android.view.WindowManager.LayoutParams;
import android.widget.TextView;

import com.family.aircok.acfamily.R;


/**
 * 프로그래스바 다이얼로그 클래스<br/>
 * [변경이력]<br/>
 * @author neon2231@cruxware.net
 * @version 1.0.0
 * @since 1.0.0
 */
public class CXProgressDialog extends Dialog {
	
	/**
	 * 생성자
	 * @param context
	 * @since 1.0.0
	 */
	public CXProgressDialog(Context context) {
		super(context, R.style.AppTheme);
		getWindow().setBackgroundDrawable(new ColorDrawable(Color.argb(70, 0x00, 0x00, 0x00)));
		View view = getLayoutInflater().inflate(R.layout.cx_control_progress_dialog, null);
		setContentView(view, new LayoutParams(LayoutParams.MATCH_PARENT, LayoutParams.MATCH_PARENT));
		setCancelable(false);
	}
	
	/**
	 * 메시지를 설정한다.<br/>
	 * @param message 메시지
	 * @since 1.0.0
	 */
	public void setMessage(String message){
		TextView textView = (TextView) findViewById(R.id.dialog_text);
		textView.setText(message);
	}
}

	    
