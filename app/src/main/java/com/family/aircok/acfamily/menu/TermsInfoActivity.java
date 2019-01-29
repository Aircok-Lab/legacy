package com.family.aircok.acfamily.menu;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.ImageView;
import android.widget.TextView;

import com.family.aircok.acfamily.BaseActivity;
import com.family.aircok.acfamily.R;
import com.family.aircok.acfamily.common.widget.CustomDialog;

/**
 * Created by ssong on 2017. 4. 24..
 */

public class TermsInfoActivity extends BaseActivity {

    private static String doSignUp = "Sign_Up";

    private String mShow;
    private ImageView mCheck;
    private boolean isCheck = false;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_termsinfo);

        setNewHeader(R.drawable.btn_nav_back_n, -1, R.string.menu_title5, false, -1);

        mCheck = (ImageView) findViewById(R.id.btn_check);
        mShow = getIntent().getStringExtra(doSignUp);

        if (mShow != null && mShow.equals("sign")) {
            findViewById(R.id.signup_layout).setVisibility(View.VISIBLE);
        } else {
            findViewById(R.id.signup_layout).setVisibility(View.GONE);
        }


        findViewById(R.id.btn_agree).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if (isCheck) {
                    setResult(RESULT_OK);
                    finish();
                } else {
                    CustomDialog mDialog = new CustomDialog(TermsInfoActivity.this);
                    mDialog.setTitle(getString(R.string.dialog_title_0));
                    mDialog.setIcon(-1);
                    mDialog.setBtn(-1);
                    mDialog.setMsg(getString(R.string.dialog_msg_29));
                    mDialog.show();
                }
            }
        });

        mCheck.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if (!isCheck){
                    mCheck.setBackground(getResources().getDrawable(R.drawable.btn_check_p));
                    isCheck = true;
                } else {
                    mCheck.setBackground(getResources().getDrawable(R.drawable.btn_check_n));
                    isCheck = false;
                }
            }
        });
    }


    @Override
    public void onClickLeftMenu(View view) {
        finish();
    }
}
