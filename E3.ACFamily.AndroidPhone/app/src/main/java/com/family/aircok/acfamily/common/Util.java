package com.family.aircok.acfamily.common;

import android.app.Activity;
import android.bluetooth.BluetoothAdapter;
import android.content.ActivityNotFoundException;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.content.res.Resources;
import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Rect;
import android.graphics.drawable.Drawable;
import android.location.Address;
import android.location.Geocoder;
import android.location.LocationManager;
import android.net.Uri;
import android.os.Build;
import android.os.Environment;
import android.provider.Settings;
import android.support.v4.app.ActivityCompat;
import android.util.Log;
import android.util.TypedValue;
import android.view.View;
import android.widget.Toast;


import com.family.aircok.acfamily.Manifest;
import com.family.aircok.acfamily.common.geo.GeoTransPoint;
import com.kakao.util.helper.FileUtils;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.FileWriter;
import java.io.IOException;
import java.io.OutputStream;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Locale;
import java.util.TimeZone;

import static android.content.Context.LOCATION_SERVICE;
import static com.facebook.FacebookSdk.getApplicationContext;
import static com.kakao.auth.StringSet.file;

/**
 * Created by CHO on 2016. 10. 24..
 */

public class Util {

    private static double mLatitude;
    private static double mLongitude;

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

    public static Bitmap takeScreenshot(View view) {
        View rootView = view;
        rootView.setDrawingCacheEnabled(true);
        rootView.buildDrawingCache();
        return rootView.getDrawingCache();
    }

    public static  void saveBitmap(Bitmap bitmap) {
        File imagePath = new File(Environment.getExternalStorageDirectory() + "/scrnshot.jpg"); ////File imagePath
        FileOutputStream fos;
        try {
            fos = new FileOutputStream(imagePath);
            bitmap.compress(Bitmap.CompressFormat.JPEG, 100, fos);
            fos.flush();
            fos.close();
        } catch (FileNotFoundException e) {
            Log.e("GREC", e.getMessage(), e);
        } catch (IOException e) {
            Log.e("GREC", e.getMessage(), e);
        }
    }

    public static  void shareIt(Context context) {
        Uri uri = Uri.fromFile(new File(Environment.getExternalStorageDirectory() + "/scrnshot.jpg"));
        Intent sharingIntent = new Intent(android.content.Intent.ACTION_SEND);
        sharingIntent.setType("image/*");
        sharingIntent.putExtra(android.content.Intent.EXTRA_TEXT, "http://www.aircok.com");
        sharingIntent.putExtra(Intent.EXTRA_STREAM, uri);

        context.startActivity(Intent.createChooser(sharingIntent, Config.sAppName ));
    }

    public static Bitmap takeScreenShot(Activity activity) {
        // View You need a screenshot. View
        View view = activity.getWindow().getDecorView();
        view.setDrawingCacheEnabled(true);
        view.buildDrawingCache();
        Bitmap b1 = view.getDrawingCache();
        //  Get the status bar height
        Rect frame = new Rect();
        activity.getWindow().getDecorView().getWindowVisibleDisplayFrame(frame);
        int statusBarHeight = frame.top;
        System.out.println(statusBarHeight);
        //  Get screen length and height
        int width = activity.getWindowManager().getDefaultDisplay().getWidth();
        int height = activity.getWindowManager().getDefaultDisplay()
                .getHeight();
        //  Remove the title bar
        // Bitmap b = Bitmap.createBitmap(b1, 0, 25, 320, 455);
        Bitmap b = Bitmap.createBitmap(b1, 0, statusBarHeight, width, height
                - statusBarHeight);
        view.destroyDrawingCache();
        return b;
    }

    public static Calendar getCalendarFromISO(String datestring) {
        Calendar calendar = Calendar.getInstance(TimeZone.getDefault(), Locale.getDefault()) ;
        SimpleDateFormat dateformat = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", Locale.getDefault());
        try {
            Date date = dateformat.parse(datestring);
            date.setHours(date.getHours() - 1);
            calendar.setTime(date);

        } catch (ParseException e) {
            e.printStackTrace();
        }

        return calendar;
    }

    public static Date iso8601Format(String formattedDate) throws ParseException {
        try {
            DateFormat df = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSSX", Locale.KOREA);
            return df.parse(formattedDate);
        } catch (IllegalArgumentException ex) {
            // error happen in Java 6: Unknown pattern character 'X'
            if (formattedDate.endsWith("Z")) formattedDate = formattedDate.replace("Z", "+0000");
            else formattedDate = formattedDate.replaceAll("([+-]\\d\\d):(\\d\\d)\\s*$", "$1$2");
            DateFormat df1 = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSSZ", Locale.KOREA);
            return df1.parse(formattedDate);
        }
    }

}
