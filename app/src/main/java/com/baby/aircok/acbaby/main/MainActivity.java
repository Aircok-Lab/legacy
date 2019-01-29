package com.baby.aircok.acbaby.main;

import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothDevice;
import android.bluetooth.BluetoothGattService;
import android.content.BroadcastReceiver;
import android.content.ComponentName;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.ServiceConnection;
import android.graphics.Color;
import android.net.Uri;
import android.os.Bundle;
import android.os.IBinder;
import android.provider.Settings;
import android.support.v4.view.GravityCompat;
import android.support.v4.widget.DrawerLayout;
import android.text.TextUtils;
import android.view.View;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import com.baby.aircok.acbaby.BaseActivity;
import com.baby.aircok.acbaby.R;
import com.baby.aircok.acbaby.ble.C2BLEData;
import com.baby.aircok.acbaby.ble.C2Service;
import com.baby.aircok.acbaby.common.BackPressCloseHandler;
import com.baby.aircok.acbaby.common.C2BLEManager;
import com.baby.aircok.acbaby.common.C2Preference;
import com.baby.aircok.acbaby.common.C2Util;
import com.baby.aircok.acbaby.common.Config;
import com.baby.aircok.acbaby.common.LoginInfo;
import com.baby.aircok.acbaby.common.PermissionManager;
import com.baby.aircok.acbaby.common.Util;
import com.baby.aircok.acbaby.common.widget.CXSeekBar;
import com.baby.aircok.acbaby.common.widget.CircleStateView;
import com.baby.aircok.acbaby.menu.setting.SettingDeviceActivity;
import com.baby.aircok.acbaby.net.client.C2HTTPProcessor;
import com.baby.aircok.acbaby.net.transaction.ACTransaction;

import com.baby.aircok.acbaby.common.LogUtil;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.Timer;
import java.util.TimerTask;

import static android.icu.lang.UCharacter.GraphemeClusterBreak.L;
import static com.baby.aircok.acbaby.common.PermissionManager.REQUEST_CODE_ACCESS_FINE_LOCATION;
import static com.baby.aircok.acbaby.common.Util.isGps;

public class MainActivity extends BaseActivity {

    private static final int WRITE_TIMER = 2000;
    private DrawerLayout mDrawerLayout;
    private MainLocationFragment mLocationFragment;
    private MainBehaviorFragment mBehaviorFragment;
    private MenuFragment mMenuFragment;

    private C2Service mService;
    private C2BLEManager mBLEManager;
    private GattUpdateReceiver mGattUpdateReceiver = new GattUpdateReceiver();
    private BluetoothDevice mDevice;
    private C2BLEData mBleData;
    private boolean mConnected;
    private Timer mWriteTimer;
    private BackPressCloseHandler mBackPressCloseHandler;
    private boolean mActive = false;
    private TimerTask mTask;
    private Timer mTimer;

    private int mPM25 = 0, mPoint = 0, mState = 0;

    private PermissionManager.OnPermissionListener mPermissionListener = new PermissionManager.OnPermissionListener() {
        @Override
        public void onPermissionResult(int requestCode, boolean isPermission) {
            if (requestCode == REQUEST_CODE_ACCESS_FINE_LOCATION) {
                bluetoothEnable();
                if (isPermission) {
                    LogUtil.LOGE("퍼미션 허용");
                    if (!isGps(MainActivity.this)) {
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
                                                Uri.fromParts("package", getPackageName(), null));
                                        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                                        startActivity(intent);
                                    }
                                }
                            });
                }
            }
        }
    };

    private ServiceConnection mServiceConnection = new ServiceConnection() {
        @Override
        public void onServiceConnected(ComponentName name, IBinder service) {
            LogUtil.LOGE("onServiceConnected");
            mService = ((C2Service.C2ServiceBinder)service).getService();
        }

        @Override
        public void onServiceDisconnected(ComponentName name) {
            LogUtil.LOGE("onServiceDisconnected");
            mService = null;
            disconnect();
        }
    };

    private BluetoothAdapter.LeScanCallback mLeScanCallback = new BluetoothAdapter.LeScanCallback() {
        @Override
        public void onLeScan(BluetoothDevice device, int rssi, byte[] scanRecord) {
            String name = device.getName();
            LogUtil.LOGE("onLeScan : " + name);
            if (TextUtils.isEmpty(name)) {
                return;
            }
            if (!name.equals(C2Preference.getDevice(MainActivity.this))) {
                return;
            }
            if (mDevice != null) {
                return;
            }
            if (mService == null) {
                return;
            }
            LogUtil.LOGE("onLeScan ok: ");
            mDevice = device;
            mService.connectGatt(mDevice);
        }
    };

    public class GattUpdateReceiver extends BroadcastReceiver {
        @Override
        public void onReceive(Context context, Intent intent) {
            final String action = intent.getAction();
            if (C2Service.ACTION_GATT_CONNECTED.equals(action)) {
                LogUtil.LOGE("BroadcastReceiver ACTION_GATT_CONNECTED");
                mConnected = true;
                stopScan();
            } else if (C2Service.ACTION_GATT_DISCONNECTED.equals(action)) {
                LogUtil.LOGE("BroadcastReceiver ACTION_GATT_DISCONNECTED");
                disconnect();
                if (mActive) {
                    startScan();
                }
            } else if (C2Service.ACTION_GATT_SERVICES_DISCOVERED.equals(action)) {
                LogUtil.LOGE("BroadcastReceiver ACTION_GATT_SERVICES_DISCOVERED");
                if (mConnected) {
                    for (BluetoothGattService service : mService.getSupportedGattServices()) {
                        if (C2BLEData.isC2Service(service)) {
                            C2BLEData data = new C2BLEData(service);
                            mBleData = data;
                            break;
                        }
                    }
                    mService.setNotification(mBleData);
                    startWrite();
                }
            } else if (C2Service.ACTION_DATA_AVAILABLE.equals(action)) {
                String response = intent.getStringExtra(C2Service.EXTRA_DATA);
                if (!TextUtils.isEmpty(response)) {
                    response = response.trim();
                    LogUtil.LOGE("ACTION_DATA_AVAILABLE response : " + response);
                    if (response.contains("tp=1")) {
                        responseTp1(response);
                    }
                    else if (response.contains("tp=4")) {
                        responseTp4(response);
                    }
                }
            }
        }
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        setHeader(R.drawable.btn_nav_menu_selector, R.drawable.nav_logo, -1, -1);
        mBackPressCloseHandler = new BackPressCloseHandler(this);
        mDrawerLayout = (DrawerLayout) findViewById(R.id.layout_drawer);
        mBLEManager = new C2BLEManager(this);

        findViewById(R.id.btn_main_device_con).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
//                Intent intent = new Intent(MainActivity.this, TestActivity.class);
                Intent intent = new Intent(MainActivity.this, SettingDeviceActivity.class);
                startActivity(intent);
            }
        });
        //권한 설정
        getPermissionManager().performPermission(mPermissionListener, PermissionManager.PERMISSIONS_LOCATION, REQUEST_CODE_ACCESS_FINE_LOCATION);

        mLocationFragment = new MainLocationFragment();
        getSupportFragmentManager().beginTransaction().add(R.id.layout_main_location_container, mLocationFragment).commit();
        mBehaviorFragment = new MainBehaviorFragment();
        getSupportFragmentManager().beginTransaction().add(R.id.layout_main_behavior_container, mBehaviorFragment).commit();
        getSupportFragmentManager().beginTransaction().hide(mBehaviorFragment).commit();
        mMenuFragment = new MenuFragment();
        getSupportFragmentManager().beginTransaction().add(R.id.layout_main_menu_container, mMenuFragment).commit();

        setBattery(0, false);
        setDustInfo(mPM25);
        if (TextUtils.isEmpty(C2Preference.getDevice(this))) {
            Toast toast = Toast.makeText(this, getString(R.string.common_not_device_message), Toast.LENGTH_LONG);
            toast.show();
        }
        requestPushToken();

        Intent intent = new Intent(this, C2Service.class);
        bindService(intent, mServiceConnection, Context.BIND_AUTO_CREATE);
        registeGattUpdateReceiver();
    }

    @Override
    protected void onResume() {
        super.onResume();
        setDustInfo(mPM25);
        mActive = true;
        startScan();
        startWrite();
    }

    @Override
    protected void onPause() {
        super.onPause();
        mActive = false;
        if (mTimer != null) {
            mTimer.cancel();
            mTimer = null;
            LogUtil.LOGE("onPause measure timer");
        }
        stopWrite();
        stopScan();
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        unRegisteGattUpdateReceiver();
        unbindService(mServiceConnection);
        if (mTimer != null) {
            mTimer.cancel();
            mTimer = null;
            LogUtil.LOGE("onDestroy measure timer");
        }
    }

    @Override
    public void onBackPressed() {
        LogUtil.LOGE("onBackPressed");
        if (!mDrawerLayout.isDrawerOpen(GravityCompat.START) && mBehaviorFragment.isVisible()) {
            LogUtil.LOGE("onBackPressed Visible");
            hideBehavior();
        }
        else {
            mBackPressCloseHandler.onBackPressed();
        }
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        if (requestCode == C2BLEManager.REQUEST_CODE_BLUETOOTH_ENABLE) {
            mBLEManager.onActivityResult(requestCode, resultCode, data);
        }
        else {
            super.onActivityResult(requestCode, resultCode, data);
        }
    }

    @Override
    public void onClickLeftMenu(View view) {
        mDrawerLayout.openDrawer(GravityCompat.START);
    }

    public DrawerLayout getDrawerLayout() {
        return mDrawerLayout;
    }

    public void showBehavior() {
        getSupportFragmentManager().beginTransaction().show(mBehaviorFragment).commit();
        mBehaviorFragment.setPM25(mPM25);
    }

    public void hideBehavior() {
        getSupportFragmentManager().beginTransaction().hide(mBehaviorFragment).commit();
    }

    public void setCurrentLocation(String location) {
        TextView tv_main_location = (TextView) findViewById(R.id.tv_main_location);
        tv_main_location.setText(location);

        tv_main_location.setVisibility("".equals(location) ? View.INVISIBLE : View.VISIBLE);
    }

    private void registeGattUpdateReceiver() {
        if (mGattUpdateReceiver != null) {
            IntentFilter filter;
            filter = new IntentFilter();
            filter.addAction(C2Service.ACTION_GATT_CONNECTED);
            filter.addAction(C2Service.ACTION_GATT_DISCONNECTED);
            filter.addAction(C2Service.ACTION_GATT_SERVICES_DISCOVERED);
            filter.addAction(C2Service.ACTION_DATA_AVAILABLE);
            registerReceiver(mGattUpdateReceiver, filter);
        }
    }

    private void unRegisteGattUpdateReceiver() {
        if(mGattUpdateReceiver != null) unregisterReceiver(mGattUpdateReceiver);
    }

    private void startScan() {
        if (!getPermissionManager().isLocationPermision()) {
            return;
        }
        if (!isGps(this)) {
            return;
        }
        if (!mBLEManager.isBleutoothOn()) {
            return;
        }
        if (mBLEManager.isScanning()) {
            return;
        }
        if (TextUtils.isEmpty(C2Preference.getDevice(this))) {
            return;
        }
        if (mConnected) {
            return;
        }
        LogUtil.LOGE("startScan");
        mBLEManager.scanLeDevice(true, mLeScanCallback);
    }

    private void stopScan() {
        mBLEManager.scanLeDevice(false, mLeScanCallback);
    }

    private void startWrite() {
        mWriteTimer = new Timer();
        mWriteTimer.schedule(new TimerTask() {
            @Override
            public void run() {
                if (mService == null) {
                    return;
                }
                if (!mConnected) {
                    return;
                }
                requestTp1();
                stopWrite();
                startWrite();
            }
        }, WRITE_TIMER);
    }

    private void stopWrite() {
        if (mWriteTimer != null) {
            mWriteTimer.cancel();
            mWriteTimer = null;
        }
    }

    private void disconnect() {
        LogUtil.LOGE("disconnect");
        setBattery(0, false);
        setDustInfo(0);
        mDevice = null;
        mConnected = false;
        mService.close();
        if (mTimer != null){
            LogUtil.LOGE("mTimer disconnect");
            mTimer.cancel();
            mTimer = null;
        }
    }


    private void setDustInfo(int pm25) {
        mPM25 = pm25;
        LogUtil.LOGE("pm25 : " + pm25);

        ImageView iv_main_dust_bg = (ImageView) findViewById(R.id.iv_main_dust_bg);
        TextView tv_main_dust_point = (TextView) findViewById(R.id.tv_main_dust_point);
        TextView tv_main_dust_state = (TextView) findViewById(R.id.tv_main_dust_state);
        CXSeekBar seekbar = (CXSeekBar) findViewById(R.id.seekbar);
        Button btn_main_device_con = (Button) findViewById(R.id.btn_main_device_con);

        String device = C2Preference.getDevice(this);
        tv_main_dust_point.setVisibility(TextUtils.isEmpty(device) ? View.INVISIBLE : View.VISIBLE);
        tv_main_dust_state.setVisibility(TextUtils.isEmpty(device) ? View.INVISIBLE : View.VISIBLE);
        btn_main_device_con.setVisibility(TextUtils.isEmpty(device) ? View.VISIBLE : View.INVISIBLE);

        if (pm25 < 0) {
            return;
        }

        mPoint = C2Util.getTotalPoint(pm25);
        mState = C2Util.getDustState(mPoint);

        iv_main_dust_bg.setImageResource(C2Util.getDustBG(mState));
        tv_main_dust_point.setText(String.valueOf(mPoint));
        tv_main_dust_state.setText(C2Util.getDustStringId(mState));
        seekbar.setProgress(mPoint);


        mLocationFragment.setPM25(pm25);
        mBehaviorFragment.setPM25(pm25);
    }

    private void setBattery(int state, boolean isCharging) {
        View layout_battery = findViewById(R.id.layout_battery);

        if (state == 0) {
            layout_battery.setVisibility(View.GONE);
        }
        else {
            TextView tv_battery = (TextView) findViewById(R.id.tv_battery);
            CircleStateView state_battery = (CircleStateView) findViewById(R.id.state_battery);
            ImageView iv_battery_charging = (ImageView) findViewById(R.id.iv_battery_charging);

            layout_battery.setVisibility(View.VISIBLE);
            iv_battery_charging.setVisibility(isCharging ? View.VISIBLE : View.GONE);
            tv_battery.setText(String.format("%d%S", state, "%"));
            state_battery.setOutLine(Util.getDpToPx(this, 1), Color.WHITE);
            state_battery.setFillColor(Color.TRANSPARENT);
            state_battery.setProgressColor(Color.WHITE);
            state_battery.setProgress(state);
            state_battery.invalidate();
        }
    }

    private void bluetoothEnable() {
        if (mBLEManager.isBleutoothOn()) {
            startScan();
        }
        else {
            showAlert(getString(R.string.alert_ble_title), getString(R.string.alert_ble_message), R.drawable.icon_bluetooth, getString(R.string.common_ok),
                    getString(R.string.common_cancel), new DialogInterface.OnClickListener() {
                        @Override
                        public void onClick(DialogInterface dialog, int which) {
                            if (which == 0) {
                                mBLEManager.bluetoothEnable(new C2BLEManager.OnBluetoothEnableListener() {
                                    @Override
                                    public void onBluetoothEnableResult(boolean enable) {
                                        LogUtil.LOGE("onBluetoothEnableResult : " + enable);
                                        if (enable) {
                                            startScan();
                                        }
                                        else {
                                            //TODO : 블루투스 거절 메세지
                                            LogUtil.LOGE("블루투스 거절");
                                        }
                                    }
                                });
                            }
                        }
                    });
        }
    }

    private void requestTp1() {
        if (mBleData == null) {
            return;
        }
        if (mService == null) {
            return;
        }
        LogUtil.LOGE("requestTp1");
        String msg = "tp=1";
        mBleData.getWrite().setValue(msg.getBytes());
        mService.write(mBleData);
    }

    private void responseTp1(String value) {
        requestTp4();
        String pm25string = value.replace("tp=1|PM25=", "");
        LogUtil.LOGE("responseTp1 : " + pm25string);
        if (!TextUtils.isEmpty(pm25string)) {
            if (TextUtils.isDigitsOnly(pm25string)) {
                int pm25 = Integer.parseInt(pm25string);
                setDustInfo(pm25);
                if (mTimer == null) {
                    LogUtil.LOGE("start measure timer");
                    mTimer = new Timer();
                    mTask = new TimerTask() {
                        @Override
                        public void run() {
                            sendMeasureData(mPM25, mPoint, mState);
                        }
                    };
                    mTimer.schedule(mTask, 5000, 3000 * 10);
                }
            }
        }
    }

    private void requestTp4() {
        if (mBleData == null) {
            return;
        }
        if (mService == null) {
            return;
        }
        LogUtil.LOGE("requestTp4");
        String msg = "tp=4";
        mBleData.getWrite().setValue(msg.getBytes());
        mService.write(mBleData);
    }

    private void responseTp4(String value) {
        LogUtil.LOGE("responseTp2 : " + value);
        String battery = "";
        boolean charging = false;
        if (value.contains("tp=4|vb=")) {
            battery = value.replace("tp=4|vb=", "");
            charging = false;
        }
        else if (value.contains("tp=4|vc=")) {
            battery = value.replace("tp=4|vc=", "");
            charging = true;
        }
        if (!TextUtils.isEmpty(battery)) {
            if (TextUtils.isDigitsOnly(battery)) {
                int b = Integer.parseInt(battery);
                setBattery(b, charging);
            }
        }
    }

    private void sendMeasureData(int pm25, int point, int state) {
        LogUtil.LOGE("sendMeasureData aircok_id: " + C2Preference.getDevice(this));
        LogUtil.LOGE("sendMeasureData addr: " + Util.getAddress(this, Util.getLatitude(), Util.getLongitude()));
        LogUtil.LOGE("sendMeasureData Util.getLatitude(): " + Util.getLatitude());
        LogUtil.LOGE("sendMeasureData Util.getLongitude(): " + Util.getLongitude());
        LogUtil.LOGE("sendMeasureData pm25: " + pm25 + " point: " + point + " state: " + state);

        String m_text = "";
        if (state == 0) {
            m_text = "좋음";
        } else if (state == 1) {
            m_text = "보통";
        } else if (state == 2) {
            m_text = "민감";
        } else if (state == 3) {
            m_text = "나쁨";
        } else if (state == 4) {
            m_text = "매우 나쁨";
        }

        ACTransaction tr = new ACTransaction(this, "measure");
        tr.setConnectionURL(Config.SERVER_URL);
        tr.setRequest("user_id", LoginInfo.getInstance().user_id);
        tr.setRequest("email", C2Preference.getLoginID(this));
        tr.setRequest("aircok_id", C2Preference.getDevice(this));
        tr.setRequest("aircok_type", "baby");
        tr.setRequest("pm25", pm25);
        tr.setRequest("gov_pm", Util.getGovPm25());
        tr.setRequest("m_index", point);
        tr.setRequest("m_age", 3);
        tr.setRequest("m_text", m_text);

        JSONObject location = new JSONObject();
        try {
            String addr = Util.getAddress(this, Util.getLatitude(), Util.getLongitude()).trim();
            location.put("address", addr);
            JSONArray coordinate = new JSONArray();
            coordinate.put(Util.getLatitude());
            coordinate.put(Util.getLongitude());
            location.put("coordinate", coordinate);
            location.put("country", "대한민국");

            String[] address = addr.split(" ");
            for (int i = 0 ; i < address.length; i++){
                LogUtil.LOGE("sendMeasureData address split[" + i + "]: " + address[i]);
                if (null != address[i]) {
                    if (i == 0)
                        location.put("locality", address[0]);
                    if (i == 1)
                        location.put("sublocality_lv1", address[1]);
                    if (i == 2)
                        location.put("sublocality_lv2", address[2]);
                    if (i == 3)
                        location.put("political", address[3]);
                }
            }
        } catch (JSONException e) {
            e.printStackTrace();
        }
        tr.setRequest("location", location);
        C2HTTPProcessor.getInstance().sendToBLServer(tr);
    }

    private void requestPushToken () {
        if (C2Preference.getPushToken(this) == null)
            return;

        ACTransaction tr = new ACTransaction(this, "pushstring");
        tr.setConnectionURL(Config.SERVER_URL);
        tr.setRequest("user_id", LoginInfo.getInstance().user_id);
        tr.setRequest("email", C2Preference.getLoginID(this));
        tr.setRequest("push_on", LoginInfo.getInstance().push_on);
        tr.setRequest("push_token", C2Preference.getPushToken(this));
        C2HTTPProcessor.getInstance().sendToBLServer(tr);
    }
}