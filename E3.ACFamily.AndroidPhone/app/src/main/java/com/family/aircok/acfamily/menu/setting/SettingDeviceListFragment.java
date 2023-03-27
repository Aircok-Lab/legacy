package com.family.aircok.acfamily.menu.setting;

import android.annotation.TargetApi;
import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothDevice;
import android.bluetooth.BluetoothManager;
import android.bluetooth.le.AdvertiseData;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Handler;
import android.os.ParcelUuid;
import android.provider.Settings;
import android.support.annotation.Nullable;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.AdapterView;
import android.widget.ListView;
import android.widget.TextView;


import com.family.aircok.acfamily.BaseFragment;
import com.family.aircok.acfamily.R;
import com.family.aircok.acfamily.common.C2BLEManager;
import com.family.aircok.acfamily.common.C2Preference;
import com.family.aircok.acfamily.common.Config;
import com.family.aircok.acfamily.common.LogUtil;
import com.family.aircok.acfamily.common.LoginInfo;
import com.family.aircok.acfamily.common.PermissionManager;
import com.family.aircok.acfamily.common.Util;
import com.family.aircok.acfamily.common.widget.CXAdapter;
import com.family.aircok.acfamily.main.MainActivity;
import com.family.aircok.acfamily.net.client.C2HTTPProcessor;
import com.family.aircok.acfamily.net.transaction.ACTransaction;

import net.cruxware.android.net.client.NetworkProcessor;
import net.cruxware.android.net.transaction.Transaction;
import net.cruxware.android.net.transaction.TransactionException;

import org.json.JSONArray;
import org.json.JSONObject;

import java.io.UnsupportedEncodingException;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.nio.ByteBuffer;
import java.nio.ByteOrder;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.UUID;


import static com.facebook.login.widget.ProfilePictureView.TAG;
import static com.family.aircok.acfamily.common.PermissionManager.REQUEST_CODE_ACCESS_FINE_LOCATION;
import static com.kakao.usermgmt.StringSet.uuid;

/**
 * Created by CHO on 2016. 11. 7..
 *
 * @author CHO
 * @version 1.0.0
 * @since 1.0.0
 */
public class SettingDeviceListFragment extends BaseFragment {

    private Adapter_ mAdapter;
    private C2BLEManager mBLEManager;
    private Handler mHandler = new Handler();
    private HashMap<String, String> mDeviceMap = new HashMap<>();
    private boolean isConnect = false;
    private String deviceID = "";
    private String deviceFID = "";

    private class Adapter_ extends CXAdapter {

        @Override
        public View getView(int position, View convertView, ViewGroup parent) {
            if (convertView == null) {
                convertView = View.inflate(getContext(), R.layout.cell_device_list, null);
            }

            if (getItem(position) instanceof String) {
                String name = (String) getItem(position);
                TextView tv_device_name = (TextView) convertView.findViewById(R.id.tv_device_name);
                tv_device_name.setText(name);
//                baseView.findViewById(R.id.ceonnect_device_icon).setBackgroundResource(R.drawable.ic_aircok_on);
//                baseView.findViewById(R.id.no_device).setVisibility(View.GONE);
//                baseView.findViewById(R.id.ceonnect_device_comment).setVisibility(View.VISIBLE);
                isConnect = true;
                progressStop();
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
                            BleAdvertisedData badata = BleUtil.parseAdertisedData(scanRecord);
                            List<UUID> fid = badata.getUuids();
                            LogUtil.LOGE("fid : " + fid.toString());
                            try {
                                BluetoothManager bluetoothManager = (BluetoothManager) baseActivity.getSystemService(Context.BLUETOOTH_SERVICE);
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
                    if (Util.isGps(getContext())) {
                        bluetoothEnable();
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

    public SettingDeviceListFragment() {}

    public View onCreateView(LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        LogUtil.LOGE("SettingDeviceListFragment");
        baseView = inflater.inflate(R.layout.fragment_setting_device_list, container, false);
        mBLEManager = new C2BLEManager(getContext());

        ListView list_view = (ListView) baseView.findViewById(R.id.list_view);
        mAdapter = new Adapter_();
        list_view.setAdapter(mAdapter);
        list_view.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            @Override
            public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
                progressStart();
                C2Preference.setDevice(getContext(), (String)mAdapter.getItem(position));
                ACTransaction tr = new ACTransaction(SettingDeviceListFragment.this, "aircok");
                tr.setConnectionURL(Config.SERVER_URL);
                tr.setRequest("user_id", LoginInfo.getInstance().user_id);
                tr.setRequest("email", C2Preference.getLoginID(getContext()));
                tr.setRequest("aircok_id", deviceID);
                tr.setRequest("aircok_fid", deviceFID);
                tr.setRequest("aircok_type", "family");
                JSONObject location = new JSONObject();
                try {
                    JSONArray coordinate = new JSONArray();
                    coordinate.put(Util.getLatitude());
                    coordinate.put(Util.getLongitude());
                    String address = Util.getAddress(getContext(), Util.getLatitude(), Util.getLongitude());
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
        });

        View footer = View.inflate(getContext(), R.layout.cell_device_list_refresh, null);
        footer.findViewById(R.id.btn_device_list_refresh).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if (!mBLEManager.isScanning()) {
                    baseActivity.getPermissionManager().performPermission(mPermissionListener, PermissionManager.PERMISSIONS_LOCATION, REQUEST_CODE_ACCESS_FINE_LOCATION);
                }
            }
        });
        list_view.setFooterDividersEnabled(false);
        list_view.addFooterView(footer);

        baseActivity.getPermissionManager().performPermission(mPermissionListener, PermissionManager.PERMISSIONS_LOCATION, REQUEST_CODE_ACCESS_FINE_LOCATION);
        return baseView;
    }

    private void startScan() {
        if (mBLEManager.isScanning()) {
            return;
        }
        progressStart();
        Handler handler = new Handler();
        handler.postDelayed(new Runnable() {
            @Override
            public void run() {
                mBLEManager.scanLeDevice(false, mLeScanCallback);
                if (!isConnect) {
                    progressStop();
                    baseActivity.getSupportFragmentManager().beginTransaction().replace(R.id.layout_device_container, new SettingDeviceNoneFragment()).commit();
                }
            }
        }, 5000);


        mDeviceMap.clear();
        mAdapter.datas.removeAllElements();
        mAdapter.notifyDataSetChanged();
        mBLEManager.scanLeDevice(true, mLeScanCallback);
        isConnect = false;
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

    @Override
    protected void onExceptionThrownOnUiThread(NetworkProcessor networkProcessor, TransactionException e) {
        super.onExceptionThrownOnUiThread(networkProcessor, e);
    }

    @Override
    protected void onTransactionReceivedOnUiThread(NetworkProcessor networkProcessor, Transaction transaction) {
        super.onTransactionReceivedOnUiThread(networkProcessor, transaction);
        if (transaction instanceof ACTransaction) {
            ACTransaction tr = (ACTransaction) transaction;
            if (tr.getCode().equals("aircok")){
                responseAircok(tr);
            }
        }
    }

    private void responseAircok(ACTransaction tr) {
        JSONObject respone = tr.getResponse();
        String result = "";
        result = respone.optString("result");
        if ("1".equals(result)){
            progressStop();
//            baseActivity.finish();
            Intent i = new Intent(getContext(), MainActivity.class);
            i.setFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_SINGLE_TOP);
            startActivity(i);
            baseActivity.finish();
        }
    }

    static public class BleUtil {
        private final static String TAG=BleUtil.class.getSimpleName();
        public static BleAdvertisedData parseAdertisedData(byte[] advertisedData) {
            List<UUID> uuids = new ArrayList<UUID>();
            String name = null;
            if( advertisedData == null ){
                return new BleAdvertisedData(uuids, name);
            }

            ByteBuffer buffer = ByteBuffer.wrap(advertisedData).order(ByteOrder.LITTLE_ENDIAN);
            while (buffer.remaining() > 2) {
                byte length = buffer.get();
                if (length == 0) break;

                byte type = buffer.get();
                switch (type) {
                    case 0x02: // Partial list of 16-bit UUIDs
                    case 0x03: // Complete list of 16-bit UUIDs
                        while (length >= 2) {
                            uuids.add(UUID.fromString(String.format(
                                    "%08x-0000-1000-8000-00805f9b34fb", buffer.getShort())));
                            length -= 2;
                        }
                        break;
                    case 0x06: // Partial list of 128-bit UUIDs
                    case 0x07: // Complete list of 128-bit UUIDs
                        while (length >= 16) {
                            long lsb = buffer.getLong();
                            long msb = buffer.getLong();
                            uuids.add(new UUID(msb, lsb));
                            length -= 16;
                        }
                        break;
                    case 0x09:
                        byte[] nameBytes = new byte[length-1];
                        buffer.get(nameBytes);
                        try {
                            name = new String(nameBytes, "utf-8");
                        } catch (UnsupportedEncodingException e) {
                            e.printStackTrace();
                        }
                        break;
                    default:
                        buffer.position(buffer.position() + length - 1);
                        break;
                }
            }
            return new BleAdvertisedData(uuids, name);
        }
    }


    public static class BleAdvertisedData {
        private List<UUID> mUuids;
        private String mName;
        public BleAdvertisedData(List<UUID> uuids, String name){
            mUuids = uuids;
            mName = name;
        }

        public List<UUID> getUuids(){
            return mUuids;
        }

        public String getName(){
            return mName;
        }
    }
}
