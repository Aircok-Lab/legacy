package com.baby.aircok.acbaby.intro;

import android.Manifest;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;
import android.os.Bundle;
import android.provider.Settings;
import android.support.v4.app.ActivityCompat;
import android.view.View;

import com.baby.aircok.acbaby.BaseActivity;
import com.baby.aircok.acbaby.R;
import com.baby.aircok.acbaby.common.PermissionManager;
import com.baby.aircok.acbaby.net.client.C2HTTPProcessor;
import com.baby.aircok.acbaby.net.transaction.C2HTTPTransaction;

import com.baby.aircok.acbaby.common.LogUtil;
import net.cruxware.android.net.client.NetworkProcessor;
import net.cruxware.android.net.transaction.Transaction;
import net.cruxware.android.net.transaction.TransactionException;

import org.json.JSONArray;
import org.json.JSONObject;

import static android.Manifest.permission.ACCESS_FINE_LOCATION;
import static com.baby.aircok.acbaby.common.PermissionManager.REQUEST_CODE_ACCESS_FINE_LOCATION;

/**
 * Created by CHO on 2016. 10. 21..
 */

public class LocationActivity extends BaseActivity {

    private double latitude;
    private double longitude;

    private LocationListener listener = new LocationListener() {
        @Override
        public void onLocationChanged(Location location) {
            latitude = location.getLatitude();
            longitude = location.getLongitude();
            stopUpdatingHeading();

            LogUtil.LOGE(String.format("latitude : %s, longitude : %s", latitude, longitude));
        }

        @Override
        public void onStatusChanged(String provider, int status, Bundle extras) {}
        @Override
        public void onProviderEnabled(String provider) {}
        @Override
        public void onProviderDisabled(String provider) {}
    };

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_location);

        findViewById(R.id.btn_gps).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                String[] permissions = {ACCESS_FINE_LOCATION, Manifest.permission.ACCESS_COARSE_LOCATION};
                getPermissionManager().performPermission(new PermissionManager.OnPermissionListener() {
                    @Override
                    public void onPermissionResult(int requestCode, boolean isPermission) {
                        if (requestCode == REQUEST_CODE_ACCESS_FINE_LOCATION) {
                            if (isPermission) {
                                //허용
                                LogUtil.LOGE("허용");
                                startUpdatingLocation();
                            } else {
                                //거절
                                LogUtil.LOGE("거절");
                            }
                        }
                    }
                }, permissions, REQUEST_CODE_ACCESS_FINE_LOCATION);
            }
        });

        findViewById(R.id.btn_kma).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                String latlng = String.format("%f,%f", latitude, longitude);
//                requestGeocode(latlng);
            }
        });
    }

    private void startUpdatingLocation() {
        LocationManager lm = (LocationManager) getSystemService(LOCATION_SERVICE);
        if (lm.isProviderEnabled(LocationManager.GPS_PROVIDER)) {
            LogUtil.LOGE(String.format("GPS 사용가능"));
            if (ActivityCompat.checkSelfPermission(this, Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED && ActivityCompat.checkSelfPermission(this, Manifest.permission.ACCESS_COARSE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
                return;
            }
            lm.requestLocationUpdates(LocationManager.GPS_PROVIDER, 0, 0, listener);
            lm.requestLocationUpdates(LocationManager.NETWORK_PROVIDER, 0, 0, listener);
        }
        else {
            LogUtil.LOGE(String.format("GPS 불가능"));
            Intent intent = new Intent(Settings.ACTION_LOCATION_SOURCE_SETTINGS);
            startActivity(intent);
        }
    }

    private void stopUpdatingHeading() {
        LocationManager lm = (LocationManager) getSystemService(LOCATION_SERVICE);
        if (ActivityCompat.checkSelfPermission(this, ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED && ActivityCompat.checkSelfPermission(this, Manifest.permission.ACCESS_COARSE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
            return;
        }
        lm.removeUpdates(listener);
    }

    @Override
    protected void onExceptionThrownOnUiThread(NetworkProcessor networkProcessor, TransactionException e) {
        super.onExceptionThrownOnUiThread(networkProcessor, e);
        LogUtil.LOGE("onExceptionThrownOnUiThread");
    }

    @Override
    protected void onTransactionReceivedOnUiThread(NetworkProcessor networkProcessor, Transaction transaction) {
        super.onTransactionReceivedOnUiThread(networkProcessor, transaction);
        if (transaction instanceof C2HTTPTransaction) {
            C2HTTPTransaction tr = (C2HTTPTransaction) transaction;
            if ("geocode".equals(tr.getCode())) {
                responseGeocode(tr);
            }
            else if ("top".equals(tr.getCode())) {
                responseTop(tr);
            }
//            else if ("mdl".equals(tr.getCode())) {
//                responseMdl(tr);
//            } else if ("leaf".equals(tr.getCode())) {
//                responseLeaf(tr);
//            }
        }
    }

//    private void requestGeocode(String latlng) {
//        String connectionURL = String.format("%s", C2HTTPTransaction.C2_CONNECTION_URL_GEOCODE);
//        C2HTTPTransaction tr = new C2HTTPTransaction(this, "geocode");
//        tr.setConnectionURL(connectionURL);
//        tr.setValue("latlng", latlng);
//        tr.setValue("sensor", true);
//        tr.setValue("language", "ko");
//        C2HTTPProcessor.getInstance().sendToBLServer(tr);
//    }

    private void responseGeocode(C2HTTPTransaction tr) {
        JSONArray results = tr.getResponse().optJSONArray("results");
        JSONObject result = results.optJSONObject(0);
        String formatted_address = result.optString("formatted_address");
        String[] addrs = formatted_address.split(" ");
//        this.top = addrs[1];
//        this.mdl = addrs[2];
//        this.leaf = addrs[3];

        requestTop();
    }

    private void requestTop() {
        String connectionURL = String.format("%s%s", C2HTTPTransaction.C2_CONNECTION_URL_KMA_POINT, "top.json.txt");
        C2HTTPTransaction tr = new C2HTTPTransaction(this, "top");
        tr.setConnectionURL(connectionURL);
        C2HTTPProcessor.getInstance().sendToBLServer(tr);
    }

    private void responseTop(C2HTTPTransaction tr) {
        JSONArray array = tr.getResponse().optJSONArray("array");

//        String code = getCode(array, top);
//        if (code != null) {
//            performMdl(code);
//        }
    }

    private String getCode(JSONArray array, String compare) {
        String code = null;
        for (int i = 0 ; i < array.length() ; i++) {
            JSONObject item = array.optJSONObject(i);
            String value = item.optString("value");
            if (value.equals(compare)) {
                code = item.optString("code");
                break;
            }
        }
        return code;
    }

//    @Override
//    protected void onExceptionThrownOnUiThread(NetworkProcessor networkProcessor, TransactionException e) {
//        super.onExceptionThrownOnUiThread(networkProcessor, e);
//        LogUtil.LOGE("onExceptionThrownOnUiThread");
//    }
//
//    @Override
//    protected void onTransactionReceivedOnUiThread(NetworkProcessor networkProcessor, Transaction transaction) {
//        super.onTransactionReceivedOnUiThread(networkProcessor, transaction);
//        if (transaction instanceof C2HTTPTransaction) {
//            C2HTTPTransaction tr = (C2HTTPTransaction) transaction;
//            if ("geocode".equals(tr.getCode())) {
//                responseGeocode(tr);
//            }
//            else if ("top".equals(tr.getCode())) {
//                responseTop(tr);
//            } else if ("mdl".equals(tr.getCode())) {
//                responseMdl(tr);
//            } else if ("leaf".equals(tr.getCode())) {
//                responseLeaf(tr);
//            }
//        }
//    }
//    private void performGeocode(String latlng) {
//        String connectionURL = String.format("%s", C2HTTPTransaction.C2_CONNECTION_URL_GEOCODE);
//        C2HTTPTransaction tr = new C2HTTPTransaction(this, "geocode");
//        tr.setConnectionURL(connectionURL);
//        tr.setValue("latlng", latlng);
//        tr.setValue("sensor", true);
//        tr.setValue("language", "ko");
//        C2HTTPProcessor.getInstance().sendToBLServer(tr);
//    }
//
//    private void responseGeocode(C2HTTPTransaction tr) {
//        JSONArray results = tr.getResponse().optJSONArray("results");
//        JSONObject result = results.optJSONObject(0);
//        String formatted_address = result.optString("formatted_address");
//        String[] addrs = formatted_address.split(" ");
//        this.top = addrs[1];
//        this.mdl = addrs[2];
//        this.leaf = addrs[3];
//
//        performTop();
//    }
//
//    private void performTop() {
//        String connectionURL = String.format("%s%s", C2HTTPTransaction.C2_CONNECTION_URL_KMA_POINT, "top.json.txt");
//        C2HTTPTransaction tr = new C2HTTPTransaction(this, "top");
//        tr.setConnectionURL(connectionURL);
//        C2HTTPProcessor.getInstance().sendToBLServer(tr);
//    }
//
//    private void responseTop(C2HTTPTransaction tr) {
//        JSONArray array = tr.getResponse().optJSONArray("array");
//
//        String code = getCode(array, top);
//        if (code != null) {
//            performMdl(code);
//        }
//    }
//
//    private void performMdl(String topCode) {
//        this.topCode = topCode;
//        String connectionURL = String.format("%s%s", C2HTTPTransaction.C2_CONNECTION_URL_KMA_POINT, String.format("mdl.%s.json.txt", topCode));
//        C2HTTPTransaction tr = new C2HTTPTransaction(this, "mdl");
//        tr.setConnectionURL(connectionURL);
//        C2HTTPProcessor.getInstance().sendToBLServer(tr);
//    }
//
//    private void responseMdl(C2HTTPTransaction tr) {
//        JSONArray array = tr.getResponse().optJSONArray("array");
//
//        String code = getCode(array, mdl);
//        if (code != null) {
//            performLeaf(code);
//        }
//    }
//
//    private void performLeaf(String mdlCode) {
//        String connectionURL = String.format("%s%s", C2HTTPTransaction.C2_CONNECTION_URL_KMA_POINT, String.format("leaf.%s.json.txt", mdlCode));
//        this.mdlCode = mdlCode;
//        C2HTTPTransaction tr = new C2HTTPTransaction(this, "leaf");
//        tr.setConnectionURL(connectionURL);
//        C2HTTPProcessor.getInstance().sendToBLServer(tr);
//    }
//
//    private void responseLeaf(C2HTTPTransaction tr) {
//        JSONArray array = tr.getResponse().optJSONArray("array");
//
//        JSONObject xy = null;
//        for (int i = 0 ; i < array.length() ; i++) {
//            JSONObject item = array.optJSONObject(i);
//            String value = item.optString("value");
//            if (value.equals(leaf)) {
//                xy = item;
//                break;
//            }
//        }
//
//        if (xy != null) {
//            String x = xy.optString("x");
//            String y = xy.optString("y");
//            LogUtil.LOGE("x : " + x);
//            LogUtil.LOGE("y : " + y);
//        }
//    }

}
