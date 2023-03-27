package com.family.aircok.acfamily.menu.setting;

import android.os.Bundle;
import android.support.annotation.Nullable;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import com.family.aircok.acfamily.BaseFragment;
import com.family.aircok.acfamily.R;
import com.family.aircok.acfamily.common.C2Preference;

/**
 * Created by ssong on 2017. 8. 2..
 */

public class SettingDeviceNoneFragment extends BaseFragment {

    @Nullable
    @Override
    public View onCreateView(LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        baseView = inflater.inflate(R.layout.fragment_setting_deivce_none, container, false);

        TextView tv_search_coment = (TextView) baseView.findViewById(R.id.tv_device_search_coment);
        if (!("").equals(C2Preference.getDevice(getContext()))) {
            tv_search_coment.setText(R.string.setting_device_no_connect2);
        }


        baseView.findViewById(R.id.btn_none_device_search).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {

                getFragmentManager().beginTransaction().replace(R.id.layout_device_container, new SettingDeviceListFragment()).commit();
            }
        });

        return baseView;
    }
}
