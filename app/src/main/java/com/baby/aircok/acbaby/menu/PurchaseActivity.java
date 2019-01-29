package com.baby.aircok.acbaby.menu;

import android.os.Bundle;
import android.view.View;

import com.baby.aircok.acbaby.BaseActivity;
import com.baby.aircok.acbaby.R;


/**
 * Created by CHO on 2016. 10. 24..
 */

public class PurchaseActivity extends BaseActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_purchase);
        setHeader(R.drawable.btn_nav_back_selector, -1, R.string.menu_title2, -1);
    }

    @Override
    public void onClickLeftMenu(View view) {
        finish();
    }
}
