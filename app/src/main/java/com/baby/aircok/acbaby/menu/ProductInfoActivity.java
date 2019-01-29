package com.baby.aircok.acbaby.menu;

import android.os.Bundle;
import android.view.View;

import com.baby.aircok.acbaby.BaseActivity;
import com.baby.aircok.acbaby.R;


/**
 * Created by CHO on 2016. 10. 24..
 */

public class ProductInfoActivity extends BaseActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_product_info);
        setHeader(R.drawable.btn_nav_back_selector, -1, R.string.menu_title0, -1);
    }

    @Override
    public void onClickLeftMenu(View view) {
        finish();
    }
}
