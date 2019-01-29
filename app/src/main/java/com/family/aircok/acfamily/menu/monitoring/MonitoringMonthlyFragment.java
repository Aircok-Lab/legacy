package com.family.aircok.acfamily.menu.monitoring;

import android.content.DialogInterface;
import android.os.Bundle;
import android.support.annotation.Nullable;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;

import com.family.aircok.acfamily.BaseFragment;
import com.family.aircok.acfamily.R;
import com.family.aircok.acfamily.common.C2Preference;
import com.family.aircok.acfamily.common.C2Util;
import com.family.aircok.acfamily.common.Config;
import com.family.aircok.acfamily.common.LogUtil;
import com.family.aircok.acfamily.common.LoginInfo;
import com.family.aircok.acfamily.common.widget.CXCalendarView;
import com.family.aircok.acfamily.common.widget.CustomDialog;
import com.family.aircok.acfamily.common.widget.HealthHistoryDialog;
import com.family.aircok.acfamily.net.client.C2HTTPProcessor;
import com.family.aircok.acfamily.net.transaction.ACTransaction;

import net.cruxware.android.net.client.NetworkProcessor;
import net.cruxware.android.net.transaction.Transaction;
import net.cruxware.android.net.transaction.TransactionException;

import org.json.JSONArray;
import org.json.JSONObject;

import java.util.Calendar;
import java.util.HashMap;

import static com.family.aircok.acfamily.R.id.calendar;

/**
 * Created by CHJ on 2017. 8. 14..
 */

public class MonitoringMonthlyFragment extends BaseFragment implements DialogInterface.OnDismissListener {

    // ==================== Monthly ====================//
    private CXCalendarView mCalendarView;
    private Adapter_ mAdapter;
    private Calendar mCalendar;
    private HashMap<String, JSONObject> mDataMap = new HashMap<>();
    private HashMap<String, JSONObject> mRecordsMap = new HashMap<>();
    private HealthHistoryDialog mDialog;

    // ==================== Monthly ====================//


    private class Adapter_ extends CXCalendarView.CalendarAdapter {
        private String[] weeks = {"Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"};
        private int[] mStateColor = {0xff4ed2fb, 0xff5ed36f, 0xffffb71c, 0xffff6e35, 0xffea3046};
        private int[] mStateImage = {R.drawable.graph_dot_month_good, R.drawable.graph_dot_month_soso, R.drawable.graph_dot_month_sensitive, R.drawable.graph_dot_month_bad, R.drawable.graph_dot_month_serious};


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

            int stateP = -1;
            int stateC = -1;
            int stateN = -1;
            if (month == mCalendar.get(Calendar.MONTH)) {

                String p = String.format("%d", day - 1);
                if (mDataMap.containsKey(p)) {
                    JSONObject object = mDataMap.get(p);
                    int index_avg = object.optInt("index_avg");
                    stateP = C2Util.getDustState(index_avg);
                }

                String c = String.format("%d", day);
                if (mDataMap.containsKey(c)) {
                    JSONObject object = mDataMap.get(c);
                    int index_avg = object.optInt("index_avg");
                    stateC = C2Util.getDustState(index_avg);
                }

                String n = String.format("%d", day + 1);
                if (mDataMap.containsKey(n)) {
                    JSONObject object = mDataMap.get(n);
                    int index_avg = object.optInt("index_avg");
                    stateN = C2Util.getDustState(index_avg);
                }
            }

            ImageView iv_date_bg = (ImageView) view.findViewById(R.id.iv_date_bg);
            TextView tv_day = (TextView) view.findViewById(R.id.tv_day);
            View view_left_state = view.findViewById(R.id.view_left_state);
            ImageView iv_center_state = (ImageView)view.findViewById(R.id.iv_center_state);
            View view_right_state = view.findViewById(R.id.view_right_state);

            iv_date_bg.setVisibility(isRecord ? View.VISIBLE : View.INVISIBLE);
            tv_day.setText(String.format("%02d", day));
            tv_day.setTextColor(isCurrent ?  0xff333333: 0x80333333);
            if (isRecord)
                tv_day.setTextColor(getResources().getColor(R.color.white));

            view_left_state.setVisibility(View.INVISIBLE);
            iv_center_state.setVisibility(View.GONE);
            view_right_state.setVisibility(View.INVISIBLE);
            if (stateC != -1) {
                if (stateP == stateC) {
                    view_left_state.setVisibility(View.VISIBLE);
                    view_left_state.setBackgroundColor(mStateColor[stateP]);
                }
                if (stateC == stateN) {
                    view_right_state.setVisibility(View.VISIBLE);
                    view_right_state.setBackgroundColor(mStateColor[stateN]);
                }
                if (stateP != stateN ) {
                    iv_center_state.setVisibility(View.VISIBLE);
                    iv_center_state.setImageResource(mStateImage[stateC]);
                }
                if (stateP == -1 && stateN == -1) {
                    iv_center_state.setVisibility(View.VISIBLE);
                    iv_center_state.setImageResource(mStateImage[stateC]);
                }
                if (stateC != -1) {
                    iv_center_state.setVisibility(View.VISIBLE);
                    iv_center_state.setImageResource(mStateImage[stateC]);
                }

            }

        }
    }
    // ==================== Monthly ====================//

    public MonitoringMonthlyFragment() {

    }

    @Nullable
    @Override
    public View onCreateView(LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        baseView = inflater.inflate(R.layout.fragment_monitoring_monthly, container, false);

        mCalendar = Calendar.getInstance();
        mAdapter = new Adapter_();
        mCalendarView = (CXCalendarView) baseView.findViewById(R.id.calendar);
        mCalendarView.setCalendarAdapter(mAdapter);

        baseView.findViewById(R.id.btn_calendar_pre).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                mCalendar.add(Calendar.MONTH, -1);
                requestDayofmonth(C2Preference.getLoginID(getContext()), getMeasureMonth());
            }
        });
        baseView.findViewById(R.id.btn_calendar_next).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                mCalendar.add(Calendar.MONTH, 1);
                requestDayofmonth(C2Preference.getLoginID(getContext()), getMeasureMonth());
            }
        });

        mCalendarView.setOnDayClickListener(new CXCalendarView.OnDayClickListener() {
            @Override
            public void onDayClick(View view, int position, Calendar calendar) {
                //TODO : Calendar click
                int year = calendar.get(Calendar.YEAR);
                int month = calendar.get(Calendar.MONTH) + 1;
                int day = calendar.get(Calendar.DATE);
//                LogUtil.LOGE(String.format("postion : %d, year : %d, month : %d, day : %d", position, year, month, day));
                String insert_dt = String.format("%d%02d%02d", year, month, day);
                String title = String.format("%d.%02d.%02d", year, month, day);

                mDialog = new HealthHistoryDialog(getContext());
                mDialog.setTitle(title);
                mDialog.setOnDismissListener(MonitoringMonthlyFragment.this);
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

        reloadCalender();
        requestDayofmonth(C2Preference.getLoginID(getContext()), getMeasureMonth());

        return baseView;
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
        TextView tv_calendar_date = (TextView) baseView.findViewById(R.id.tv_calendar_date);
        tv_calendar_date.setText(String.format("%d.%02d", year, month));
    }

    private String getMeasureMonth() {
        int year = mCalendar.get(Calendar.YEAR);
        int month = mCalendar.get(Calendar.MONTH) + 1;
        return String.format("%d%02d", year, month);
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
            }
            else if (tr.getCode().equals("medical")) {
                responseMedical(tr);
            }

        }
    }

    private void requestDayofmonth(String email, String measure_month) {
        ACTransaction tr = new ACTransaction(this, "dayofmonth");
        tr.setConnectionURL(Config.SERVER_URL);
        tr.setRequest("email", email);
        tr.setRequest("user_id", LoginInfo.getInstance().user_id);
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
                    String insert_dt = object.optString("insert_dt");
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
        tr.setRequest("email", C2Preference.getLoginID(getContext()));
        tr.setRequest("aircok_type", "family");
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
            requestDayofmonth(C2Preference.getLoginID(getContext()), getMeasureMonth());
        } else if  ("-1".equals(respone.opt("result"))) {
            CustomDialog mDialog = new CustomDialog(getContext());
            mDialog.setTitle(getString(R.string.dialog_title_0));
            mDialog.setIcon(-1);
            mDialog.setBtn(-1);
            mDialog.setMsg(getString(R.string.dialog_msg_8));
            mDialog.show();
        }
    }
}
