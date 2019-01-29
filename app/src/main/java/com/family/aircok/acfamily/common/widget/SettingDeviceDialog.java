package com.family.aircok.acfamily.common.widget;

import android.app.Activity;
import android.app.Dialog;
import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothDevice;
import android.bluetooth.BluetoothManager;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.graphics.Color;
import android.graphics.drawable.ColorDrawable;
import android.net.Uri;
import android.os.Handler;
import android.os.ParcelUuid;
import android.provider.Settings;
import android.view.View;
import android.view.ViewGroup;
import android.view.Window;
import android.widget.AdapterView;
import android.widget.TextView;
import android.widget.ListView;

import com.family.aircok.acfamily.R;
import com.family.aircok.acfamily.common.C2BLEManager;
import com.family.aircok.acfamily.common.C2Preference;
import com.family.aircok.acfamily.common.LogUtil;
import com.family.aircok.acfamily.common.PermissionManager;
import com.family.aircok.acfamily.common.Util;
import com.family.aircok.acfamily.menu.setting.SettingDeviceListFragment;
import com.family.aircok.acfamily.menu.setting.SettingDeviceNoneFragment;

import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.HashMap;
import java.util.List;
import java.util.UUID;

import static com.family.aircok.acfamily.common.PermissionManager.REQUEST_CODE_ACCESS_FINE_LOCATION;

/**
 * Created by fmthead on 2018. 1. 26..
 */

public class SettingDeviceDialog extends Dialog {

    public interface Delegate {
        void onSelectedDevice(String deviceID, String deviceFID);
        void showAlert(String title, String message, int icon,
                              final String positive, String negative, final DialogInterface.OnClickListener listener);
        void progressStart();
        void progressStop();
    }

    private Context mContext;
    private TextView mMsg;
    private ListView mListView;
    private SettingDeviceDialog.Adapter_ mAdapter;
    private C2BLEManager mBLEManager;
    private Handler mHandler = new Handler();
    private HashMap<String, String> mDeviceMap = new HashMap<>();
    private boolean isConnect = false;
    private int selectedIndex = -1;
    private String deviceID = "";
    private String deviceFID = "";
    private PermissionManager permissionManager;
    private Delegate delegate;

    public SettingDeviceDialog(Context context) {
        super(context);
        mContext = context;
        setCanceledOnTouchOutside(true);
        requestWindowFeature(Window.FEATURE_NO_TITLE);
        getWindow().setBackgroundDrawable(new ColorDrawable(Color.TRANSPARENT));
        setContentView(R.layout.setting_device_dialog);

        mMsg = (TextView) findViewById(R.id.dialog_msg);
        mListView = (ListView) findViewById(R.id.list_view);

        mListView.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            @Override
            public void onItemClick(AdapterView<?> adapterView, View view, int i, long l) {
                selectedIndex = i;
                mAdapter.notifyDataSetChanged();
                ((TextView)findViewById(R.id.dialog_ok)).setTextColor(0xff1fc4ba);
            }
        });

        findViewById(R.id.dialog_ok).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                if (selectedIndex >= 0) {
                    C2Preference.setDevice(getContext(), (String)mAdapter.getItem(selectedIndex));
                    dismiss();
                    if (delegate != null) {
                        delegate.onSelectedDevice(deviceID, deviceFID);
                    }
                }
            }
        });

        findViewById(R.id.dialog_cancel).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                dismiss();
            }
        });
    }

    public void setDelegate(Delegate delegate) {
        this.delegate = delegate;
    }

    @Override
    public void show() {
        super.show();

        selectedIndex = -1;
        mBLEManager = new C2BLEManager(mContext);
        mAdapter = new SettingDeviceDialog.Adapter_();
        mListView.setAdapter(mAdapter);
        permissionManager = new PermissionManager(mContext);
        permissionManager.performPermission(mPermissionListener, PermissionManager.PERMISSIONS_LOCATION, REQUEST_CODE_ACCESS_FINE_LOCATION);
    }

    private void bluetoothEnable() {
        if (mBLEManager.isBleutoothOn()) {
            startScan();
        }
        else {
            if (delegate != null) {
                delegate.showAlert(mContext.getString(R.string.alert_ble_title), mContext.getString(R.string.alert_ble_message), R.drawable.icon_bluetooth, mContext.getString(R.string.common_ok),
                        mContext.getString(R.string.common_cancel), new DialogInterface.OnClickListener() {
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
    }

    private void startScan() {
        if (mBLEManager.isScanning()) {
            return;
        }
        if (delegate != null) {
            delegate.progressStart();
        }
        Handler handler = new Handler();
        handler.postDelayed(new Runnable() {
            @Override
            public void run() {
                mBLEManager.scanLeDevice(false, mLeScanCallback);
                if (!isConnect) {
                    if (delegate != null) {
                        delegate.progressStop();
                    }
                    mMsg.setVisibility(View.VISIBLE);
                    mListView.setVisibility(View.INVISIBLE);
                    if (!("").equals(C2Preference.getDevice(mContext))) {
                        mMsg.setText(R.string.setting_device_no_connect2);
                    } else {
                        mMsg.setText(R.string.setting_device_no_connect);
                    }
                }
            }
        }, 5000);


        mDeviceMap.clear();
        mAdapter.datas.removeAllElements();
        mAdapter.notifyDataSetChanged();
        mBLEManager.scanLeDevice(true, mLeScanCallback);
        isConnect = false;
    }

    private class Adapter_ extends CXAdapter {

        @Override
        public View getView(int position, View convertView, ViewGroup parent) {
            if (convertView == null) {
                convertView = View.inflate(mContext, R.layout.cell_device_list, null);
            }

            if (getItem(position) instanceof String) {
                String name = (String) getItem(position);
                TextView tv_device_name = (TextView) convertView.findViewById(R.id.tv_device_name);
                tv_device_name.setText(name);
                if (position == selectedIndex) {
                    convertView.setBackgroundColor(0x40000000);
                } else {
                    convertView.setBackgroundColor(0x00000000);
                }
//                baseView.findViewById(R.id.ceonnect_device_icon).setBackgroundResource(R.drawable.ic_aircok_on);
//                baseView.findViewById(R.id.no_device).setVisibility(View.GONE);
//                baseView.findViewById(R.id.ceonnect_device_comment).setVisibility(View.VISIBLE);
                isConnect = true;
                if (delegate != null) {
                    delegate.progressStop();
                }
            }
            return convertView;
        }
    }

    private BluetoothAdapter.LeScanCallback mLeScanCallback = new BluetoothAdapter.LeScanCallback() {
        @Override
        public void onLeScan(final BluetoothDevice device, final int rssi, final byte[] scanRecord) {
//            LogUtil.LOGE("mLeScanCallback");
            mHandler.post(new Runnable() {
                @Override
                public void run() {
                    String name = device.getName();
                    if (name != null) {
                        if (name.contains(C2BLEManager.C2_DEVICE_NAME)) {
                            LogUtil.LOGE("mLeScanCallback name : " + name);
                            LogUtil.LOGE("device.getAddress() name : " + device.getAddress());
                            LogUtil.LOGE("device.getUuids() name : " + device.getUuids());
                            deviceID = device.getName();
                            SettingDeviceListFragment.BleAdvertisedData badata = SettingDeviceListFragment.BleUtil.parseAdertisedData(scanRecord);
                            List<UUID> fid = badata.getUuids();
                            LogUtil.LOGE("fid : " + fid.toString());
                            try {
                                BluetoothManager bluetoothManager = (BluetoothManager) mContext.getSystemService(Context.BLUETOOTH_SERVICE);
                                BluetoothAdapter adapter = bluetoothManager.getAdapter();
                                Method getUuidsMethod = null;
                                getUuidsMethod = BluetoothAdapter.class.getDeclaredMethod("getUuids", null);
                                ParcelUuid[] uuids = (ParcelUuid[]) getUuidsMethod.invoke(adapter, null);
                                for (ParcelUuid uuid: uuids) {
                                    LogUtil.LOGE("UUID: " + uuid.getUuid());
                                    deviceFID = uuids[0].toString();
                                }

                            } catch (NoSuchMethodException e) {
                                e.printStackTrace();
                            } catch (InvocationTargetException e) {
                                e.printStackTrace();
                            } catch (IllegalAccessException e) {
                                e.printStackTrace();
                            }

                            if (!mDeviceMap.containsKey(name)) {
                                LogUtil.LOGE("mLeScanCallback___");
                                mDeviceMap.put(name, name);
                                mAdapter.datas.addElement(name);
                                mAdapter.notifyDataSetChanged();
                            }
                        }
                    }
                }
            });
        }
    };

    private PermissionManager.OnPermissionListener mPermissionListener = new PermissionManager.OnPermissionListener() {
        @Override
        public void onPermissionResult(int requestCode, boolean isPermission) {
            if (requestCode == REQUEST_CODE_ACCESS_FINE_LOCATION) {
                if (isPermission) {
                    LogUtil.LOGE("퍼미션 허용");
                    if (Util.isGps(mContext)) {
                        bluetoothEnable();
                    }
                    else {
                        if (delegate != null) {
                            delegate.showAlert(mContext.getString(R.string.alert_location_title), mContext.getString(R.string.alert_location_message), R.drawable.icon_pin, mContext.getString(R.string.common_ok),
                                    mContext.getString(R.string.common_cancel), new DialogInterface.OnClickListener() {
                                        @Override
                                        public void onClick(DialogInterface dialog, int which) {
                                            if (which == 0) {
                                                Intent intent = new Intent(Settings.ACTION_LOCATION_SOURCE_SETTINGS);
                                                mContext.startActivity(intent);
                                            }
                                        }
                                    });
                        }
                    }
                } else {
                    //TODO : PERMISSION OFF메세지
                    LogUtil.LOGE("퍼미션 거절");
                    if (delegate != null) {
                        delegate.showAlert(mContext.getString(R.string.alert_permission_title), mContext.getString(R.string.alert_permission_message), -1, mContext.getString(R.string.common_ok),
                                mContext.getString(R.string.common_cancel), new DialogInterface.OnClickListener() {
                                    @Override
                                    public void onClick(DialogInterface dialog, int which) {
                                        if (which == 0) {
                                            Intent intent = new Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS,
                                                    Uri.fromParts("package", mContext.getPackageName(), null));
                                            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                                            mContext.startActivity(intent);
                                        }
                                    }
                                });
                    }
                }
            }
        }
    };

}
