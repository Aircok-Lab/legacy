package com.baby.aircok.acbaby.common.widget;

import android.app.Dialog;
import android.content.Context;
import android.graphics.Color;
import android.graphics.drawable.ColorDrawable;
import android.os.Bundle;
import android.view.View;
import android.view.ViewGroup;
import android.view.Window;
import android.view.WindowManager;
import android.widget.LinearLayout;
import android.widget.TextView;

import com.baby.aircok.acbaby.R;

import static com.baby.aircok.acbaby.R.id.dialog;

public class CustomDialog extends Dialog {

    private Context mContext;
    private TextView mTitle, mMsg;

    public CustomDialog(Context context) {
        super(context);
        mContext = context;
        setCanceledOnTouchOutside(true);
        requestWindowFeature(Window.FEATURE_NO_TITLE);
        getWindow().setBackgroundDrawable(new ColorDrawable(Color.TRANSPARENT));
        setContentView(R.layout.custom_dialog);

        mTitle = (TextView) findViewById(R.id.dialog_title);
        mMsg = (TextView) findViewById(R.id.dialog_msg);

        findViewById(R.id.dialog_ok).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                dismiss();
            }
        });

        findViewById(R.id.dialog_cancel).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                dismiss();
            }
        });

        findViewById(R.id.dialog_one_ok).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                dismiss();
            }
        });
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        ViewGroup.LayoutParams params = getWindow().getAttributes();
        params.width = WindowManager.LayoutParams.MATCH_PARENT;
        params.height = WindowManager.LayoutParams.WRAP_CONTENT;
        getWindow().setAttributes((android.view.WindowManager.LayoutParams) params);
    }

    public void setTitle(String title){
        mTitle.setText(title);
    }


    public void setMsg(String msg){
        mMsg.setText(msg);
    }

    public void setIcon(int icon){
        if (icon == -1){
            findViewById(R.id.dialog_icon).setVisibility(View.GONE);
        } else {
            findViewById(R.id.dialog_icon).setBackgroundResource(icon);
        }
    }

    public void setBtn(int btn){
        if (btn == -1){
            findViewById(R.id.one_btn_layout).setVisibility(View.VISIBLE);
            findViewById(R.id.two_btn_layout).setVisibility(View.GONE);
        } else {
            findViewById(R.id.one_btn_layout).setVisibility(View.GONE);
            findViewById(R.id.two_btn_layout).setVisibility(View.VISIBLE);
        }
    }

    public void setOk(View.OnClickListener listener){
        findViewById(R.id.dialog_ok).setOnClickListener(listener);
    }

    public void setCancel(View.OnClickListener listener){
        findViewById(R.id.dialog_cancel).setOnClickListener(listener);
    }

    public void setOne(View.OnClickListener listener){
        findViewById(R.id.dialog_one_ok).setOnClickListener(listener);
    }
}