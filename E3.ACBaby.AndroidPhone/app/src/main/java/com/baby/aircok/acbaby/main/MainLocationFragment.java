package com.baby.aircok.acbaby.main;

import android.Manifest;
import android.app.Activity;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;
import android.net.Uri;
import android.os.Bundle;
import android.provider.Settings;
import android.support.annotation.Nullable;
import android.support.v4.app.ActivityCompat;
import android.text.TextUtils;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import com.baby.aircok.acbaby.BaseFragment;
import com.baby.aircok.acbaby.R;
import com.baby.aircok.acbaby.common.C2Preference;
import com.baby.aircok.acbaby.common.C2Util;
import com.baby.aircok.acbaby.common.Config;
import com.baby.aircok.acbaby.common.LoginInfo;
import com.baby.aircok.acbaby.common.PermissionManager;
import com.baby.aircok.acbaby.common.Util;
import com.baby.aircok.acbaby.common.geo.GeoTrans;
import com.baby.aircok.acbaby.common.geo.GeoTransPoint;
import com.baby.aircok.acbaby.net.client.C2HTTPProcessor;
import com.baby.aircok.acbaby.net.transaction.ACTransaction;
import com.baby.aircok.acbaby.net.transaction.C2HTTPTransaction;
import com.baby.aircok.acbaby.net.transaction.DATATransaction;

import net.cruxware.android.base.util.JSONUtil;
import com.baby.aircok.acbaby.common.LogUtil;
import net.cruxware.android.net.client.NetworkProcessor;
import net.cruxware.android.net.transaction.Transaction;
import net.cruxware.android.net.transaction.TransactionException;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import static android.Manifest.permission.ACCESS_FINE_LOCATION;
import static android.R.attr.data;
import static android.content.Context.LOCATION_SERVICE;
import static com.baby.aircok.acbaby.R.id.location0;
import static com.baby.aircok.acbaby.R.id.location1;
import static com.baby.aircok.acbaby.R.id.location2;
import static com.baby.aircok.acbaby.common.PermissionManager.REQUEST_CODE_ACCESS_FINE_LOCATION;

/**
 * Created by CHO on 2016. 10. 25..
 */

public class MainLocationFragment extends BaseFragment implements KMAHelper.OnResponseListener {


    public static final int REQUEST_CODE_LOCATION1 = 1220;
    public static final int REQUEST_CODE_LOCATION2 = 1221;
    public static final int REQUEST_CODE_LOCATION3 = 1222;
    private int mPM25 = 0;
    private String mLocation1;
    private String mLocation2;
    private String mLocation3;
    private String mStation2;
    private String mStation3;
    private String addressData2;
    private String addressData3;

    private boolean isLocatin2Change = false;
    private boolean isLocatin3Change = false;

    private LocationListener listener = new LocationListener() {
        @Override
        public void onLocationChanged(Location location) {
            stopUpdatingHeading();
            double latitude = location.getLatitude();
            double longitude = location.getLongitude();
            Util.setLatitude(latitude);
            Util.setLongitude(longitude);
            mLocation1 = Util.getAddress(getContext(), latitude, longitude);
            requestKMAHeler(mLocation1, REQUEST_CODE_LOCATION1);
        }

        @Override
        public void onStatusChanged(String provider, int status, Bundle extras) {}
        @Override
        public void onProviderEnabled(String provider) {}
        @Override
        public void onProviderDisabled(String provider) {}
    };

    private PermissionManager.OnPermissionListener mPermissionListener = new PermissionManager.OnPermissionListener() {
        @Override
        public void onPermissionResult(int requestCode, boolean isPermission) {
            if (requestCode == REQUEST_CODE_ACCESS_FINE_LOCATION) {
                if (isPermission) {
                    LogUtil.LOGE("퍼미션 허용");
                    if (Util.isGps(getContext())) {
                        startUpdatingLocation();
                    }
                    else {
                        showAlert(getString(R.string.alert_location_title), getString(R.string.alert_location_message), R.drawable.icon_pin, getString(R.string.common_ok),
                                getString(R.string.common_cancel), new DialogInterface.OnClickListener() {
                                    @Override
                                    public void onClick(DialogInterface dialog, int which) {
                                        if (which == 0) {
                                            Intent intent = new Intent(Settings.ACTION_LOCATION_SOURCE_SETTINGS);
                                            startActivity(intent);
                                        }
                                    }
                                });
                    }
                } else {
                    //TODO : PERMISSION OFF메세지
                    LogUtil.LOGE("퍼미션 거절");
                    showAlert(getString(R.string.alert_permission_title), getString(R.string.alert_permission_message), -1, getString(R.string.common_ok),
                            getString(R.string.common_cancel), new DialogInterface.OnClickListener() {
                                @Override
                                public void onClick(DialogInterface dialog, int which) {
                                    if (which == 0) {
                                        Intent intent = new Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS,
                                                Uri.fromParts("package", getContext().getPackageName(), null));
                                        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                                        startActivity(intent);
                                    }
                                }
                            });
                }
            }
        }
    };

    public MainLocationFragment() {}

    @Nullable
    @Override
    public View onCreateView(LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        baseView = inflater.inflate(R.layout.fragment_location, container, false);

        baseView.findViewById(R.id.btn_show).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if (getActivity() instanceof  MainActivity) {
                    MainActivity activity = (MainActivity) getActivity();
                    activity.showBehavior();
                }
            }
        });

        LocationView locationView0 = (LocationView) baseView.findViewById(location0);
        final LocationView locationView1 = (LocationView) baseView.findViewById(location1);
        final LocationView locationView2 = (LocationView) baseView.findViewById(location2);
        locationView0.setPM25(getString(R.string.common_current_location), null, -1);
        locationView1.setPM25(getString(R.string.common_interest), null, -1);
        locationView2.setPM25(getString(R.string.common_interest), null, -1);

        baseActivity.getPermissionManager().performPermission(mPermissionListener, PermissionManager.PERMISSIONS_LOCATION, REQUEST_CODE_ACCESS_FINE_LOCATION);

        locationView0.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                baseActivity.getPermissionManager().performPermission(mPermissionListener, PermissionManager.PERMISSIONS_LOCATION, REQUEST_CODE_ACCESS_FINE_LOCATION);
            }
        });

        locationView1.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(getContext(), MainLocationSearchActivity.class);
                startActivityForResult(intent, REQUEST_CODE_LOCATION2);
            }
        });
        locationView1.setOnLongClickListener(new View.OnLongClickListener() {
            @Override
            public boolean onLongClick(View v) {
                showAlert(getString(R.string.alert_location_delete_title), getString(R.string.alert_location_delete_message), -1, getString(R.string.common_ok), getString(R.string.common_cancel), new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialog, int which) {
                        if (which == 0) {
                            sendFavoriteLoaction("1", 0 , null, "", "D");
                            locationView1.setPM25(getString(R.string.common_interest),"", -1);
                        }
                    }
                });
                return true;
            }
        });

        locationView2.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(getContext(), MainLocationSearchActivity.class);
                startActivityForResult(intent, REQUEST_CODE_LOCATION3);
            }
        });
        locationView2.setOnLongClickListener(new View.OnLongClickListener() {
            @Override
            public boolean onLongClick(View v) {
                showAlert(getString(R.string.alert_location_delete_title), getString(R.string.alert_location_delete_message), -1, getString(R.string.common_ok), getString(R.string.common_cancel), new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialog, int which) {
                        if (which == 0) {
                            sendFavoriteLoaction("2", 0 , null, "", "D");
                            locationView2.setPM25(getString(R.string.common_interest),"", -1);
                        }
                    }
                });
                return true;
            }
        });


        setPM25(mPM25);
        //현재위치
        if (getActivity() instanceof MainActivity) {
            MainActivity activity = (MainActivity) getActivity();
            if (baseActivity.getPermissionManager().isLocationPermision()) {
                if (Util.isGps(getContext())) {
                    startUpdatingLocation();
                }
            }
        }

        //관심지역1
//        String location2 = C2Preference.getLocation(getContext(), 0);
        JSONObject location2 = LoginInfo.getInstance().favorite1;
        if (location2 != null) {
            addressData2 = location2.optString("address");
            String addr = location2.optString("address");
            addr = addr.replace(",", "");
            addr = addr.replace("(", "");
            addr = addr.replace(")", "");
            String[] array = addr.split(" ");
            for (String s : array) {
                char last = s.charAt(s.length() -1);
                if (last == '읍' || last == '면' || last == '동') {
                    addr = s;
                }
            }
            mLocation2 = addr;
            mStation2 = location2.optString("station");
            requestGETMSRSTNACCTORLTMMESUREDNSTY(REQUEST_CODE_LOCATION2, mStation2);
        }
        //관심지역2
//        String location3 = C2Preference.getLocation(getContext(), 1);
        JSONObject location3 = LoginInfo.getInstance().favorite2;
        if (location3 != null) {
            addressData3 = location3.optString("address");
            String addr = location3.optString("address");
            addr = addr.replace(",", "");
            addr = addr.replace("(", "");
            addr = addr.replace(")", "");
            String[] array = addr.split(" ");
            for (String s : array) {
                char last = s.charAt(s.length() -1);
                if (last == '읍' || last == '면' || last == '동') {
                    addr = s;
                }
            }
            mLocation3 = addr;
            mStation3 = location3.optString("station");
            requestGETMSRSTNACCTORLTMMESUREDNSTY(REQUEST_CODE_LOCATION3, mStation3);
        }
        return baseView;
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (resultCode == Activity.RESULT_OK) {
            String string = data.getExtras().getString(MainSelectLocationActivity.KEY_RESULT_DATA);

            try {
                JSONObject result_data = new JSONObject(string);
                if (requestCode == REQUEST_CODE_LOCATION2) {
                    isLocatin2Change = true;
                    String addr = result_data.optString(MainLocationSearchActivity.KEY_ADDRESS);
                    LogUtil.LOGE("addr : " + addr);
                    mLocation2 = addr;
                    addressData2 = data.getExtras().getString(MainSelectLocationActivity.KEY_RESULT_ADDRESS_DATA);
                    requestKMAHeler(mLocation2, REQUEST_CODE_LOCATION2);
                }
                else if (requestCode == REQUEST_CODE_LOCATION3) {
                    isLocatin3Change = true;
                    String addr = result_data.optString(MainLocationSearchActivity.KEY_ADDRESS);
                    mLocation3 = addr;
                    addressData3 = data.getExtras().getString(MainSelectLocationActivity.KEY_RESULT_ADDRESS_DATA);
                    requestKMAHeler(mLocation3, REQUEST_CODE_LOCATION3);
                }
            } catch (JSONException e) {e.printStackTrace();}
        }
    }

    public void setPM25(int pm25) {
        if (baseView == null) {
            return;
        }
        mPM25 = pm25;
        int point = C2Util.getTotalPoint(pm25);
        int state = C2Util.getDustState(point);
        TextView tv_main_pm25 = (TextView) baseView.findViewById(R.id.tv_main_pm25);
        tv_main_pm25.setText(String.valueOf(mPM25));
    }

    private void setLocationView(LocationView view, int location, JSONObject data) {
        String pm25 = data.optString("pm25Value");
        String stationName = data.optString("stationName");
        if (!TextUtils.isDigitsOnly(pm25)) {
            pm25 = "0";
        }

        view.setPM25(getString(R.string.common_interest), location == 0 ? mLocation2 : mLocation3, Integer.parseInt(pm25));
        if (location == 0) {
            if (isLocatin2Change) {
                sendFavoriteLoaction("1", Integer.parseInt(pm25), addressData2, stationName, "C");
            } else {
                sendFavoriteLoaction("1", Integer.parseInt(pm25), addressData2, stationName, "M");
            }

        } else if (location == 1) {
            if (isLocatin3Change) {
                sendFavoriteLoaction("2", Integer.parseInt(pm25), addressData3, stationName, "C");
            } else {
                sendFavoriteLoaction("2", Integer.parseInt(pm25), addressData3, stationName, "M");
            }
        }

    }

    private void sendFavoriteLoaction(String seq, int pm25, String address, String station, String flag){
        LogUtil.LOGE("sendFavoriteLoaction seq: " + seq + " pm25: " + pm25 + " address: " + address);
        ACTransaction tr = new ACTransaction(this, "favorite");
        tr.setConnectionURL(Config.SERVER_URL);
        tr.setRequest("user_id", LoginInfo.getInstance().user_id);
        tr.setRequest("email", C2Preference.getLoginID(getContext()));
        tr.setRequest("seq", seq);
        tr.setRequest("pm25", pm25);
        tr.setRequest("station", station);
        tr.setRequest("flag", flag);

        JSONObject locationJson = new JSONObject();
        try {
            if ("D".equals(flag)){
                locationJson.put("address", address);
                locationJson.put("country", null);
                locationJson.put("coordinate", null);
                locationJson.put("locality", null);
                locationJson.put("cublocality_lv1", null);
                locationJson.put("cublocality_lv2", null);
                locationJson.put("political", null);
            } else {
                locationJson.put("address", address);
                locationJson.put("country", "대한민국");
                String[] addAddress = address.split(",|\\(");
                GeoTransPoint point = Util.getLocation(getContext(), addAddress[1]);
                JSONArray coordinate = new JSONArray();
                coordinate.put(point.getY());
                coordinate.put(point.getX());
                locationJson.put("coordinate", coordinate);
                String[] addr = C2Util.getAddAddress(address);
                locationJson.put("locality", addr[1]);
                locationJson.put("cublocality_lv1", addr[2]);
                locationJson.put("cublocality_lv2", addr[3]);
                locationJson.put("political", addr[4]);
            }
        } catch (JSONException e){
            e.printStackTrace();
        }
        tr.setRequest("location", locationJson);
        C2HTTPProcessor.getInstance().sendToBLServer(tr);
    }

    private void startUpdatingLocation() {
        progressStart();
        LocationManager lm = (LocationManager) getContext().getSystemService(LOCATION_SERVICE);
        if (lm.isProviderEnabled(LocationManager.GPS_PROVIDER)) {
            LogUtil.LOGE(String.format("GPS 사용가능"));
            if (ActivityCompat.checkSelfPermission(getContext(), Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED && ActivityCompat.checkSelfPermission(getContext(), Manifest.permission.ACCESS_COARSE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
                return;
            }
            lm.requestLocationUpdates(LocationManager.GPS_PROVIDER, 0, 0, listener);
            lm.requestLocationUpdates(LocationManager.NETWORK_PROVIDER, 0, 0, listener);
//            LocationManager.
        }
    }

    private void stopUpdatingHeading() {
        progressStop();
        LocationManager lm = (LocationManager) getContext().getSystemService(LOCATION_SERVICE);
        if (ActivityCompat.checkSelfPermission(getContext(), ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED && ActivityCompat.checkSelfPermission(getContext(), Manifest.permission.ACCESS_COARSE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
            return;
        }
        lm.removeUpdates(listener);
    }

    @Override
    protected void onExceptionThrownOnUiThread(NetworkProcessor networkProcessor, TransactionException e) {
        super.onExceptionThrownOnUiThread(networkProcessor, e);
        progressStop();
    }

    @Override
    protected void onTransactionReceivedOnUiThread(NetworkProcessor networkProcessor, Transaction transaction) {
        super.onTransactionReceivedOnUiThread(networkProcessor, transaction);
        if (transaction instanceof C2HTTPTransaction) {
            C2HTTPTransaction tr = (C2HTTPTransaction) transaction;
            if (String.valueOf(REQUEST_CODE_LOCATION2).equals(tr.getCode())) {
                JSONUtil.putSafe(tr.getResponse(), "code", REQUEST_CODE_LOCATION2);
                responseGETMSRSTNACCTORLTMMESUREDNSTY(tr);
            }
            else if (String.valueOf(REQUEST_CODE_LOCATION3).equals(tr.getCode())) {
                JSONUtil.putSafe(tr.getResponse(), "code", REQUEST_CODE_LOCATION3);
                responseGETMSRSTNACCTORLTMMESUREDNSTY(tr);
            }
        }
        if (transaction instanceof ACTransaction) {
            ACTransaction tr = (ACTransaction) transaction;
            if (tr.getCode().equals("favorite")) {
                reponseFavorite(tr);
            }
        }
    }

    @Override
    public void onResponse(int code, boolean isSuccese, JSONObject data) {
        progressStop();
        if (isSuccese) {
            responseKMAHeler(code, data);
        }
        else{
            showSingleDialog(getString(R.string.network_alert_title_error), getString(R.string.network_alert_message_error), -1, getString(R.string.common_ok), null, null);
        }
    }

    private void requestKMAHeler(String location, int requestCode) {
        progressStart();
        GeoTransPoint wgs = Util.getLocation(getContext(), location);
//        CoordPoint wgs = Util.getLocation(getContext(), location);
        GeoTransPoint tm = GeoTrans.convert(GeoTrans.GEO, GeoTrans.TM, wgs);
//        CoordPoint tm = TransCoord.getTransCoord(wgs, TransCoord.COORD_TYPE_WGS84, TransCoord.COORD_TYPE_TM);
        LogUtil.LOGE("x : " + tm.x);
        LogUtil.LOGE("y : " + tm.y);
        KMAHelper helper = new KMAHelper(String.valueOf(tm.x), String.valueOf(tm.y));
        helper.request(requestCode, this);
    }

    private void responseKMAHeler(int code, JSONObject data) {
        if (data != null) {
            LogUtil.LOGE("data : " + data.toString());
            if (code == REQUEST_CODE_LOCATION1) {
                int pm25 = data.optInt("pm25Value");
                LocationView view = (LocationView) baseView.findViewById(location0);
                view.setPM25(getString(R.string.common_current_location), getString(R.string.common_out), pm25);
                Util.setGovPm25(pm25);
                if (getActivity() instanceof MainActivity) {
                    MainActivity activity = (MainActivity) getActivity();
                    activity.setCurrentLocation(mLocation1);
                }
            }
            else if (code == REQUEST_CODE_LOCATION2) {
                setLocationView((LocationView) baseView.findViewById(location1), 0, data);
            }
            else if (code == REQUEST_CODE_LOCATION3) {
                setLocationView((LocationView) baseView.findViewById(location2), 1, data);
            }
        }
    }

    //측정소별 실시간 측정정보조회
    private void requestGETMSRSTNACCTORLTMMESUREDNSTY(int code, String stationName) {
        String connectionURL = String.format("%s", C2HTTPTransaction.C2_CONNECTION_URL_GETMSRSTNACCTORLTMMESUREDNSTY);
        DATATransaction tr = new DATATransaction(this, String.valueOf(code));
        tr.setConnectionURL(connectionURL);
        tr.setValue("stationName", stationName);
        tr.setValue("dataTerm", "DAILY");
        tr.setValue("ver", "1.3");
        tr.setValue("numOfRows", 10);
        tr.setValue("pageNo", 1);
        tr.setValue("_returnType", "json");
        tr.setValue("ServiceKey", DATATransaction.SERVICE_KEY);
        C2HTTPProcessor.getInstance().sendToBLServer(tr);
    }

    private void responseGETMSRSTNACCTORLTMMESUREDNSTY(C2HTTPTransaction tr) {
        LogUtil.LOGE("responseGETMSRSTNACCTORLTMMESUREDNSTY tr: " + tr.getResponse().toString());

        int code = tr.getResponse().optInt("code");
        JSONArray list = tr.getResponse().optJSONArray("list");
        final JSONObject item = list.optJSONObject(0);


        if (code == REQUEST_CODE_LOCATION2) {
            JSONUtil.putSafe(item, "stationName", mStation2);
            setLocationView((LocationView) baseView.findViewById(location1), 0, item);
        }
        else if (code == REQUEST_CODE_LOCATION3) {
            JSONUtil.putSafe(item, "stationName", mStation3);
            setLocationView((LocationView) baseView.findViewById(location2), 1, item);
        }

    }

    private void reponseFavorite(ACTransaction tr) {
        String result = "";
        JSONObject respone = tr.getResponse();
        result = respone.optString("result");
        if ("1".equals(result)){
            if (isLocatin2Change) {
                isLocatin2Change = false;
            }
            if (isLocatin3Change) {
                isLocatin3Change = false;
            }
        }
    }
}
