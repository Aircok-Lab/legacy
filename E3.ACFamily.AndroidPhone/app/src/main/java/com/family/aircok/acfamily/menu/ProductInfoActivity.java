package com.family.aircok.acfamily.menu;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.TextView;

import com.family.aircok.acfamily.BaseActivity;
import com.family.aircok.acfamily.R;
import com.family.aircok.acfamily.intro.IntroActivity;
import com.family.aircok.acfamily.main.MainActivity;

/**
 * Created by ssong on 2017. 4. 24..
 */

public class ProductInfoActivity extends BaseActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.temp);
        TextView tv_title = (TextView) findViewById(R.id.tv_title);
        tv_title.setText(getClass().getSimpleName());

        findViewById(R.id.btn_).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {

            }
        });
    }
}
