package com.baby.aircok.acbaby.main;

import android.os.Bundle;
import android.support.annotation.Nullable;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.ListView;
import android.widget.TextView;

import com.baby.aircok.acbaby.BaseFragment;
import com.baby.aircok.acbaby.R;
import com.baby.aircok.acbaby.common.C2Util;
import com.baby.aircok.acbaby.common.widget.CXAdapter;

import net.cruxware.android.base.util.JSONUtil;
import com.baby.aircok.acbaby.common.LogUtil;

import org.json.JSONObject;

/**
 * Created by CHO on 2016. 10. 25..
 */

public class MainBehaviorFragment extends BaseFragment {

    private static final String KEY_IS_HEADER = "isheader";
    private static final String KEY_IS_IN = "isin";
    private static final String KEY_TITLE = "title";
    private static final String KEY_CONTENTS = "contents";

    private static final int[] RESID_IN = {R.drawable.icon_dust_good_in, R.drawable.icon_dust_soso_in, R.drawable.icon_dust_effect_in, R.drawable.icon_dust_bad_in, R.drawable.icon_dust_beastly_in};
    private static final int[] RESID_OUT = {R.drawable.icon_dust_good_out, R.drawable.icon_dust_soso_out, R.drawable.icon_dust_effect_out, R.drawable.icon_dust_bad_out, R.drawable.icon_dust_beastly_out};
    private static final int[] TEXT_IN = {R.array.arrays_behaviral_0_0, R.array.arrays_behaviral_1_0, R.array.arrays_behaviral_2_0, R.array.arrays_behaviral_3_0, R.array.arrays_behaviral_4_0};
    private static final int[] TEXT_OUT = {R.array.arrays_behaviral_0_1, R.array.arrays_behaviral_1_1, R.array.arrays_behaviral_2_1, R.array.arrays_behaviral_3_1, R.array.arrays_behaviral_4_1};

    private Adapter_ mAdapter;
    private int mPM25 = 0;

    private class Adapter_ extends CXAdapter {

        @Override
        public int getViewTypeCount() {
            return 2;
        }

        @Override
        public int getItemViewType(int position) {
            JSONObject item = (JSONObject) getItem(position);
            boolean isHeader = item.optBoolean(KEY_IS_HEADER);
            if (isHeader) return 0;
            return 1;
        }

        @Override
        public View getView(int position, View convertView, ViewGroup parent) {
            int type = getItemViewType(position);
            if (convertView == null) {
                if (type == 0) {
                    convertView = View.inflate(getContext(), R.layout.cell_behaviral_type0, null);
                }
                else {
                    convertView = View.inflate(getContext(), R.layout.cell_behaviral_type1, null);
                }
            }

            if (type == 0) {
                setViewType0(position, convertView, parent);
            }
            else {
                setViewType1(position, convertView, parent);

            }
            return convertView;
        }

        public void setViewType0(int position, View convertView, ViewGroup parent) {
            if (getItem(position) instanceof JSONObject) {
                JSONObject item = (JSONObject) getItem(position);

                ImageView iv_icon = (ImageView) convertView.findViewById(R.id.iv_icon);
                TextView tv_in_out = (TextView) convertView.findViewById(R.id.tv_in_out);

                int point = C2Util.getTotalPoint(mPM25);
                int state = C2Util.getDustState(point);
                boolean isIn = item.optBoolean(KEY_IS_IN);
                if (isIn) {
                    iv_icon.setImageResource(RESID_IN[state]);
                    tv_in_out.setText(R.string.common_in);
                    tv_in_out.setSelected(false);
                }
                else {
                    iv_icon.setImageResource(RESID_OUT[state]);
                    tv_in_out.setText(R.string.common_out);
                    tv_in_out.setSelected(true);
                }
            }
        }

        public void setViewType1(int position, View convertView, ViewGroup parent) {
            if (getItem(position) instanceof JSONObject) {
                JSONObject item = (JSONObject) getItem(position);

                TextView tv_title = (TextView) convertView.findViewById(R.id.tv_title);
                TextView tv_contents = (TextView) convertView.findViewById(R.id.tv_contents);

                tv_title.setText(item.optString(KEY_TITLE).replace("&", "%"));
                String content = item.optString(KEY_CONTENTS);
                tv_contents.setVisibility(View.GONE);
                if (content.length() > 0) {
                    tv_contents.setVisibility(View.VISIBLE);
                    tv_contents.setText(item.optString(KEY_CONTENTS).replace("&", "%"));
                }
            }
        }

    }

    public MainBehaviorFragment() {}

    @Nullable
    @Override
    public View onCreateView(LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        LogUtil.LOGE("MainBehaviorFragment : " + baseView);
        if (baseView == null) {
            baseView = inflater.inflate(R.layout.fragment_behaviral, container, false);

            baseView.findViewById(R.id.btn_hide).setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    if (getActivity() instanceof  MainActivity) {
                        MainActivity activity = (MainActivity) getActivity();
                        activity.hideBehavior();
                    }
                }
            });

            ListView list_view = (ListView) baseView.findViewById(R.id.list_view);
            mAdapter = new Adapter_();
            list_view.setAdapter(mAdapter);

            setPM25(mPM25);
        }

        return baseView;
    }

    public void setPM25(int pm25) {
        if (baseView == null) {
            return;
        }
        mPM25 = pm25;
        int point = C2Util.getTotalPoint(pm25);
        int state = C2Util.getDustState(point);
        mAdapter.datas.removeAllElements();

        TextView tv_main_pm25 = (TextView) baseView.findViewById(R.id.tv_main_pm25);
        tv_main_pm25.setText(String.valueOf(mPM25));

        JSONObject item = new JSONObject();
        JSONUtil.putSafe(item, KEY_IS_HEADER, true);
        JSONUtil.putSafe(item, KEY_IS_IN, true);
        mAdapter.datas.add(item);

        String[] intArray = getResources().getStringArray(TEXT_IN[state]);
        for (String s : intArray) {
            item = new JSONObject();
            JSONUtil.putSafe(item, KEY_IS_HEADER, false);

            String[] token = s.split("=");
            if (token.length > 0) {
                JSONUtil.putSafe(item, KEY_TITLE, token[0]);
            }
            if (token.length > 1) {
                JSONUtil.putSafe(item, KEY_CONTENTS, token[1]);
            }
            mAdapter.datas.add(item);
        }

        item = new JSONObject();
        JSONUtil.putSafe(item, KEY_IS_HEADER, true);
        JSONUtil.putSafe(item, KEY_IS_IN, false);
        mAdapter.datas.add(item);

        String[] outArray = getResources().getStringArray(TEXT_OUT[state]);
        for (String s : outArray) {
            item = new JSONObject();
            JSONUtil.putSafe(item, KEY_IS_HEADER, false);
            String[] token = s.split("=");
            if (token.length > 0) {
                JSONUtil.putSafe(item, KEY_TITLE, token[0]);
            }
            if (token.length > 1) {
                JSONUtil.putSafe(item, KEY_CONTENTS, token[1]);
            }
            mAdapter.datas.add(item);
        }
        mAdapter.notifyDataSetChanged();
    }
}
