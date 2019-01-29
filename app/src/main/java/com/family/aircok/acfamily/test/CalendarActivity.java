package com.family.aircok.acfamily.test;

import android.os.Bundle;
import android.view.View;
import android.widget.ImageView;
import android.widget.TextView;

import com.family.aircok.acfamily.BaseActivity;
import com.family.aircok.acfamily.R;
import com.family.aircok.acfamily.common.C2Util;
import com.family.aircok.acfamily.common.LogUtil;
import com.family.aircok.acfamily.common.widget.CXCalendarView;
import com.family.aircok.acfamily.common.Config;
import com.family.aircok.acfamily.net.client.C2HTTPProcessor;
import com.family.aircok.acfamily.net.transaction.ACTransaction;

import net.cruxware.android.net.client.NetworkProcessor;
import net.cruxware.android.net.transaction.Transaction;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.Calendar;
import java.util.HashMap;

import static com.family.aircok.acfamily.R.id.calendar;
import static com.family.aircok.acfamily.common.widget.CXCalendarView.OnClickListener;

/**
 * Created by CHJ on 2017. 6. 29..
 */

public class CalendarActivity extends BaseActivity {

    private CXCalendarView mCalendarView;
    private Adapter_ mAdapter;
    private Calendar mCalendar;
    private HashMap<String, JSONObject> mDataMap = new HashMap<>();
    private HashMap<String, JSONObject> mRecordsMap = new HashMap<>();


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
                LogUtil.LOGE("p : " + p);
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
            }

        }
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_calendar);

        mCalendar = Calendar.getInstance();
        mAdapter = new Adapter_();
        mCalendarView = (CXCalendarView) findViewById(calendar);
        mCalendarView.setCalendarAdapter(mAdapter);

        findViewById(R.id.btn_calendar_pre).setOnClickListener(new OnClickListener() {
            @Override
            public void onClick(View v) {
                mCalendar.add(Calendar.MONTH, -1);
                requestDayofmonth("fh20@nate.com", getMeasureMonth());
            }
        });
        findViewById(R.id.btn_calendar_next).setOnClickListener(new OnClickListener() {
            @Override
            public void onClick(View v) {
                mCalendar.add(Calendar.MONTH, 1);
                requestDayofmonth("fh20@nate.com", getMeasureMonth());
            }
        });

        mCalendarView.setOnDayClickListener(new CXCalendarView.OnDayClickListener() {
            @Override
            public void onDayClick(View view, int position, Calendar calendar) {
                int year = calendar.get(Calendar.YEAR);
                int month = calendar.get(Calendar.MONTH);
                int day = calendar.get(Calendar.DATE);
                LogUtil.LOGE(String.format("postion : %d, year : %d, month : %d, day : %d", position, year, month, day));
            }
        });


        requestDayofmonth("fh20@nate.com", getMeasureMonth());
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
    protected void onTransactionReceivedOnUiThread(NetworkProcessor networkProcessor, Transaction transaction) {
        super.onTransactionReceivedOnUiThread(networkProcessor, transaction);
        if (transaction instanceof ACTransaction) {
            ACTransaction tr = (ACTransaction) transaction;
            if (tr.getCode().equals("dayofmonth")) {
                responseDayofmonth(tr);
            }
        }
    }

    private void requestDayofmonth(String email, String measure_month) {
        ACTransaction tr = new ACTransaction(this, "dayofmonth");
        tr.setConnectionURL(Config.SERVER_URL);
        tr.setRequest("email", email);
        tr.setRequest("measure_month", measure_month);
        C2HTTPProcessor.getInstance().sendToBLServer(tr);
    }

    private void responseDayofmonth(ACTransaction tr) {
        String result = "";
        JSONObject respone = tr.getResponse();
        result = respone.optString("result");

        if ("0".equals(result)) {
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

            //Test
            try {
                JSONObject test;
                //점
                test = new JSONObject(); test.put("day", 1); test.put("pm25_avg", 12); test.put("index_avg", 19); mDataMap.put("1", test);
                test = new JSONObject(); test.put("day", 2); test.put("pm25_avg", 12); test.put("index_avg", 39); mDataMap.put("2", test);
                test = new JSONObject(); test.put("day", 3); test.put("pm25_avg", 12); test.put("index_avg", 59); mDataMap.put("3", test);
                test = new JSONObject(); test.put("day", 4); test.put("pm25_avg", 12); test.put("index_avg", 79); mDataMap.put("4", test);
                test = new JSONObject(); test.put("day", 5); test.put("pm25_avg", 12); test.put("index_avg", 99); mDataMap.put("5", test);

                //두개
                test = new JSONObject(); test.put("day", 6); test.put("pm25_avg", 12); test.put("index_avg", 19); mDataMap.put("6", test);
                test = new JSONObject(); test.put("day", 7); test.put("pm25_avg", 12); test.put("index_avg", 19); mDataMap.put("7", test);
                test = new JSONObject(); test.put("day", 8); test.put("pm25_avg", 12); test.put("index_avg", 39); mDataMap.put("8", test);
                test = new JSONObject(); test.put("day", 9); test.put("pm25_avg", 12); test.put("index_avg", 39); mDataMap.put("9", test);
                test = new JSONObject(); test.put("day", 10); test.put("pm25_avg", 12); test.put("index_avg", 59); mDataMap.put("10", test);
                test = new JSONObject(); test.put("day", 11); test.put("pm25_avg", 12); test.put("index_avg", 59); mDataMap.put("11", test);
                test = new JSONObject(); test.put("day", 12); test.put("pm25_avg", 12); test.put("index_avg", 79); mDataMap.put("12", test);
                test = new JSONObject(); test.put("day", 13); test.put("pm25_avg", 12); test.put("index_avg", 79); mDataMap.put("13", test);
                test = new JSONObject(); test.put("day", 14); test.put("pm25_avg", 12); test.put("index_avg", 99); mDataMap.put("14", test);
                test = new JSONObject(); test.put("day", 15); test.put("pm25_avg", 12); test.put("index_avg", 99); mDataMap.put("15", test);

                //세개
                test = new JSONObject(); test.put("day", 16); test.put("pm25_avg", 12); test.put("index_avg", 19); mDataMap.put("16", test);
                test = new JSONObject(); test.put("day", 17); test.put("pm25_avg", 12); test.put("index_avg", 19); mDataMap.put("17", test);
                test = new JSONObject(); test.put("day", 18); test.put("pm25_avg", 12); test.put("index_avg", 19); mDataMap.put("18", test);
                test = new JSONObject(); test.put("day", 19); test.put("pm25_avg", 12); test.put("index_avg", 39); mDataMap.put("19", test);
                test = new JSONObject(); test.put("day", 20); test.put("pm25_avg", 12); test.put("index_avg", 39); mDataMap.put("20", test);
                test = new JSONObject(); test.put("day", 21); test.put("pm25_avg", 12); test.put("index_avg", 39); mDataMap.put("21", test);
                test = new JSONObject(); test.put("day", 22); test.put("pm25_avg", 12); test.put("index_avg", 59); mDataMap.put("22", test);
                test = new JSONObject(); test.put("day", 23); test.put("pm25_avg", 12); test.put("index_avg", 59); mDataMap.put("23", test);
                test = new JSONObject(); test.put("day", 24); test.put("pm25_avg", 12); test.put("index_avg", 59); mDataMap.put("24", test);
                test = new JSONObject(); test.put("day", 25); test.put("pm25_avg", 12); test.put("index_avg", 79); mDataMap.put("25", test);
                test = new JSONObject(); test.put("day", 26); test.put("pm25_avg", 12); test.put("index_avg", 79); mDataMap.put("26", test);
                test = new JSONObject(); test.put("day", 27); test.put("pm25_avg", 12); test.put("index_avg", 79); mDataMap.put("27", test);
                test = new JSONObject(); test.put("day", 28); test.put("pm25_avg", 12); test.put("index_avg", 99); mDataMap.put("28", test);
                test = new JSONObject(); test.put("day", 29); test.put("pm25_avg", 12); test.put("index_avg", 99); mDataMap.put("29", test);
                test = new JSONObject(); test.put("day", 30); test.put("pm25_avg", 12); test.put("index_avg", 99); mDataMap.put("30", test);


            } catch (JSONException e) {
                e.printStackTrace();
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
}
