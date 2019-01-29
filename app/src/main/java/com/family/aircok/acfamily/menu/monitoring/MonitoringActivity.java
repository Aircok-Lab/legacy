package com.family.aircok.acfamily.menu.monitoring;

import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.graphics.Bitmap;
import android.os.Bundle;
import android.provider.Settings;
import android.support.v4.app.Fragment;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.ImageView;
import android.widget.ListView;
import android.widget.TextView;

import com.family.aircok.acfamily.BaseActivity;
import com.family.aircok.acfamily.R;
import com.family.aircok.acfamily.common.C2Preference;
import com.family.aircok.acfamily.common.C2Util;
import com.family.aircok.acfamily.common.LogUtil;
import com.family.aircok.acfamily.common.LoginInfo;
import com.family.aircok.acfamily.common.PermissionManager;
import com.family.aircok.acfamily.common.Util;
import com.family.aircok.acfamily.common.widget.CXCalendarView;
import com.family.aircok.acfamily.common.Config;
import com.family.aircok.acfamily.common.widget.CustomDialog;
import com.family.aircok.acfamily.common.widget.HealthHistoryDialog;
import com.family.aircok.acfamily.menu.DustInfoActivity;
import com.family.aircok.acfamily.net.client.C2HTTPProcessor;
import com.family.aircok.acfamily.net.transaction.ACTransaction;

import net.cruxware.android.net.client.NetworkProcessor;
import net.cruxware.android.net.transaction.Transaction;
import net.cruxware.android.net.transaction.TransactionException;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.Locale;
import java.util.TimeZone;

import static com.family.aircok.acfamily.R.id.calendar;
import static com.family.aircok.acfamily.R.id.fragment_container;
import static com.family.aircok.acfamily.common.PermissionManager.REQUEST_CODE_WRITE_EXTERNAL_STORAGE;

/**
 * Created by ssong on 2017. 4. 24..
 */

public class MonitoringActivity extends BaseActivity  {

    // ==================== Tap ====================//
    private TextView measureTxt, exposureTxt, tv_dayly, tv_monthly, tv_yearly;
    // ==================== Tap ====================//

    // ==================== List ====================//
    private ListView dustListView;
    // ==================== List ====================//

    private class DustListViewItem {
        public int indexImg;
        public String time;
        public String address;
        public String dustNum;

        public int getIndexImg() {
            return indexImg;
        }

        public String getTime(){
            return time;
        }

        public String getAddress() {
            return address;
        }

        public String getDustNum() {
            return dustNum;
        }

        public DustListViewItem(int mIndex, String time, String address, String dustNum){
            int index = mIndex;
            if (index < 0) {
                index = 0;
            }
            if (index > 100) {
                index = 100;
            }

            if (index <= 20) {
                this.indexImg = R.drawable.ic_monitoring_good;
            }
            else if (index <= 40) {
                this.indexImg = R.drawable.ic_monitoring_soso;
            }
            else if (index <= 60) {
                this.indexImg = R.drawable.ic_monitoring_sensitive;
            }
            else if (index <= 80) {
                this.indexImg = R.drawable.ic_monitoring_bad;
            }
            else if (index <= 100) {
                this.indexImg = R.drawable.ic_monitoring_serious;
            }

            this.time = time;
            this.address = address;
            this.dustNum = dustNum;
        }
    }

    private class DustMonitoringAdapter extends BaseAdapter {

        private LayoutInflater inflater;
        private ArrayList<DustListViewItem> data;
        private int layout;


        public DustMonitoringAdapter(Context context, int layout, ArrayList<DustListViewItem> data){
            this.inflater = (LayoutInflater)context.getSystemService(Context.LAYOUT_INFLATER_SERVICE);
            this.data = data;
            this.layout = layout;
        }

        @Override
        public int getCount() {
            return data.size();
        }

        @Override
        public Object getItem(int position) {
            return data.get(position);
        }

        @Override
        public long getItemId(int position) {
            return position;
        }

        @Override
        public View getView(int position, View convertView, ViewGroup parent) {
            if (convertView == null) {
                convertView = inflater.inflate(layout,parent,false);
            }
            DustListViewItem list = data.get(position);

            ImageView icon = (ImageView) convertView.findViewById(R.id.monitoring_image_index);
            icon.setImageResource(list.getIndexImg());

            TextView time = (TextView) convertView.findViewById(R.id.list_time);
            time.setText(list.getTime());

            TextView address = (TextView) convertView.findViewById(R.id.list_address);
            address.setText(list.getAddress());

            TextView dustNum = (TextView) convertView.findViewById(R.id.list_dust);
            dustNum.setText(list.getDustNum());

            int dust = Integer.parseInt(list.getDustNum());
            if (dust < 0) {
                dust = 0;
            }
            if (dust > 100) {
                dust = 100;
            }
            dustNum.setTextColor(getResources().getColor(R.color.dust_text_color0));
            if (dust <= 20) {
                dustNum.setTextColor(getResources().getColor(R.color.dust_text_color0));
            }
            else if (dust <= 40) {
                dustNum.setTextColor(getResources().getColor(R.color.dust_text_color1));
            }
            else if (dust <= 60) {
                dustNum.setTextColor(getResources().getColor(R.color.dust_text_color2));
            }
            else if (dust <= 80) {
                dustNum.setTextColor(getResources().getColor(R.color.dust_text_color3));
            }
            else if (dust <= 100) {
                dustNum.setTextColor(getResources().getColor(R.color.dust_text_color4));
            }

            return convertView;
        }
    }

    private PermissionManager.OnPermissionListener mPermissionListener = new PermissionManager.OnPermissionListener() {
        @Override
        public void onPermissionResult(int requestCode, boolean isPermission) {
            if (requestCode == REQUEST_CODE_WRITE_EXTERNAL_STORAGE) {
                if (isPermission) {
                    LogUtil.LOGE("저장 퍼미션 허용");
                    View rootView = getWindow().getDecorView().findViewById(R.id.layout_drawer);
                    Bitmap screenShot = Util.takeScreenshot(rootView);
                    if (getPermissionManager().isStoragePermision()){
                        Util.saveBitmap(screenShot);
                        Util.shareIt(MonitoringActivity.this);
                    }

                } else {
                    //TODO : PERMISSION OFF메세지
                    showAlert(getString(R.string.alert_permission_storage_title), getString(R.string.alert_permission_storage_message), -1, getString(R.string.common_ok),
                            getString(R.string.common_cancel), new DialogInterface.OnClickListener() {
                                @Override
                                public void onClick(DialogInterface dialog, int which) {
                                    if (which == 0) {
                                        Intent intent = new Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS);
                                        startActivity(intent);
                                    }
                                }
                            });
                }
            }
        }
    };

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_monitoring);

        setNewHeader(R.drawable.btn_nav_back_n, -1, R.string.menu_title2, true, -1);

        measureTxt = (TextView) findViewById(R.id.dust_measure_text);
        exposureTxt = (TextView) findViewById(R.id.dust_exposure_text);
        dustListView = (ListView) findViewById(R.id.dust_listview);

        tv_dayly = (TextView) findViewById(R.id.tv_day_tab);
        tv_monthly = (TextView) findViewById(R.id.tv_month_tab);
        tv_yearly = (TextView) findViewById(R.id.tv_year_tab);
        findViewById(R.id.list_top).setVisibility(View.GONE);

        seleteTab(0);
        // ==================== 상단 탭 초미세먼지측정 ====================//
        findViewById(R.id.dust_measure).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                seleteTab(0);
            }
        });
        // ==================== 상단 탭 초미세먼지측정 ====================//

        // ==================== 상단 탭 초미세먼지노출 ====================//
        findViewById(R.id.dust_exposure).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                seleteTab(1);
            }
        });
        // ==================== 상단 탭 초미세먼지노출 ====================//

        // ==================== 초미세먼지노출 일별 ====================//
        findViewById(R.id.day_tab_lay).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                seleteSubTab(0);
            }
        });
        // ==================== 초미세먼지노출 일별 ====================//

        // ==================== 초미세먼지노출 월별 ====================//
        findViewById(R.id.month_tab_lay).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                seleteSubTab(1);
            }
        });
        // ==================== 초미세먼지노출 월별 ====================//

        // ==================== 초미세먼지노출 연별 ====================//
        findViewById(R.id.year_tab_lay).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                seleteSubTab(2);
            }
        });
        // ==================== 초미세먼지노출 연별 ====================//

        View header = findViewById(R.id.layout_header);
        header.findViewById(R.id.btn_nav_share).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                LogUtil.LOGE("start share screenShot");
                getPermissionManager().performPermission(mPermissionListener, PermissionManager.PERMISSIONS_STORAGE, REQUEST_CODE_WRITE_EXTERNAL_STORAGE);
            }
        });
    }

    private void seleteTab(int index) {
        findViewById(R.id.dust_measure_line).setVisibility(View.INVISIBLE);
        findViewById(R.id.dust_exposure_line).setVisibility(View.INVISIBLE);
        measureTxt.setTextColor(getResources().getColor(R.color.inside_outside_default));
        exposureTxt.setTextColor(getResources().getColor(R.color.inside_outside_default));
        findViewById(R.id.monitoring_layout).setVisibility(View.GONE);
        findViewById(R.id.dust_exposure_layout).setVisibility(View.GONE);
        if (index == 0) {
            findViewById(R.id.dust_measure_line).setVisibility(View.VISIBLE);
            measureTxt.setTextColor(getResources().getColor(R.color.inside_outside_select));
            findViewById(R.id.monitoring_layout).setVisibility(View.VISIBLE);
            requestList();
        }
        else if (index == 1) {
            findViewById(R.id.dust_exposure_line).setVisibility(View.VISIBLE);
            exposureTxt.setTextColor(getResources().getColor(R.color.inside_outside_select));
            findViewById(R.id.dust_exposure_layout).setVisibility(View.VISIBLE);
            seleteSubTab(0);
        }
    }
    private void seleteSubTab(int index) {
        findViewById(R.id.day_tab_dot).setVisibility(View.GONE);
        findViewById(R.id.month_tab_dot).setVisibility(View.GONE);
        findViewById(R.id.year_tab_dot).setVisibility(View.GONE);
        tv_dayly.setTextColor(getResources().getColor(R.color.inside_outside_default));
        tv_monthly.setTextColor(getResources().getColor(R.color.inside_outside_default));
        tv_yearly.setTextColor(getResources().getColor(R.color.inside_outside_default));
        Fragment fragment = null;
        if (index == 0) {
            findViewById(R.id.day_tab_dot).setVisibility(View.VISIBLE);
            tv_dayly.setTextColor(getResources().getColor(R.color.inside_outside_select));
            fragment = new MonitoringDailyFragment();
        }
        else if (index == 1) {
            findViewById(R.id.month_tab_dot).setVisibility(View.VISIBLE);
            tv_monthly.setTextColor(getResources().getColor(R.color.inside_outside_select));
            fragment = new MonitoringMonthlyFragment();
        }
        else if (index == 2) {
            findViewById(R.id.year_tab_dot).setVisibility(View.VISIBLE);
            tv_yearly.setTextColor(getResources().getColor(R.color.inside_outside_select));
            fragment = new MonitoringYearlyFragment();
        }

        if (fragment != null) {
            getSupportFragmentManager().beginTransaction().replace(R.id.fragment_container, fragment).commit();
        }
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
            if (tr.getCode().equals("list")){
                responseList(tr);
            }
        }
    }

    private void requestList(){
        ACTransaction tr = new ACTransaction(MonitoringActivity.this, "list");
        tr.setConnectionURL(Config.SERVER_URL);
        tr.setRequest("user_id", LoginInfo.getInstance().user_id);
        tr.setRequest("email", C2Preference.getLoginID(this));
        C2HTTPProcessor.getInstance().sendToBLServer(tr);
    }

    private void responseList(ACTransaction tr) {
        String result = "";
        JSONObject respone = tr.getResponse();
        result = respone.optString("result");

        ArrayList<DustListViewItem> mList = new ArrayList<>();
        if ("1".equals(result)) {
            try {
                findViewById(R.id.list_top).setVisibility(View.VISIBLE);
                JSONArray dataArr = respone.getJSONArray("data");
                for (int i = 0; i < dataArr.length(); i++) {
                    JSONObject json = dataArr.getJSONObject(i);
                    LogUtil.LOGE("list json : " + json);
                    String pm25 = String.valueOf(json.getInt("pm25"));
                    int mIndex = json.getInt("m_index");

                    JSONObject location = json.getJSONObject("location");
                    String addr = location.optString("locality") +" " + location.optString("sublocality_lv1");
                    String dt = json.optString("update_dt");

//                    String date = dt.replace("-", " ");
//                    date = date.replace("T", " ");
//                    date = date.replace(":", " ");
//                    String[] splitData = date.split(" ");
//                    for (int j = 0 ; j < splitData.length; j++ ) {
//                        LogUtil.LOGE("splitData: " + splitData[j]);
//                    }

//                    LogUtil.LOGE("date: " + date);
//                    int time = Integer.parseInt(splitData[3]);
//                    String am = " AM";
//                    if (time >= 12 ) {
//                        am = " PM";
//                        time = time - 12;
//                    }
//                    String inputDate = splitData[1] + "." + splitData[2] + " " + time +":" + splitData[4] + am;
//                    DustListViewItem data = new DustListViewItem(mIndex, inputDate, addr, pm25);
//                    mList.add(data);

                    SimpleDateFormat changeFormat = new SimpleDateFormat("MM.dd hh:mm a");
                    String strDate = changeFormat.format(Util.iso8601Format(dt));
                    LogUtil.LOGE("strDate: " + strDate);
                    String[] date = strDate.split(" ");
                    String am = "AM";
                    if ("오후".equals(date[2])) {
                        am = "PM";
                    }
                    String inputDate = date[0] + " " + date[1] + " " + am;

                    DustListViewItem data = new DustListViewItem(mIndex, inputDate, addr, pm25);
                    mList.add(data);


                }
                DustMonitoringAdapter adapter = new DustMonitoringAdapter(this, R.layout.dust_listview_item, mList);
                dustListView.setAdapter(adapter);

            } catch (JSONException e) {
                e.printStackTrace();
            } catch (ParseException e) {
                e.printStackTrace();
            }
        } else if ("2".equals(result)) {
            findViewById(R.id.list_top).setVisibility(View.GONE);
        }

    }
}
