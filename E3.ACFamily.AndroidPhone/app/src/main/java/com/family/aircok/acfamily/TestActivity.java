package com.family.aircok.acfamily;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;

import com.family.aircok.acfamily.common.AES256Cipher;
import com.family.aircok.acfamily.common.Util;
import com.family.aircok.acfamily.common.widget.CXSeekBar;
import com.family.aircok.acfamily.common.widget.CircleChartView;
import com.family.aircok.acfamily.common.widget.CustomDialog;
import com.family.aircok.acfamily.common.widget.MainLineChartView;
import com.family.aircok.acfamily.login.LoginActivity;
import com.family.aircok.acfamily.login.PasswordActivity;
import com.family.aircok.acfamily.login.SignUpCompleteActivity;
import com.family.aircok.acfamily.login.SocialSignUpCompleteActivity;
import com.family.aircok.acfamily.main.MainLocationSearchActivity;
import com.family.aircok.acfamily.net.client.C2HTTPProcessor;
import com.family.aircok.acfamily.net.transaction.ACTransaction;
import com.family.aircok.acfamily.test.CalendarActivity;

public class TestActivity extends BaseActivity {

    private static String url = "http://211.253.11.50:3000/";

    private CircleChartView mChart;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_test);

        mChart = (CircleChartView) findViewById(R.id.circle_chart);
        mChart.setProgress(0, 25, getResources().getColor(R.color.circle_chart_0));
        mChart.invalidate();

        CircleChartView mChart1 = (CircleChartView) findViewById(R.id.circle_chart2);
        mChart1.setProgress(0, 50, getResources().getColor(R.color.circle_chart_0));
        mChart1.invalidate();


        CircleChartView mChart2 = (CircleChartView) findViewById(R.id.circle_chart3);
        mChart2.setProgress(0, 75, getResources().getColor(R.color.circle_chart_0));
        mChart2.invalidate();


        CXSeekBar seekbar = (CXSeekBar) findViewById(R.id.seekbar);
//        seekbar.setProgress(1);


        TestCircle mTest = (TestCircle) findViewById(R.id.test_circle);
        mTest.invalidate();

        findViewById(R.id.MainLocationSearch).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent i = new Intent(TestActivity.this, MainLocationSearchActivity.class);
                startActivity(i);
            }
        });


        findViewById(R.id.btn_acounnt).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                startActivity(new Intent(TestActivity.this, LoginActivity.class));
            }
        });

        findViewById(R.id.btn_password).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                startActivity(new Intent(TestActivity.this, PasswordActivity.class));

            }
        });

        findViewById(R.id.btn_signup).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                startActivity(new Intent(TestActivity.this, SignUpCompleteActivity.class));
            }
        });

        findViewById(R.id.btn_dialog).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                CustomDialog mDialog = new CustomDialog(TestActivity.this);
                mDialog.show();
            }
        });

        findViewById(R.id.btn_dialog2).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                CustomDialog mDialog = new CustomDialog(TestActivity.this);
                mDialog.setTitle("로그아웃");
                mDialog.setIcon(R.drawable.icon_logout);
                mDialog.setMsg("로그아웃 하시겠습니까?");
                mDialog.show();
            }
        });

        findViewById(R.id.btn_sinupcomplete).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                startActivity(new Intent(TestActivity.this, SocialSignUpCompleteActivity.class));
            }
        });

        findViewById(R.id.btn_networktest).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                ACTransaction tr = new ACTransaction(TestActivity.this, "monthofyear");
                tr.setConnectionURL(url);
                tr.setRequest("email", "fh20@nate.com");
                tr.setRequest("measure_year", "2017");
                C2HTTPProcessor.getInstance().sendToBLServer(tr);
//                LogUtil.LOGE(Util.getAndroidID(TestActivity.this));
//                LogUtil.LOGE(Util.getVersion(TestActivity.this));
//                LogUtil.LOGE(Util.getAndroidVersion());
//                LogUtil.LOGE(Util.getPhoneName());

//                String string = "2017-06-01T00:20:42.365Z";
//                String[] date = string.split("T|Z");
//                for (int i = 0 ; i < date.length ; i++)
//                    LogUtil.LOGE("date["+i+"] : " + date[i]);
//
//                String[] yymm = date[0].split("-");
//                for (int i = 0 ; i < yymm.length ; i++)
//                    LogUtil.LOGE("yymm["+i+"] : " + yymm[i]);
//
//                String[] time = date[1].split(":");
//                for (int i = 0 ; i < time.length ; i++)
//                    LogUtil.LOGE("time["+i+"] : " + time[i]);

            }
        });

        findViewById(R.id.btn_calendar).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                startActivity(new Intent(TestActivity.this, CalendarActivity.class));
            }
        });
    }
}
