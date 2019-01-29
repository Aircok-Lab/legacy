package com.baby.aircok.acbaby.menu;

import android.content.DialogInterface;
import android.os.Bundle;
import android.view.View;
import android.widget.ImageView;
import android.widget.TextView;

import com.baby.aircok.acbaby.BaseActivity;
import com.baby.aircok.acbaby.R;
import com.baby.aircok.acbaby.common.C2Preference;
import com.baby.aircok.acbaby.common.Config;
import com.baby.aircok.acbaby.common.LoginInfo;
import com.baby.aircok.acbaby.common.widget.CXCalendarView;
import com.baby.aircok.acbaby.common.widget.CustomDialog;
import com.baby.aircok.acbaby.common.widget.HealthHistoryDialog;
import com.baby.aircok.acbaby.net.client.C2HTTPProcessor;
import com.baby.aircok.acbaby.net.transaction.ACTransaction;

import com.baby.aircok.acbaby.common.LogUtil;
import net.cruxware.android.net.client.NetworkProcessor;
import net.cruxware.android.net.transaction.Transaction;
import net.cruxware.android.net.transaction.TransactionException;

import org.json.JSONArray;
import org.json.JSONObject;

import java.util.Calendar;
import java.util.HashMap;

import static com.baby.aircok.acbaby.R.id.calendar;

public class HealthHistoryActivity extends BaseActivity implements DialogInterface.OnDismissListener {

    private CXCalendarView mCalendarView;
    private Adapter_ mAdapter;
    private Calendar mCalendar;
    private HashMap<String, JSONObject> mDataMap = new HashMap<>();
    private HashMap<String, JSONObject> mRecordsMap = new HashMap<>();
    private HealthHistoryDialog mDialog;

    private class Adapter_ extends CXCalendarView.CalendarAdapter {

        private String[] weeks = {"Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"};
        private int[] issue_resource = {R.drawable.ic_calendar_i, R.drawable.ic_calendar_mom, R.drawable.ic_calendar_imom};

        @Override
        public int getWeekViewId() {
            return R.layout.view_calendar_week;
        }

        @Override
        public void setWeekView(View view, int week) {
            TextView tv_week = (TextView) view.findViewById(R.id.tv_week);
            tv_week.setText(weeks[week]);
        }

        @Override
        public int getDayViewId() {
            return R.layout.view_calendar_day;
        }

        @Override
        public void setDayView(View view, int position, Calendar calendar) {
            int year = calendar.get(Calendar.YEAR);
            int month = calendar.get(Calendar.MONTH);
            int day = calendar.get(Calendar.DATE);

            String record = String.format("%d%02d%02d", year, month + 1, day);
            boolean isRecord = mRecordsMap.containsKey(record);
            boolean isCurrent = month == mCalendar.get(Calendar.MONTH);

            ImageView iv_issue = (ImageView) view.findViewById(R.id.iv_issue);
            TextView tv_day = (TextView) view.findViewById(R.id.tv_day);

            tv_day.setText(String.format("%d", day));
            tv_day.setTextColor(isCurrent ?  0xff333333: 0x80333333);

            JSONObject dateDate = mRecordsMap.get(record);
            iv_issue.setImageResource(issue_resource[0]);
            if (dateDate != null) {
                if ("아기".equals(dateDate.optString("target"))) {
                    iv_issue.setImageResource(issue_resource[0]);
                } else {
                    iv_issue.setImageResource(issue_resource[1]);
                }
            }
            iv_issue.setVisibility(isRecord ? View.VISIBLE : View.INVISIBLE);
        }
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_health_history);

        setHeader(R.drawable.btn_nav_back_selector, -1, R.string.setting_cell6, -1);

        mCalendar = Calendar.getInstance();
        mAdapter = new Adapter_();
        mCalendarView = (CXCalendarView) findViewById(calendar);
        mCalendarView.setCalendarAdapter(mAdapter);

        findViewById(R.id.btn_calendar_pre).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                mCalendar.add(Calendar.MONTH, -1);
//                requestDayofmonth("fh20@nate.com", getMeasureMonth());
                requestDayofmonth(C2Preference.getLoginID(HealthHistoryActivity.this), getMeasureMonth());
            }
        });
        findViewById(R.id.btn_calendar_next).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                mCalendar.add(Calendar.MONTH, 1);
//                requestDayofmonth("fh20@nate.com", getMeasureMonth());
                requestDayofmonth(C2Preference.getLoginID(HealthHistoryActivity.this), getMeasureMonth());
            }
        });

        mCalendarView.setOnDayClickListener(new CXCalendarView.OnDayClickListener() {
            @Override
            public void onDayClick(View view, int position, Calendar calendar) {
                int year = calendar.get(Calendar.YEAR);
                int month = calendar.get(Calendar.MONTH) + 1;//캘린더뷰 month +1
                int day = calendar.get(Calendar.DATE);
                LogUtil.LOGE(String.format("postion : %d, year : %d, month : %d, day : %d", position, year, month, day));

                String insert_dt = String.format("%d%02d%02d", year, month, day);
                String title = String.format("%d.%02d.%02d", year, month, day);

                mDialog = new HealthHistoryDialog(HealthHistoryActivity.this);
                mDialog.setTitle(title);
                mDialog.setOnDismissListener(HealthHistoryActivity.this);
                JSONObject dateDate = mRecordsMap.get(insert_dt);
                if (dateDate != null) {
                    LogUtil.LOGE("date: " + dateDate);
                    String target = dateDate.optString("target");
                    String disease = dateDate.optString("disease");
                    String department = dateDate.optString("department");
                    mDialog.setDate(target, disease, department);
                }
                mDialog.show();
            }
        });


        //TODO :
//        requestDayofmonth("fh20@nate.com", getMeasureMonth());
        reloadCalender();
        requestDayofmonth(C2Preference.getLoginID(HealthHistoryActivity.this), getMeasureMonth());

    }

    @Override
    public void onDismiss(DialogInterface dialog) {
        HashMap<String, String> medical = mDialog.getData();
        String insert_date = medical.get("insert_date");
        String target = medical.get("target");
        String disease = medical.get("disease");
        String department = medical.get("department");
        String delete_flag = medical.get("delete_flag");
        requestMedical(insert_date, target, disease, department, delete_flag);
        LogUtil.LOGE("medical data: " + medical);
    }

    private void reloadCalender() {
        mCalendarView.setCalendar(mCalendar);

        int year = mCalendar.get(Calendar.YEAR);
        int month = mCalendar.get(Calendar.MONTH) + 1;

        TextView tv_calendar_date = (TextView) findViewById(R.id.tv_calendar_date);
        tv_calendar_date.setText(String.format("%d.%02d", year, month));
    }

    private String getMeasureMonth() {
        int year = mCalendar.get(Calendar.YEAR);
        int month = mCalendar.get(Calendar.MONTH) + 1;
        return String.format("%d%02d", year, month);
    }

    @Override
    public void onClickLeftMenu(View view) {
        finish();
    }

    @Override
    protected void onExceptionThrownOnUiThread(NetworkProcessor networkProcessor, TransactionException e) {
        super.onExceptionThrownOnUiThread(networkProcessor, e);
    }

    @Override
    protected void onTransactionReceivedOnUiThread(NetworkProcessor networkProcessor, Transaction transaction) {
        super.onTransactionReceivedOnUiThread(networkProcessor, transaction);
        if (transaction instanceof ACTransaction) {
            ACTransaction tr = (ACTransaction) transaction;
            if (tr.getCode().equals("dayofmonth")) {
                responseDayofmonth(tr);
            } else if (tr.getCode().equals("medical")) {
                responseMedical(tr);
            }
        }
    }

    private void requestDayofmonth(String email, String measure_month) {
        ACTransaction tr = new ACTransaction(this, "dayofmonth");
        tr.setConnectionURL(Config.SERVER_URL);
        tr.setRequest("user_id", LoginInfo.getInstance().user_id);
        tr.setRequest("email", email);
        tr.setRequest("measure_month", measure_month);
        C2HTTPProcessor.getInstance().sendToBLServer(tr);
    }

    private void responseDayofmonth(ACTransaction tr) {
        String result = "";
        JSONObject respone = tr.getResponse();
        result = respone.optString("result");

        if ("0".equals(result) || "1".equals(result)) {
            mDataMap.clear();
            mRecordsMap.clear();

            JSONArray data = respone.optJSONArray("data");
            if (data != null) {
                for (int i = 0 ; i < data.length() ; i++) {
                    JSONObject object = data.optJSONObject(i);
                    String day = object.optString("day");// 27, 30
                    mDataMap.put(day, object);
                }
            }

            JSONArray medical_records = respone.optJSONArray("medical_records");
            if (medical_records != null) {
                for (int i = 0 ; i < medical_records.length() ; i++) {
                    JSONObject object = medical_records.optJSONObject(i);

                    if (!"아기".equals(object.optString("target")) && !"엄마".equals(object.optString("target")))
                        continue;

                    String insert_dt = object.optString("insert_dt");
                    if (insert_dt.length() < 8 ) {
                        String yymm = insert_dt.substring(0,6);
                        String day = insert_dt.substring(6);
                        day = "0" + day;
                        insert_dt = yymm + day;
                    }

                    mRecordsMap.put(insert_dt, object);// 20170528
                }
            }

            reloadCalender();
        }
    }

    private void requestMedical(String insert_date, String target, String disease, String department, String delete_flag) {
        ACTransaction tr = new ACTransaction(this, "medical");
        tr.setConnectionURL(Config.SERVER_URL);
        tr.setRequest("user_id", LoginInfo.getInstance().user_id);
//        tr.setRequest("email", "fh20@nate.com");
        tr.setRequest("email", C2Preference.getLoginID(HealthHistoryActivity.this));
        tr.setRequest("aircok_type", "baby");
        tr.setRequest("insert_dt", insert_date);
        tr.setRequest("target", target);
        tr.setRequest("disease", disease);
        tr.setRequest("department", department);
        tr.setRequest("delete_flag", delete_flag);
        C2HTTPProcessor.getInstance().sendToBLServer(tr);
    }

    private void responseMedical(ACTransaction tr) {
        JSONObject respone = tr.getResponse();
        LogUtil.LOGE("responseMedical tr : " + respone);
        if ("1".equals(respone.opt("result"))) {
            requestDayofmonth(C2Preference.getLoginID(HealthHistoryActivity.this), getMeasureMonth());
        } else if  ("-1".equals(respone.opt("result"))) {
            CustomDialog mDialog = new CustomDialog(HealthHistoryActivity.this);
            mDialog.setTitle(getString(R.string.dialog_title_0));
            mDialog.setIcon(-1);
            mDialog.setBtn(-1);
            mDialog.setMsg(getString(R.string.dialog_msg_8));
            mDialog.show();
        }
    }
}
