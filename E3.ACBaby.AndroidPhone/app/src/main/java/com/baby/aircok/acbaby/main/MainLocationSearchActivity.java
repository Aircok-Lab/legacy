package com.baby.aircok.acbaby.main;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.webkit.JavascriptInterface;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import com.baby.aircok.acbaby.BaseActivity;
import com.baby.aircok.acbaby.R;

import net.cruxware.android.base.util.JSONUtil;

import com.baby.aircok.acbaby.common.Config;
import com.baby.aircok.acbaby.common.LogUtil;

import org.json.JSONObject;

/**
 * Created by CHO on 2016. 11. 27..
 *
 * @author CHO
 * @version 1.0.0
 * @since 1.0.0
 */

public class MainLocationSearchActivity extends BaseActivity {

    public static final String KEY_RESULT_DATA = "result_data";
    public static final String KEY_ADDRESS = "KEY_ADDRESS";
    public static final String KEY_RESULT_ADDRESS_DATA = "result_address_data";

    class MyJavaScriptInterface {
        @JavascriptInterface
        @SuppressWarnings("unused")
        public void processDATA(String data) {
            JSONObject item = new JSONObject();
            JSONUtil.putSafe(item, KEY_ADDRESS, getAddr(data));
            Intent intent = new Intent();
            intent.putExtra(KEY_RESULT_ADDRESS_DATA, data);
            intent.putExtra(KEY_RESULT_DATA, item.toString());
            setResult(RESULT_OK, intent);
            finish();
        }
    }
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_location_search);
        setHeader(R.drawable.btn_nav_back_selector, -1, R.string.location_search_title, -1);

        final WebView webView = (WebView) findViewById(R.id.webView);
        webView.getSettings().setJavaScriptEnabled(true);
        webView.addJavascriptInterface(new MainLocationSearchActivity.MyJavaScriptInterface(), "Android");
        webView.setWebViewClient(new WebViewClient() {
            @Override
            public void onPageFinished(WebView view, String url) {

                webView.loadUrl("javascript:sample2_execDaumPostcode();");
            }
        });

        webView.loadUrl(Config.MAIN_SERCH_URL);

    }

    @Override
    public void onClickLeftMenu(View view) {
        finish();
    }

    private String getAddr(String addr) {
        LogUtil.LOGE("getAddr : " + addr);
        addr = addr.replace(",", "");
        addr = addr.replace("(", "");
        addr = addr.replace(")", "");
        String[] array = addr.split(" ");
        for (String s : array) {
            char last = s.charAt(s.length() -1);
            if (last == '읍' || last == '면' || last == '동') {
                return s;
            }
        }
        return "";
    }
}
