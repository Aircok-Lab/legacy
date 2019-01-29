package com.baby.aircok.acbaby.main;

import android.content.Intent;
import android.os.Bundle;
import android.support.annotation.Nullable;
import android.support.v4.view.GravityCompat;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import com.baby.aircok.acbaby.BaseFragment;
import com.baby.aircok.acbaby.R;
import com.baby.aircok.acbaby.menu.ChangeBabyInfoActivity;
import com.baby.aircok.acbaby.menu.DustInfoActivity;
import com.baby.aircok.acbaby.menu.HealthHistoryActivity;
import com.baby.aircok.acbaby.menu.ProductInfoActivity;
import com.baby.aircok.acbaby.menu.PurchaseActivity;
import com.baby.aircok.acbaby.menu.TermsActivity;
import com.baby.aircok.acbaby.menu.setting.SettingActivity;


/**
 * Created by CHO on 2016. 10. 24..
 */

public class MenuFragment extends BaseFragment {

    private View.OnClickListener mMenuClickListener = new View.OnClickListener() {
        @Override
        public void onClick(View v) {
            Class clazz = null;
            switch (v.getId()) {
                case R.id.btn_menu0:
                    clazz = ProductInfoActivity.class;
                break;
                case R.id.btn_menu1:
                    clazz = DustInfoActivity.class;
                    break;
                case R.id.btn_menu2:
                    clazz = ChangeBabyInfoActivity.class;
                    break;
                case R.id.btn_menu3:
                    clazz = HealthHistoryActivity.class;
                    break;
                case R.id.btn_menu4:
                    clazz = SettingActivity.class;
                    break;
                default:
                    closeDrawer();
                    return;
            }

            if (clazz != null) {
                Intent intent = new Intent(getContext(), clazz);
                baseActivity.startActivity(intent);
                closeDrawer();
            }
        }
    };

    public MenuFragment() {}

    @Nullable
    @Override
    public View onCreateView(LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        baseView = inflater.inflate(R.layout.fragment_menu, container, false);
        baseView.findViewById(R.id.btn_menu0).setOnClickListener(mMenuClickListener);
        baseView.findViewById(R.id.btn_menu1).setOnClickListener(mMenuClickListener);
        baseView.findViewById(R.id.btn_menu2).setOnClickListener(mMenuClickListener);
        baseView.findViewById(R.id.btn_menu3).setOnClickListener(mMenuClickListener);
        baseView.findViewById(R.id.btn_menu4).setOnClickListener(mMenuClickListener);
        baseView.findViewById(R.id.btn_menu_close).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                closeDrawer();
            }
        });
        return baseView;
    }

    private void closeDrawer() {
        if (baseActivity instanceof MainActivity) {
            MainActivity activity = (MainActivity) baseActivity;
            activity.getDrawerLayout().closeDrawer(GravityCompat.START);
        }
    }
}
