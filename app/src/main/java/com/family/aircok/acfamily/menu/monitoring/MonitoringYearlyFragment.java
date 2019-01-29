package com.family.aircok.acfamily.menu.monitoring;

import android.graphics.Color;
import android.os.Bundle;
import android.support.annotation.Nullable;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import com.family.aircok.acfamily.BaseFragment;
import com.family.aircok.acfamily.R;
import com.family.aircok.acfamily.common.C2Preference;
import com.family.aircok.acfamily.common.Config;
import com.family.aircok.acfamily.common.LogUtil;
import com.family.aircok.acfamily.common.LoginInfo;
import com.family.aircok.acfamily.common.widget.BarChartView;
import com.family.aircok.acfamily.net.client.C2HTTPProcessor;
import com.family.aircok.acfamily.net.transaction.ACTransaction;

import net.cruxware.android.net.client.NetworkProcessor;
import net.cruxware.android.net.transaction.Transaction;
import net.cruxware.android.net.transaction.TransactionException;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

import static android.R.id.list;
import static com.family.aircok.acfamily.common.C2Util.getDustState;

/**
 * Created by CHJ on 2017. 8. 14..
 */

public class MonitoringYearlyFragment extends BaseFragment {

    private BarChartView mChart;
    private Calendar mCalendar;

    public MonitoringYearlyFragment() {

    }

    @Nullable
    @Override
    public View onCreateView(LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        baseView = inflater.inflate(R.layout.fragment_monitoring_yearly, container, false);

        init();
        LogUtil.LOGE("getMeasureDay(): " + getMeasureYear());

        baseView.findViewById(R.id.btn_calendar_pre).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                mCalendar.add(Calendar.YEAR, -1);
                LogUtil.LOGE("pre getMeasureDay(): " + getMeasureYear());
                requestMonthofyear(C2Preference.getLoginID(getContext()), getMeasureYear());

            }
        });

        baseView.findViewById(R.id.btn_calendar_next).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                mCalendar.add(Calendar.YEAR, 1);
                LogUtil.LOGE("next getMeasureDay(): " + getMeasureYear());
                requestMonthofyear(C2Preference.getLoginID(getContext()), getMeasureYear());

            }
        });

        return baseView;
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
            if (tr.getCode().equals("monthofyear")){
                responseMonthofyear(tr);
            }
        }
    }

    private void requestMonthofyear (String email, String measure_year) {
        ACTransaction tr = new ACTransaction(this, "monthofyear");
        tr.setConnectionURL(Config.SERVER_URL);
        tr.setRequest("email", email);
        tr.setRequest("user_id", LoginInfo.getInstance().user_id);
        tr.setRequest("measure_year", measure_year);
        C2HTTPProcessor.getInstance().sendToBLServer(tr);
    }

    private void responseMonthofyear (ACTransaction tr) {
        String result = "";
        JSONObject respone = tr.getResponse();
        result = respone.optString("result");

        ArrayList values = new ArrayList<>();
        ArrayList labels = new ArrayList<>();

        int index = 0;
        int color = Color.parseColor("#4ed2fb");

        if ("1".equals(result)) {
            try {
                JSONArray dataArr = respone.getJSONArray("data");
                for (int i = 1; i < 13; i++) {
                    JSONObject json = dataArr.optJSONObject(index);
                    if (json != null) {
                        int month = json.optInt("month");
                        if (i == month) {
                            index++;
                            values.add(json.optInt("index_avg"));
                            int state = getDustState(json.optInt("index_avg"));
                            if (state == 0) {
                                color = Color.parseColor("#4ed2fb");
                            } else if (state == 1) {
                                color = Color.parseColor("#5ed36f");
                            } else if (state == 2) {
                                color = Color.parseColor("#ffb71c");
                            } else if (state == 3) {
                                color = Color.parseColor("#ff6e35");
                            } else if (state == 4) {
                                color = Color.parseColor("#ea3046");
                            }
                            labels.add(color);

                        } else {
                            values.add(0);
                            labels.add(0);
                        }
                    } else {
                        values.add(0);
                        labels.add(0);
                    }

                }
                mChart.setValueMeasured(0, 150);
                mChart.setLabels(new String[]{"1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"});
                mChart.setVisibleCount(12);
                mChart.setValues(toIntArray(values));
                mChart.setValueColors(toIntArray(labels));
                mChart.refresh();
            } catch (JSONException e) {
                e.printStackTrace();
            }

            reload();
        } else if ("0".equals(result)){
            mChart.setValueMeasured(0, 150);
            mChart.setLabels(new String[]{"1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"});
            mChart.setValues(new int[]{0,0,0,0,0,0,0,0,0,0,0,0});
            mChart.setVisibleCount(12);
            mChart.refresh();
            reload();
        }
    }

    private void init() {
        mChart = (BarChartView) baseView.findViewById(R.id.chart);
        mCalendar = Calendar.getInstance();
        Date today = mCalendar.getTime();
        DateFormat dateFormat = new SimpleDateFormat("yyyy");
        String todayAsString = dateFormat.format(today);

        TextView tv_date  = (TextView) baseView.findViewById(R.id.tv_calendar_date);
        tv_date.setText(todayAsString);

        requestMonthofyear(C2Preference.getLoginID(getContext()), getMeasureYear());
    }

    private void reload() {
        Date day = mCalendar.getTime();
        DateFormat dateFormat = new SimpleDateFormat("yyyy");
        String todayAsString = dateFormat.format(day);

        TextView tv_date  = (TextView) baseView.findViewById(R.id.tv_calendar_date);
        tv_date.setText(todayAsString);
    }

    private String getMeasureYear() {
        int year = mCalendar.get(Calendar.YEAR);
        return String.format("%d", year);
    }

    private int[] toIntArray(List<Integer> list)  {
        int[] ret = new int[list.size()];
        int i = 0;
        for (Integer e : list)
            ret[i++] = e.intValue();
        return ret;
    }

}
