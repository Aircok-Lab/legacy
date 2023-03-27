package com.baby.aircok.acbaby.common;

import android.bluetooth.BluetoothAdapter;
import android.content.Context;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.content.res.Resources;
import android.location.Address;
import android.location.Geocoder;
import android.location.LocationManager;
import android.os.Build;
import android.provider.Settings;
import android.util.TypedValue;
import android.widget.Toast;

import com.baby.aircok.acbaby.common.geo.GeoTransPoint;

import java.io.IOException;
import java.util.List;
import java.util.Locale;

import static android.content.Context.LOCATION_SERVICE;

/**
 * Created by CHO on 2016. 10. 24..
 */

public class Util {
    private static double mLatitude;
    private static double mLongitude;
    private static int mGovPm25;

    public static void setLatitude(double latitude){
        mLatitude = latitude;
    }

    public static double getLatitude(){
        return mLatitude;
    }

    public static void setLongitude(double longitude){
        mLongitude = longitude;
    }

    public static double getLongitude(){
        return mLongitude;
    }

    public static void setGovPm25(int pm25) {
        mGovPm25 = pm25;
    }

    public static int getGovPm25(){
        return mGovPm25;
    }

    public static int getDpToPx(Context context, int dp) {
        Resources r = context. getResources();
        int px = (int)TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_DIP, dp, r.getDisplayMetrics());
        return px;
    }

    public static double getPxToDp(Context context, double dp){
        return dp * context.getResources().getDisplayMetrics().density;
    }

    public static  boolean isGps(Context context) {
        LocationManager lm = (LocationManager) context.getSystemService(LOCATION_SERVICE);
        if (lm.isProviderEnabled(LocationManager.GPS_PROVIDER)) {
            return true;

        }
        return false;
    }

    public static String getAddress(Context context, double lat, double lng) {
        Geocoder geocoder = new Geocoder(context, Locale.KOREA);
        List<Address> addressList;
        String currentLocationAddress = "";
        try {
            if (geocoder != null) {
                // 세번째 인수는 최대결과값인데 하나만 리턴받도록 설정했다
                addressList = geocoder.getFromLocation(lat, lng, 10);
                // 설정한 데이터로 주소가 리턴된 데이터가 있으면
                if (addressList != null && addressList.size() > 0) {
                    // 주소
                    Address addr = addressList.get(0);
                    currentLocationAddress = String.format("%s %s %s", addr.getLocality(), addr.getSubLocality(), addr.getThoroughfare());
                }
            }

        } catch (IOException e) {
            Toast.makeText(context, "주소취득 실패", Toast.LENGTH_LONG).show();
            e.printStackTrace();
        }
        return currentLocationAddress;
    }

    public static GeoTransPoint getLocation(Context context, String address) {
        Geocoder geocoder = new Geocoder(context);
        Address addr;
        GeoTransPoint point = new GeoTransPoint();
//        CoordPoint point = new CoordPoint();
        try {
            List<Address> listAddress = geocoder.getFromLocationName(address, 10);
            if (listAddress.size() > 0) { // 주소값이 존재 하면
                addr = listAddress.get(0); // Address형태로
                double latitude = addr.getLatitude();
                double longitude = addr.getLongitude();
                point.x = addr.getLongitude();
                point.y = addr.getLatitude();
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
        return point;
    }

    public static List<Address> getLocationList(Context context, String address) {
        Geocoder geocoder = new Geocoder(context);
        List<Address> listAddress = null;
        try {

            listAddress = geocoder.getFromLocationName(address, 100);
        } catch (IOException e) {
            e.printStackTrace();
        }
        return listAddress;
    }

    /**
     * 버전정보를 가져온다.
     * @param context
     * @return
     */
    public static String getVersion(Context context){
        PackageInfo pi = null;
        try {
            pi= context.getPackageManager().getPackageInfo(context.getPackageName(),0);
        } catch (PackageManager.NameNotFoundException e) {
            e.printStackTrace();
        }
        return pi.versionName;
    }

    /**
     * 단말 버전명 가져오기
     * @return
     */
    public static String getAndroidVersion(){
        return Build.VERSION.RELEASE;
    }

    /**
     * 안드로이드 iD가져오기
     * @param context
     * @return
     */
    public static String getAndroidID(Context context){
        String androiID="";
        return androiID = Settings.Secure.getString(context.getContentResolver(), Settings.Secure.ANDROID_ID);
    }

    public static String getPhoneName() {
        BluetoothAdapter myDevice = BluetoothAdapter.getDefaultAdapter();
        String deviceName = myDevice.getName();
        return deviceName;
    }

    public static int convertVersionToInt(String version) {
        if (version == null || version.length() == 0) {
            throw new IllegalArgumentException("version can not null or length 0:" + version);
        }
        String[] array = version.split("\\.");
        if (array.length != 3) {
            throw new IllegalArgumentException("version must be type that is \"##.##.##\": " + version);
        }
        for (String element : array) {
            if (!isDigit(element)) {
                throw new IllegalArgumentException("version element must be a number:" + version);
            }
        }
        return 0x010000 * Integer.parseInt(array[0]) + 0x000100 * Integer.parseInt(array[1]) + 0x000001 * Integer.parseInt(array[2]);
    }

    public static boolean isDigit(String value) {
        if (value == null || value.length() == 0) {
            throw new IllegalArgumentException("value can not null or length 0:" + value);
        }
        for (int i = 0; i < value.length(); i++) {
            if (!Character.isDigit(value.charAt(i))) {
                return false;
            }
        }
        return true;
    }
}
