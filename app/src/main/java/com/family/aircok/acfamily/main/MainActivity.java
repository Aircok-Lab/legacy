package com.family.aircok.acfamily.main;

import android.Manifest;
import android.app.Activity;
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
import android.content.pm.PackageManager;
import android.graphics.Bitmap;
import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.IBinder;
import android.provider.Settings;
import android.support.v4.app.ActivityCompat;
import android.support.v4.view.GravityCompat;
import android.support.v4.widget.DrawerLayout;
import android.text.TextUtils;
import android.view.View;
import android.view.ViewGroup;
import android.view.ViewTreeObserver;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.ScrollView;
import android.widget.TextView;
import android.widget.Toast;

import com.family.aircok.acfamily.BaseActivity;
import com.family.aircok.acfamily.R;
import com.family.aircok.acfamily.TestActivity;
import com.family.aircok.acfamily.ble.C2BLEData;
import com.family.aircok.acfamily.ble.C2Service;
import com.family.aircok.acfamily.common.C2BLEManager;
import com.family.aircok.acfamily.common.C2Preference;
import com.family.aircok.acfamily.common.C2Util;
import com.family.aircok.acfamily.common.Config;
import com.family.aircok.acfamily.common.LogUtil;
import com.family.aircok.acfamily.common.LoginInfo;
import com.family.aircok.acfamily.common.PermissionManager;
import com.family.aircok.acfamily.common.Util;
import com.family.aircok.acfamily.common.geo.GeoTrans;
import com.family.aircok.acfamily.common.geo.GeoTransPoint;
import com.family.aircok.acfamily.common.widget.ACChart;
import com.family.aircok.acfamily.common.widget.CXSeekBar;
import com.family.aircok.acfamily.common.widget.CircleChartView;
import com.family.aircok.acfamily.common.widget.CustomDialog;
import com.family.aircok.acfamily.common.widget.MainLineChartView;
import com.family.aircok.acfamily.common.widget.SettingDeviceDialog;
import com.family.aircok.acfamily.net.client.C2HTTPProcessor;
import com.family.aircok.acfamily.net.transaction.ACTransaction;
import com.family.aircok.acfamily.net.transaction.C2HTTPTransaction;
import com.family.aircok.acfamily.net.transaction.DATATransaction;

import net.cruxware.android.base.util.JSONUtil;
import net.cruxware.android.net.client.NetworkProcessor;
import net.cruxware.android.net.transaction.Transaction;
import net.cruxware.android.net.transaction.TransactionException;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Timer;
import java.util.TimerTask;

import static android.Manifest.permission.ACCESS_FINE_LOCATION;
import static com.family.aircok.acfamily.common.C2Util.DUST_STATE_0;
import static com.family.aircok.acfamily.common.C2Util.DUST_STATE_1;
import static com.family.aircok.acfamily.common.C2Util.DUST_STATE_2;
import static com.family.aircok.acfamily.common.C2Util.DUST_STATE_3;
import static com.family.aircok.acfamily.common.C2Util.DUST_STATE_4;
import static com.family.aircok.acfamily.common.PermissionManager.REQUEST_CODE_ACCESS_FINE_LOCATION;
import static com.family.aircok.acfamily.common.PermissionManager.REQUEST_CODE_WRITE_EXTERNAL_STORAGE;
import static com.family.aircok.acfamily.common.Util.getLocation;
import static com.family.aircok.acfamily.common.Util.isGps;

public class MainActivity extends BaseActivity implements KMAHelper.OnResponseListener, SettingDeviceDialog.Delegate {


    private static final String KEY_LOCATION = "location";
    private static final String KEY_STATION = "station";
    public static final String KEY_RESULT_DATA = "result_data";
    public static final String KEY_RESULT_ADDRESS_DATA = "result_address_data";
    public static final int REQUEST_CODE_LOCATION1 = 1220;
    public static final int REQUEST_CODE_LOCATION2 = 1221;
    public static final int REQUEST_CODE_LOCATION3 = 1222;
    private static final int WRITE_TIMER = 2000;

    private DrawerLayout mDrawerLayout;
    private MenuFragment mMenuFragment;
    private CircleChartView mChart;
    private Context mContext;
    private TextView mMainIndex, mMainComment, mMainstatus;
    private C2BLEManager mBLEManager;
    private C2BLEData mBleData;
    private C2Service mService;
    private GattUpdateReceiver mGattUpdateReceiver = new GattUpdateReceiver();
    private BluetoothDevice mDevice;
    private boolean mConnected;
    private Timer mWriteTimer;
    private MainLineChartView mPm10LineChart1, mPm25LineChart1, mPm10LineChart2, mPm25LineChart2, mPm10LineChart3, mPm25LineChart3;
    private TextView tvLocation1, tvLocation2, mPm10Point1, mPm25Point1, mPm10Point2, mPm25Point2, mPm10Point3, mPm25Point3, tvMainPm25;
    private String mLocation1;
    private String mLocation2;
    private String mLocation3;
    private String mStation1;
    private String mStation2;
    private String mStation3;
    private String addressData2;
    private String addressData3;

    private boolean isLocatin2Change = false;
    private boolean isLocatin3Change = false;
    private boolean isSetting = false;
    private boolean isGraphMore = false;
    private boolean mActive = false;
    private int mPM25 = 0, mGovPm = 0, mPoint = 0, mState = 0;
    private double latitude, longitude;
    private TimerTask mTask;
    private Timer mTimer;

    private LocationListener listener = new LocationListener() {
        @Override
        public void onLocationChanged(Location location) {
            stopUpdatingHeading();
            latitude = location.getLatitude();
            longitude = location.getLongitude();
            Util.setLatitude(latitude);
            Util.setLongitude(longitude);
            mLocation1 = Util.getAddress(mContext, latitude, longitude);
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
                bluetoothEnable();
                if (isPermission) {
                    LogUtil.LOGE("퍼미션 허용");
                    if (!Util.isGps(MainActivity.this)) {
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
                    } else {
                        startUpdatingLocation();
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
            } else if (requestCode == REQUEST_CODE_WRITE_EXTERNAL_STORAGE) {
                if (isPermission) {
                    LogUtil.LOGE("저장 퍼미션 허용");
                    View rootView = getWindow().getDecorView().findViewById(R.id.layout_drawer);
                    Bitmap screenShot = Util.takeScreenshot(rootView);
                    if (getPermissionManager().isStoragePermision()){
                        Util.saveBitmap(screenShot);
                        Util.shareIt(MainActivity.this);
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
//            LogUtil.LOGE("onLeScan : " + name);
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

        final ScrollView mainScroll = (ScrollView) findViewById(R.id.main_scroll);
        LinearLayout mainView = (LinearLayout) findViewById(R.id.main_view);
        mainScroll.getViewTreeObserver().addOnGlobalLayoutListener(new ViewTreeObserver.OnGlobalLayoutListener() {
            @Override
            public void onGlobalLayout() {
                int height = mainScroll.getHeight();
                View ll = findViewById(R.id.main_view);
                ViewGroup.LayoutParams layout = ll.getLayoutParams();
                layout.height = height;
                findViewById(R.id.main_view).setLayoutParams(layout);

                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.JELLY_BEAN) {
                    mainScroll.getViewTreeObserver().removeOnGlobalLayoutListener(this);
                } else {
                    mainScroll.getViewTreeObserver().removeGlobalOnLayoutListener(this);
                }
            }
        });

        mContext = this;
        mBLEManager = new C2BLEManager(this);
        getPermissionManager().performPermission(mPermissionListener, PermissionManager.PERMISSIONS_LOCATION, REQUEST_CODE_ACCESS_FINE_LOCATION);
        mDrawerLayout = (DrawerLayout) findViewById(R.id.layout_drawer);
        setNewHeader(-1, -2, -1, true, -1);

        CXSeekBar seekbar = (CXSeekBar) findViewById(R.id.seekbar);
        seekbar.setProgress(0, 0);

        mMainIndex = (TextView) findViewById(R.id.tv_main_index);
        mMainComment = (TextView) findViewById(R.id.tv_main_comment);
        mMainstatus = (TextView) findViewById(R.id.tv_dust_info_status);

        mChart = (CircleChartView) findViewById(R.id.circle_chart);

        mPm10LineChart1 = (MainLineChartView) findViewById(R.id.pm10_linchart1);
        mPm25LineChart1 = (MainLineChartView) findViewById(R.id.pm25_linchart1);

        mPm10LineChart2 = (MainLineChartView) findViewById(R.id.pm10_linchart2);
        mPm25LineChart2 = (MainLineChartView) findViewById(R.id.pm25_linchart2);

        mPm10LineChart3 = (MainLineChartView) findViewById(R.id.pm10_linchart3);
        mPm25LineChart3 = (MainLineChartView) findViewById(R.id.pm25_linchart3);

        tvLocation1 = (TextView) findViewById(R.id.tv_location1);
        tvLocation2 = (TextView) findViewById(R.id.tv_location2);

        mPm10Point1 = (TextView) findViewById(R.id.tv_chart_pm10);
        mPm25Point1 = (TextView) findViewById(R.id.tv_chart_pm25);

        mPm10Point2 = (TextView) findViewById(R.id.tv_chart_pm10_2);
        mPm25Point2 = (TextView) findViewById(R.id.tv_chart_pm25_2);

        mPm10Point3 = (TextView) findViewById(R.id.tv_chart_pm10_3);
        mPm25Point3 = (TextView) findViewById(R.id.tv_chart_pm25_3);

        tvMainPm25 = (TextView) findViewById(R.id.tv_pm25_index);

        View header = findViewById(R.id.layout_header);
        header.findViewById(R.id.btn_nav_share).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                LogUtil.LOGE("start share screenShot");
                getPermissionManager().performPermission(mPermissionListener, PermissionManager.PERMISSIONS_STORAGE, REQUEST_CODE_WRITE_EXTERNAL_STORAGE);
            }
        });

        init();
        initStaion();
        requestPushToken();

        //실외데이터 삭제 on/off 버튼
        findViewById(R.id.btn_data_setting).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if (!isSetting) {
                    findViewById(R.id.btn_data_setting).setVisibility(View.INVISIBLE);
                    findViewById(R.id.tv_data_setting).setVisibility(View.VISIBLE);
                    findViewById(R.id.btn_data_refresh).setVisibility(View.GONE);

                    JSONObject location2 = LoginInfo.getInstance().favorite1;
                    if (location2 != null) {
                        findViewById(R.id.btn_location1_delete).setVisibility(View.VISIBLE);
                    }

                    JSONObject location3 = LoginInfo.getInstance().favorite2;
                    if (location3 != null) {
                        findViewById(R.id.btn_location2_delete).setVisibility(View.VISIBLE);
                    }

                    isSetting = true;
                }
            }
        });

        //실외데이터 삭제 완료 버튼
        findViewById(R.id.tv_data_setting).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if (isSetting) {
                    findViewById(R.id.btn_data_setting).setVisibility(View.VISIBLE);
                    findViewById(R.id.btn_data_refresh).setVisibility(View.VISIBLE);
                    findViewById(R.id.tv_data_setting).setVisibility(View.INVISIBLE);
                    findViewById(R.id.btn_location1_delete).setVisibility(View.INVISIBLE);
                    findViewById(R.id.btn_location2_delete).setVisibility(View.INVISIBLE);
                    isSetting = false;
                }
            }
        });

        //관심지역1 추가 버튼
        findViewById(R.id.add_area1).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(MainActivity.this, MainLocationSearchActivity.class);
                startActivityForResult(intent, REQUEST_CODE_LOCATION2);
            }
        });

        //관심지역2 추가 버튼
        findViewById(R.id.add_area2).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(MainActivity.this, MainLocationSearchActivity.class);
                startActivityForResult(intent, REQUEST_CODE_LOCATION3);
            }
        });

        //관심지역1 삭제
        findViewById(R.id.btn_location1_delete).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                showAlert(getString(R.string.alert_location_delete_title), getString(R.string.alert_location_delete_message), -1, getString(R.string.common_ok), getString(R.string.common_cancel), new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialog, int which) {
                        if (which == 0) {
                            sendFavoriteLoaction("1", 0 , null, "", "D");
                            mLocation2 = "";
                            findViewById(R.id.location1).setVisibility(View.INVISIBLE);
                            findViewById(R.id.add_area1).setVisibility(View.VISIBLE);
                            findViewById(R.id.btn_location1_delete).setVisibility(View.INVISIBLE);
                            tvLocation1.setText("");
                        }
                    }
                });
            }
        });

        //관심지역2 삭제
        findViewById(R.id.btn_location2_delete).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                showAlert(getString(R.string.alert_location_delete_title), getString(R.string.alert_location_delete_message), -1, getString(R.string.common_ok), getString(R.string.common_cancel), new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialog, int which) {
                        if (which == 0) {
                            sendFavoriteLoaction("2", 0 , null, "", "D");
                            mLocation2 = "";
                            findViewById(R.id.location2).setVisibility(View.INVISIBLE);
                            findViewById(R.id.add_area2).setVisibility(View.VISIBLE);
                            findViewById(R.id.btn_location2_delete).setVisibility(View.INVISIBLE);
                            tvLocation2.setText("");
                        }
                    }
                });
            }
        });

        //실외데이터 refresh
        findViewById(R.id.btn_data_refresh).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                startUpdatingLocation();
                JSONObject location2 = LoginInfo.getInstance().favorite1;
                if (location2 != null) {
                    mStation2 = location2.optString("station");
                    requestGETMSRSTNACCTORLTMMESUREDNSTY(REQUEST_CODE_LOCATION2, mStation2);
                }

                JSONObject location3 = LoginInfo.getInstance().favorite2;
                if (location3 != null) {
                    mStation3 = location3.optString("station");
                    requestGETMSRSTNACCTORLTMMESUREDNSTY(REQUEST_CODE_LOCATION3, mStation3);
                }

            }
        });

        findViewById(R.id.btn_graph_more).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if (isGraphMore) {
                    showGraphMore(0);
                    isGraphMore = false;
                } else {
                    showGraphMore(1);
                    isGraphMore = true;
                }
            }
        });

        findViewById(R.id.location).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if (isGraphMore) {
                    requestGETMSRSTNACCTORLTMMESUREDNSTYStatistics(mStation1);
                }
            }
        });

        findViewById(R.id.location1).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if (isGraphMore) {
                    JSONObject location = LoginInfo.getInstance().favorite1;
                    if (location != null) {
                        initStaion();
                        requestGETMSRSTNACCTORLTMMESUREDNSTYStatistics(mStation2);
                    }
                }
            }
        });

        findViewById(R.id.location2).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if (isGraphMore) {
                    JSONObject location = LoginInfo.getInstance().favorite2;
                    if (location != null) {
                        initStaion();
                        requestGETMSRSTNACCTORLTMMESUREDNSTYStatistics(mStation3);
                    }
                }

            }
        });

        findViewById(R.id.btn_).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
//                setDustInfo(40);
                startActivity(new Intent(MainActivity.this, TestActivity.class));
            }
        });

        mMenuFragment = new MenuFragment();
        getSupportFragmentManager().beginTransaction().add(R.id.layout_main_menu_container, mMenuFragment).commit();

        LogUtil.LOGE("C2Preference.getDevice(this): " + C2Preference.getDevice(this));
        if (TextUtils.isEmpty(C2Preference.getDevice(this))) {
            Toast toast = Toast.makeText(this, getString(R.string.common_not_device_message), Toast.LENGTH_LONG);
            toast.show();
        }

        Intent intent = new Intent(this, C2Service.class);
        bindService(intent, mServiceConnection, Context.BIND_AUTO_CREATE);
        registeGattUpdateReceiver();
    }

    private void init() {
        isSetting = false;
        isGraphMore = false;
        findViewById(R.id.btn_data_setting).setVisibility(View.VISIBLE);
        findViewById(R.id.tv_data_setting).setVisibility(View.INVISIBLE);
        findViewById(R.id.btn_location1_delete).setVisibility(View.INVISIBLE);
        findViewById(R.id.btn_location2_delete).setVisibility(View.INVISIBLE);
        showGraphMore(0);
    }

    private void initStaion() {
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

            findViewById(R.id.location1).setVisibility(View.VISIBLE);
            findViewById(R.id.add_area1).setVisibility(View.GONE);
            tvLocation1.setText(mLocation2);

        } else {
            findViewById(R.id.location1).setVisibility(View.INVISIBLE);
            findViewById(R.id.add_area1).setVisibility(View.VISIBLE);
            tvLocation1.setText("");
        }

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

            findViewById(R.id.location2).setVisibility(View.VISIBLE);
            findViewById(R.id.add_area2).setVisibility(View.GONE);
            tvLocation2.setText(mLocation3);

        } else {
            findViewById(R.id.location2).setVisibility(View.INVISIBLE);
            findViewById(R.id.add_area2).setVisibility(View.VISIBLE);
            tvLocation2.setText("");
        }
    }

    @Override
    protected void onResume() {
        super.onResume();
        if (!("").equals(C2Preference.getDevice(mContext))) {
            setDustInfo(mPM25);
        } else {
            setDustInfo(-1);
        }
        mActive = true;
        init();
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
            LogUtil.LOGE("cancel measure timer");
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
            LogUtil.LOGE("cancel measure timer");
        }
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

    private void showGraphMore(int index) {
        if (index == 0) {
            findViewById(R.id.graph_more_lay).setVisibility(View.GONE);
            findViewById(R.id.btn_graph_more).setBackgroundResource(R.drawable.btn_graph_more_n);
        } else if (index == 1) {
            findViewById(R.id.graph_more_lay).setVisibility(View.VISIBLE);
            findViewById(R.id.btn_graph_more).setBackgroundResource(R.drawable.btn_graph_more_p);
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
            String currentDateandDay = sdf.format(new Date());
            LogUtil.LOGE("currentDateandDay: " + currentDateandDay);

            requestGETMINUDUSTFRCSTDSPTH(currentDateandDay);

            requestGETMSRSTNACCTORLTMMESUREDNSTYStatistics(mStation1);
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
        int code = tr.getResponse().optInt("code");
        JSONArray list = tr.getResponse().optJSONArray("list");
        final JSONObject item = list.optJSONObject(0);
        LogUtil.LOGE("responseGETMSRSTNACCTORLTMMESUREDNSTY: " + list);

        if (code == REQUEST_CODE_LOCATION2) {
            JSONUtil.putSafe(item, "stationName", mStation2);
            setLocationView(0, item);
        }
        else if (code == REQUEST_CODE_LOCATION3) {
            JSONUtil.putSafe(item, "stationName", mStation3);
            setLocationView(1, item);
        }

    }

    private void requestGETMINUDUSTFRCSTDSPTH(String searchDate) {
        LogUtil.LOGE("requestGETMSRSTNACCTOLASTDCSNDNSTY");
        String connectionURL = String.format("%s", C2HTTPTransaction.C2_CONNECTION_URL_GETMINUDUSTFRCSTDSPTH);
        DATATransaction tr = new DATATransaction(this, "getMinuDustFrcstDspth");
        tr.setConnectionURL(connectionURL);
        tr.setValue("searchDate", searchDate);
        tr.setValue("numOfRows", 10);
        tr.setValue("pageNo", 1);
        tr.setValue("InformCode", "PM25");
        tr.setValue("_returnType", "json");
        tr.setValue("ServiceKey", DATATransaction.SERVICE_KEY);
        C2HTTPProcessor.getInstance().sendToBLServer(tr);
    }

    private void responseGETMINUDUSTFRCSTDSPTH(C2HTTPTransaction tr) {
        try {
            JSONArray forecastList = tr.getResponse().optJSONArray("list");
            JSONObject object = forecastList.optJSONObject(0);
            String informCause = object.optString("informCause");
            String informOverall = object.optString("informOverall");

            informCause = informCause.replace("[", "");
            informCause = informCause.replace("미세먼지", "");
            informCause = informCause.replace("]", "");

            LogUtil.LOGE("=======================================================");
            LogUtil.LOGE("informCause : " + informCause);
            LogUtil.LOGE("informOverall : " + informOverall);

            TextView tv_forecast = (TextView) findViewById(R.id.forecast);
            tv_forecast.setText(informCause);
        } catch (Exception e) {
        }
    }

    private void requestGETMSRSTNACCTORLTMMESUREDNSTYStatistics(String stationName) {
        LogUtil.LOGE("requestGETMSRSTNACCTORLTMMESUREDNSTYStatistics");
        String connectionURL = String.format("%s", C2HTTPTransaction.C2_CONNECTION_URL_GETMSRSTNACCTORLTMMESUREDNSTY);
        DATATransaction tr = new DATATransaction(this, "getStatistics");
        tr.setConnectionURL(connectionURL);
        tr.setValue("stationName", stationName);
        tr.setValue("dataTerm", "DAILY");
        tr.setValue("ver", "1.3");
        tr.setValue("numOfRows", 25);
        tr.setValue("pageNo", 1);
        tr.setValue("_returnType", "json");
        tr.setValue("ServiceKey", DATATransaction.SERVICE_KEY);
        C2HTTPProcessor.getInstance().sendToBLServer(tr);
    }

    private void responseGETMSRSTNACCTORLTMMESUREDNSTYStatistics(C2HTTPTransaction tr) {
        if (null == tr.getResponse().optJSONArray("list")) {
            CustomDialog dialog = new CustomDialog(this);
            dialog.setTitle(getString(R.string.dialog_title_0));
            dialog.setIcon(-1);
            dialog.setBtn(-1);
            dialog.setMsg(getString(R.string.dialog_msg_8));
            dialog.show();
            return;
        }
        LogUtil.LOGE("list size: " + tr.getResponse().optJSONArray("list").length());

        ACChart acchart_20_today = (ACChart)findViewById(R.id.acchart_20_today);
        acchart_20_today.setData(true, ACChart.TODAY, tr.getResponse().optJSONArray("list"));

        ACChart acchart_20_yesterday = (ACChart)findViewById(R.id.acchart_20_yesterday);
        acchart_20_yesterday.setData(true, ACChart.YESTERDAY, tr.getResponse().optJSONArray("list"));
    }

    private void responseKMAHeler(int code, JSONObject data) {
        if (data != null) {
            LogUtil.LOGE("responseKMAHeler data : " + data.toString());
            if (code == REQUEST_CODE_LOCATION1) {
                int pm25 = data.optInt("pm25Value");
                int pm10 = data.optInt("pm10Value");
                mStation1 = data.optString("stationName");
                mGovPm = pm25;
                LogUtil.LOGE("pm25: " + pm25 + " pm10: " + pm10);
                View header = findViewById(R.id.layout_header);
                TextView tv_main_location = (TextView) header.findViewById(R.id.postion_text);
                tv_main_location.setText(mLocation1);

                mPm10Point1.setText(String.valueOf(pm10));
                mPm10LineChart1.setPM10Value(pm10);
                mPm10LineChart1.invalidate();

                mPm25Point1.setText(String.valueOf(pm25));
                mPm25LineChart1.setPM25Value(pm25);
                mPm25LineChart1.invalidate();

            }
            else if (code == REQUEST_CODE_LOCATION2) {
                setLocationView(0, data);
            }
            else if (code == REQUEST_CODE_LOCATION3) {
                setLocationView(1, data);
            }
        }
    }

    private void setLocationView(int location, JSONObject data) {
        LogUtil.LOGE("setLocationView data: " + data);

        if (data == null)
            return;

        int pm25 = data.optInt("pm25Value");
        int pm10 = data.optInt("pm10Value");
        String stationName = data.optString("stationName");
        if (!TextUtils.isDigitsOnly(String.valueOf(pm25))) {
            pm25 = 0;
        }
        if (!TextUtils.isDigitsOnly(String.valueOf(pm10))) {
            pm10 = 0;
        }

        int code = data.optInt("code");
        LogUtil.LOGE("setLocationView code: " + code);

        if (location == 0) {
            LogUtil.LOGE("setLocationView REQUEST_CODE_LOCATION2 pm25: " + pm25 + " pm10: " + pm10);
            if (isLocatin2Change) {
                sendFavoriteLoaction("1", pm25, addressData2, stationName, "C");
            } else {
                sendFavoriteLoaction("1", pm25, addressData2, stationName, "M");
            }

            findViewById(R.id.location1).setVisibility(View.VISIBLE);
            findViewById(R.id.add_area1).setVisibility(View.GONE);
            tvLocation1.setText(mLocation2);

            mPm10Point2.setText(String.valueOf(pm10));
            mPm10LineChart2.setPM10Value(pm10);
            mPm10LineChart2.invalidate();

            mPm25Point2.setText(String.valueOf(pm25));
            mPm25LineChart2.setPM25Value(pm25);
            mPm25LineChart2.invalidate();

        } else if (location == 1) {
            LogUtil.LOGE("setLocationView REQUEST_CODE_LOCATION3 pm25: " + pm25 + " pm10: " + pm10);
            if (isLocatin3Change) {
                sendFavoriteLoaction("2", pm25, addressData3, stationName, "C");
            } else {
                sendFavoriteLoaction("2", pm25, addressData3, stationName, "M");
            }

            findViewById(R.id.location2).setVisibility(View.VISIBLE);
            findViewById(R.id.add_area2).setVisibility(View.GONE);
            tvLocation2.setText(mLocation3);

            mPm10Point3.setText(String.valueOf(pm10));
            mPm10LineChart3.setPM10Value(pm10);
            mPm10LineChart3.invalidate();

            mPm25Point3.setText(String.valueOf(pm25));
            mPm25LineChart3.setPM25Value(pm25);
            mPm25LineChart3.invalidate();
        }
    }

    @Override
    protected void onExceptionThrownOnUiThread(NetworkProcessor networkProcessor, TransactionException e) {
        super.onExceptionThrownOnUiThread(networkProcessor, e);
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
            else if (tr.getCode().equals("getMinuDustFrcstDspth")) {
                responseGETMINUDUSTFRCSTDSPTH(tr);
            }
            else if (tr.getCode().equals("getStatistics")) {
                responseGETMSRSTNACCTORLTMMESUREDNSTYStatistics(tr);
            }
        }
        if (transaction instanceof ACTransaction) {
            ACTransaction tr = (ACTransaction) transaction;
            if (tr.getCode().equals("favorite")) {
                reponseFavorite(tr);
            } else if (tr.getCode().equals("login")) {
                responseLogin(tr);
            } else if (tr.getCode().equals("aircok")){
                responseAircok(tr);
            }
        }
    }

    @Override
    public void onResponse(int code, boolean isSuccese, JSONObject data) {
        if (isSuccese) {
            responseKMAHeler(code, data);
        }
        else{
            showSingleDialog(getString(R.string.network_alert_title_error), getString(R.string.network_alert_message_error), -1, getString(R.string.common_ok), null, null);
        }
    }

    @Override
    public void onClickLeftMenu(View view) {
        mDrawerLayout.openDrawer(GravityCompat.START);
    }

    public DrawerLayout getDrawerLayout() {
        return mDrawerLayout;
    }

    private void requestKMAHeler(String location, int requestCode) {
        LogUtil.LOGE("requestKMAHeler location: " + location + " requestCode: " + requestCode);
//        progressStart();
        GeoTransPoint wgs = getLocation(mContext, location);
//        CoordPoint wgs = Util.getLocation(getContext(), location);
        GeoTransPoint tm = GeoTrans.convert(GeoTrans.GEO, GeoTrans.TM, wgs);
//        CoordPoint tm = TransCoord.getTransCoord(wgs, TransCoord.COORD_TYPE_WGS84, TransCoord.COORD_TYPE_TM);
        LogUtil.LOGE("x : " + tm.x);
        LogUtil.LOGE("y : " + tm.y);
        KMAHelper helper = new KMAHelper(String.valueOf(tm.x), String.valueOf(tm.y));
        helper.request(requestCode, this);
    }


    private void startUpdatingLocation() {
//        progressStart();
        LocationManager lm = (LocationManager) mContext.getSystemService(LOCATION_SERVICE);
        if (lm.isProviderEnabled(LocationManager.GPS_PROVIDER)) {
            LogUtil.LOGE(String.format("GPS 사용가능"));
            if (ActivityCompat.checkSelfPermission(mContext, ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED && ActivityCompat.checkSelfPermission(mContext, Manifest.permission.ACCESS_COARSE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
                return;
            }
            lm.requestLocationUpdates(LocationManager.GPS_PROVIDER, 0, 0, listener);
            lm.requestLocationUpdates(LocationManager.NETWORK_PROVIDER, 0, 0, listener);
//            LocationManager.
        }
    }

    private void stopUpdatingHeading() {
//        progressStop();
        LocationManager lm = (LocationManager) mContext.getSystemService(LOCATION_SERVICE);
        if (ActivityCompat.checkSelfPermission(mContext, ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED && ActivityCompat.checkSelfPermission(mContext, Manifest.permission.ACCESS_COARSE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
            return;
        }
        lm.removeUpdates(listener);
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
        setBattery(-1, false);
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
        LogUtil.LOGE("responseTp1 value: " + value);
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
        LogUtil.LOGE("responseTp4 : " + value);
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

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if  (data == null)
            return;

        if (resultCode == Activity.RESULT_OK) {
            String string = data.getExtras().getString(KEY_RESULT_DATA);
            try {
                JSONObject result_data = new JSONObject(string);
                LogUtil.LOGE("result_data: " + result_data);
                if (requestCode == REQUEST_CODE_LOCATION2) {
                    isLocatin2Change = true;
                    String addr = result_data.optString(MainLocationSearchActivity.KEY_ADDRESS);
                    mLocation2 = addr;
                    addressData2 = data.getExtras().getString(KEY_RESULT_ADDRESS_DATA);
                    requestKMAHeler(mLocation2, REQUEST_CODE_LOCATION2);
                }
                else if (requestCode == REQUEST_CODE_LOCATION3) {
                    isLocatin3Change = true;
                    String addr = result_data.optString(MainLocationSearchActivity.KEY_ADDRESS);
                    mLocation3 = addr;
                    addressData3 = data.getExtras().getString(KEY_RESULT_ADDRESS_DATA);
                    requestKMAHeler(mLocation3, REQUEST_CODE_LOCATION3);
                }
            } catch (JSONException e) {e.printStackTrace();}
        }
    }

    private void requestPushToken() {
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

    private void sendMeasureData(int pm25, int point, int state) {
        LogUtil.LOGE("sendMeasureData aircok_id: " + C2Preference.getDevice(this));
        LogUtil.LOGE("sendMeasureData addr: " + Util.getAddress(mContext, Util.getLatitude(), Util.getLongitude()));
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
        tr.setRequest("aircok_type", "family");
        tr.setRequest("pm25", pm25);
        tr.setRequest("gov_pm", mGovPm);
        tr.setRequest("m_index", point);
        tr.setRequest("m_age", 1);
        tr.setRequest("m_text", m_text);

        JSONObject location = new JSONObject();
        try {
            String addr = Util.getAddress(mContext, Util.getLatitude(), Util.getLongitude()).trim();
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

    private void sendFavoriteLoaction (String seq, int pm25, String address, String station, String flag) {
        LogUtil.LOGE("sendFavoriteLoaction seq: " + seq + " pm25: " + pm25 + " address: " + address);
        ACTransaction tr = new ACTransaction(this, "favorite");
        tr.setConnectionURL(Config.SERVER_URL);
        tr.setRequest("email", C2Preference.getLoginID(this));
        tr.setRequest("user_id", LoginInfo.getInstance().user_id);
        tr.setRequest("seq", seq);
        tr.setRequest("flag", flag);
        tr.setRequest("station", station);
        tr.setRequest("pm25", pm25);

        JSONObject locationJson = new JSONObject();
        try {
            if ("D".equals(flag)){
                locationJson.put("address", address);
                locationJson.put("country", null);
                locationJson.put("coordinate", null);
                locationJson.put("locality", null);
                locationJson.put("sublocality_lv1", null);
                locationJson.put("sublocality_lv2", null);
                locationJson.put("political", null);
            } else {
                locationJson.put("address", address);
                locationJson.put("country", "대한민국");
                String[] addAddress = address.split(",|\\(");
                GeoTransPoint point = Util.getLocation(this, addAddress[1]);
                JSONArray coordinate = new JSONArray();
                coordinate.put(point.getY());
                coordinate.put(point.getX());
                locationJson.put("coordinate", coordinate);
                String[] addr = C2Util.getAddAddress(address);
                locationJson.put("locality", addr[1]);
                locationJson.put("sublocality_lv1", addr[2]);
                locationJson.put("sublocality_lv2", addr[3]);
                locationJson.put("political", addr[4]);
            }
        } catch (JSONException e){
            e.printStackTrace();
        }
        tr.setRequest("location", locationJson);
        C2HTTPProcessor.getInstance().sendToBLServer(tr);
    }

    private void reponseFavorite(ACTransaction tr) {
        JSONObject respone = tr.getResponse();
        String result = respone.optString("result");
        if ("1".equals(result)) {
            requestLogin();
        }
    }

    private void requestLogin() {
        ACTransaction tr = new ACTransaction(this, "login");
        tr.setConnectionURL(Config.SERVER_URL);
        tr.setRequest("email", C2Preference.getLoginID(this));
        tr.setRequest("passwd", C2Preference.getLoginPW(this));
        tr.setRequest("regi_type", C2Preference.getLoginRegiType(this));
        C2HTTPProcessor.getInstance().sendToBLServer(tr);
    }

    private void responseLogin(ACTransaction tr) {
        String result = "";
        JSONObject respone = tr.getResponse();
        result = respone.optString("result");
        if ("1".equals(result)){
            LoginInfo.getInstance().load(respone);
        }
    }

    private void responseAircok(ACTransaction tr) {
        JSONObject respone = tr.getResponse();
        String result = "";
        result = respone.optString("result");
        if ("1".equals(result)){
            progressStop();
        }
        if (!("").equals(C2Preference.getDevice(mContext))) {
            setDustInfo(mPM25);
        } else {
            setDustInfo(-1);
        }
        mActive = true;
        init();
        startScan();
        startWrite();
    }

    private void setDustInfo(int pm25) {
        if (pm25 < 0) {
            mPM25 = 0;
            mPoint = 0;
            mState = DUST_STATE_0;
            findViewById(R.id.ll_no_device).setVisibility(View.VISIBLE);
            mDrawerLayout.setBackgroundResource(C2Util.getDustBG(DUST_STATE_0));
            findViewById(R.id.action_tips_a).setVisibility(View.VISIBLE);
            findViewById(R.id.action_tips_b).setVisibility(View.GONE);
            findViewById(R.id.action_tips_c).setVisibility(View.GONE);
            findViewById(R.id.action_tips_d).setVisibility(View.GONE);
            findViewById(R.id.action_tips_e).setVisibility(View.GONE);
            findViewById(R.id.tv_state_2).setVisibility(View.GONE);
            findViewById(R.id.tv_state_4).setVisibility(View.GONE);
            mMainIndex.setVisibility(View.INVISIBLE);
            mMainComment.setText(R.string.setting_device_no_connect);
            mMainstatus.setText(R.string.setting_device_no_connect);
            int circleColor = getResources().getColor(R.color.circle_chart_0);
            CXSeekBar seekbar = (CXSeekBar) findViewById(R.id.seekbar);
            seekbar.setProgress(0, 0);

            tvMainPm25.setVisibility(View.INVISIBLE);
            mChart.setProgress(0, pm25, circleColor);
            mChart.invalidate();
            return;
        }
        findViewById(R.id.ll_no_device).setVisibility(View.GONE);
        mMainIndex.setVisibility(View.VISIBLE);
        tvMainPm25.setVisibility(View.VISIBLE);

        mPM25 = pm25;
//        LogUtil.LOGE("pm25 : " + pm25);
//
//        ImageView iv_main_dust_bg = (ImageView) findViewById(R.id.layout_drawer);
//        TextView tv_main_dust_point = (TextView) findViewById(R.id.tv_main_dust_point);
//        TextView tv_main_dust_state = (TextView) findViewById(R.id.tv_main_dust_state);
        CXSeekBar seekbar = (CXSeekBar) findViewById(R.id.seekbar);
//        Button btn_main_device_con = (Button) findViewById(R.id.btn_main_device_con);
//
//        String device = C2Preference.getDevice(this);
//        tv_main_dust_point.setVisibility(TextUtils.isEmpty(device) ? View.INVISIBLE : View.VISIBLE);
//        tv_main_dust_state.setVisibility(TextUtils.isEmpty(device) ? View.INVISIBLE : View.VISIBLE);
//        btn_main_device_con.setVisibility(TextUtils.isEmpty(device) ? View.VISIBLE : View.INVISIBLE);
//
//        if (pm25 < 0) {
//            return;
//        }
//
        int point = C2Util.getTotalPoint(pm25);
        int state = C2Util.getDustState(point);

        mPoint = point;
        mState = state;

        LogUtil.LOGE("point: " + point);
        LogUtil.LOGE("state: " + state);

        mDrawerLayout.setBackgroundResource(C2Util.getDustBG(state));
        int circleColor = 0;
        switch (state) {
            case DUST_STATE_0 :
                findViewById(R.id.action_tips_a).setVisibility(View.VISIBLE);
                findViewById(R.id.action_tips_b).setVisibility(View.GONE);
                findViewById(R.id.action_tips_c).setVisibility(View.GONE);
                findViewById(R.id.action_tips_d).setVisibility(View.GONE);
                findViewById(R.id.action_tips_e).setVisibility(View.GONE);
                findViewById(R.id.tv_state_2).setVisibility(View.GONE);
                findViewById(R.id.tv_state_4).setVisibility(View.GONE);
                mMainIndex.setText(R.string.dust_state_0);
                mMainComment.setText(R.string.dust_state_comment_0);
                mMainstatus.setText(R.string.dust_status_0);
                circleColor = getResources().getColor(R.color.circle_chart_0);
                break;
            case DUST_STATE_1 :
                findViewById(R.id.action_tips_a).setVisibility(View.GONE);
                findViewById(R.id.action_tips_b).setVisibility(View.VISIBLE);
                findViewById(R.id.action_tips_c).setVisibility(View.GONE);
                findViewById(R.id.action_tips_d).setVisibility(View.GONE);
                findViewById(R.id.action_tips_e).setVisibility(View.GONE);
                findViewById(R.id.tv_state_2).setVisibility(View.GONE);
                findViewById(R.id.tv_state_4).setVisibility(View.GONE);
                mMainIndex.setText(R.string.dust_state_1);
                mMainComment.setText(R.string.dust_state_comment_1);
                mMainstatus.setText(R.string.dust_status_1);
                circleColor = getResources().getColor(R.color.circle_chart_1);
                break;
            case DUST_STATE_2 :
                findViewById(R.id.action_tips_a).setVisibility(View.GONE);
                findViewById(R.id.action_tips_b).setVisibility(View.GONE);
                findViewById(R.id.action_tips_c).setVisibility(View.VISIBLE);
                findViewById(R.id.action_tips_d).setVisibility(View.GONE);
                findViewById(R.id.action_tips_e).setVisibility(View.GONE);
                findViewById(R.id.tv_state_2).setVisibility(View.VISIBLE);
                findViewById(R.id.tv_state_4).setVisibility(View.GONE);
                mMainIndex.setText(R.string.dust_state_2);
                mMainComment.setText(R.string.dust_state_comment_2);
                mMainstatus.setText(R.string.dust_status_2);
                circleColor = getResources().getColor(R.color.circle_chart_2);
                break;
            case DUST_STATE_3 :
                findViewById(R.id.action_tips_a).setVisibility(View.GONE);
                findViewById(R.id.action_tips_b).setVisibility(View.GONE);
                findViewById(R.id.action_tips_c).setVisibility(View.GONE);
                findViewById(R.id.action_tips_d).setVisibility(View.VISIBLE);
                findViewById(R.id.action_tips_e).setVisibility(View.GONE);
                findViewById(R.id.tv_state_2).setVisibility(View.GONE);
                findViewById(R.id.tv_state_4).setVisibility(View.GONE);
                mMainIndex.setText(R.string.dust_state_3);
                mMainComment.setText(R.string.dust_state_comment_3);
                mMainstatus.setText(R.string.dust_status_3);
                circleColor = getResources().getColor(R.color.circle_chart_3);
                break;
            case DUST_STATE_4 :
                findViewById(R.id.action_tips_a).setVisibility(View.GONE);
                findViewById(R.id.action_tips_b).setVisibility(View.GONE);
                findViewById(R.id.action_tips_c).setVisibility(View.GONE);
                findViewById(R.id.action_tips_d).setVisibility(View.GONE);
                findViewById(R.id.action_tips_e).setVisibility(View.VISIBLE);
                findViewById(R.id.tv_state_2).setVisibility(View.GONE);
                findViewById(R.id.tv_state_4).setVisibility(View.VISIBLE);
                mMainIndex.setText(R.string.dust_state_3);
                mMainComment.setText(R.string.dust_state_comment_4);
                mMainstatus.setText(R.string.dust_status_4);
                circleColor = getResources().getColor(R.color.circle_chart_4);
                break;
        }

//        tv_main_dust_point.setText(String.valueOf(point));
//        tv_main_dust_state.setText(C2Util.getDustStringId(state));
        seekbar.setProgress(point, pm25);

        tvMainPm25.setText(getString(R.string.common_main_pm25) + " " + point);
        mChart.setProgress(point, pm25, circleColor);
        mChart.invalidate();

//        mLocationFragment.setPM25(pm25);
//        mBehaviorFragment.setPM25(pm25);
    }

    private void setBattery(int state, boolean isCharging) {
        LogUtil.LOGE("setBattery stats: " + state + "isCharging: " + isCharging );
        View header = findViewById(R.id.layout_header);
        ImageView batterry = (ImageView) header.findViewById(R.id.nav_batterry);
        header.findViewById(R.id.nav_batterry).setVisibility(View.VISIBLE);
        if (isCharging){
            header.findViewById(R.id.nav_charging_batterry).setVisibility(View.VISIBLE);
        } else {
            header.findViewById(R.id.nav_charging_batterry).setVisibility(View.INVISIBLE);
        }

        if (state == 100) {
            batterry.setImageResource(R.drawable.btn_nav_battery_100_n);
        } else if (state < 99 && state >= 61) {
            batterry.setImageResource(R.drawable.btn_nav_battery_75);
        } else if (state < 60 && state >= 31) {
            batterry.setImageResource(R.drawable.btn_nav_battery_50_n);
        } else if (state < 30 && state >= 1) {
            batterry.setImageResource(R.drawable.btn_nav_battery_25);
        } else if (state == 0) {
            header.findViewById(R.id.nav_batterry).setVisibility(View.INVISIBLE);
            header.findViewById(R.id.nav_charging_batterry).setVisibility(View.INVISIBLE);
        } else if (state == -1) {
            header.findViewById(R.id.nav_batterry).setVisibility(View.INVISIBLE);
            header.findViewById(R.id.nav_charging_batterry).setVisibility(View.INVISIBLE);
        }
    }

    public void onClickDeviceConnect(View v) {
        SettingDeviceDialog dialog = new SettingDeviceDialog(this);
        dialog.setDelegate(this);
        dialog.show();
    }

    public void onSelectedDevice(String deviceID, String deviceFID) {
        progressStart();
        ACTransaction tr = new ACTransaction(this, "aircok");
        tr.setConnectionURL(Config.SERVER_URL);
        tr.setRequest("user_id", LoginInfo.getInstance().user_id);
        tr.setRequest("email", C2Preference.getLoginID(this));
        tr.setRequest("aircok_id", deviceID);
        tr.setRequest("aircok_fid", deviceFID);
        tr.setRequest("aircok_type", "family");
        JSONObject location = new JSONObject();
        try {
            JSONArray coordinate = new JSONArray();
            coordinate.put(Util.getLatitude());
            coordinate.put(Util.getLongitude());
            String address = Util.getAddress(this, Util.getLatitude(), Util.getLongitude());
            location.put("address", address);
            location.put("coordinate", coordinate);
            location.put("country", "대한민국");

            String[] data = address.split(" ");
            for (int i = 0 ; i < data.length; i++){
                LogUtil.LOGE("address split: " + data[i]);
                if (null != data[i]) {
                    if (i == 0)
                        location.put("locality", data[0]);
                    if (i == 1)
                        location.put("sublocality_lv1", data[1]);
                    if (i == 2)
                        location.put("sublocality_lv2", data[2]);
                    if (i == 3)
                        location.put("political", data[3]);
                }
            }

        } catch (Exception e) {
            e.printStackTrace();
        }
        tr.setRequest("location", location);
        C2HTTPProcessor.getInstance().sendToBLServer(tr);
    }
}
