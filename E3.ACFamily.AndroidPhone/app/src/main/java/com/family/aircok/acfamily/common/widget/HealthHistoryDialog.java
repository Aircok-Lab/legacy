package com.family.aircok.acfamily.common.widget;

import android.app.Dialog;
import android.content.Context;
import android.graphics.Color;
import android.graphics.drawable.ColorDrawable;
import android.os.Bundle;
import android.support.annotation.NonNull;
import android.view.View;
import android.view.ViewGroup;
import android.view.Window;
import android.view.WindowManager;
import android.widget.AdapterView;
import android.widget.Spinner;
import android.widget.TextView;

import com.family.aircok.acfamily.R;
import com.family.aircok.acfamily.common.LogUtil;

import java.util.HashMap;

/**
 * Created by ssong on 2017. 7. 5..
 */

public class HealthHistoryDialog extends Dialog {

    private TextView tv_Title, tv_baby, tv_mom;
    private Spinner spinnerObject, spinnerSymptom, spinnerHospital;
    private String disease = "";
    private String target = "";
    private String insert_date = "";
    private String department = "";
    private String delete_flag = "";
    private OnDismissListener _listener;

    public HealthHistoryDialog(@NonNull Context context) {
        super(context);
        setCanceledOnTouchOutside(true);
        requestWindowFeature(Window.FEATURE_NO_TITLE);
        getWindow().setBackgroundDrawable(new ColorDrawable(Color.TRANSPARENT));
        setContentView(R.layout.health_history_dialog);

        tv_Title = (TextView) findViewById(R.id.didlog_date);

        spinnerObject = (Spinner) findViewById(R.id.object_spinner);
        spinnerSymptom = (Spinner) findViewById(R.id.symptom_spinner);
        spinnerHospital = (Spinner) findViewById(R.id.hospital_spinner);

        spinnerObject.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
           @Override
           public void onItemSelected(AdapterView<?> parent, View view, int position, long id) {
               if (position == 0) {
                    target = "";
                    LogUtil.LOGE("target: " + target);
                    return;
                }

                target = String.valueOf(parent.getItemAtPosition(position));
                LogUtil.LOGE("position: " + position + " getItem : " + parent.getItemAtPosition(position) + " target: " + target);
           }

           @Override
           public void onNothingSelected(AdapterView<?> parent) {
               target = "";
               LogUtil.LOGE("target: " + target);
           }
        });

        spinnerSymptom.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
            @Override
            public void onItemSelected(AdapterView<?> parent, View view, int position, long id) {
                if (position == 0) {
                    disease = "";
                    LogUtil.LOGE("disease: " + disease);
                    return;
                }

                disease = String.valueOf(parent.getItemAtPosition(position));
                LogUtil.LOGE("position: " + position + " getItem : " + parent.getItemAtPosition(position) + " disease: " + disease);
            }
            @Override
            public void onNothingSelected(AdapterView<?> parent) {
                disease = "";
                LogUtil.LOGE("disease: " + disease);
            }
        });

        spinnerHospital.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
            @Override
            public void onItemSelected(AdapterView<?> parent, View view, int position, long id) {
                if (position == 0) {
                    department = "";
                    LogUtil.LOGE("department: " + department);
                    return;
                }

                department = String.valueOf(parent.getItemAtPosition(position));
                LogUtil.LOGE("position: " + position + " getItem : " + parent.getItemAtPosition(position) + " department: " + department);
            }

            @Override
            public void onNothingSelected(AdapterView<?> parent) {
                department = "";
                LogUtil.LOGE("department: " + department);
            }
        });

        findViewById(R.id.health_btn_cancel).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                dismiss();
            }
        });

        findViewById(R.id.health_btn_delete).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                delete_flag = "true";
                if( _listener == null ) {} else {
                    _listener.onDismiss( HealthHistoryDialog.this );
                }
                dismiss();
            }
        });

        findViewById(R.id.health_btn_save).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                delete_flag = "false";
                if( _listener == null ) {} else {
                    _listener.onDismiss(HealthHistoryDialog.this );
                }
                dismiss();
            }
        });
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        ViewGroup.LayoutParams params = getWindow().getAttributes();
        params.width = WindowManager.LayoutParams.MATCH_PARENT;
        params.height = WindowManager.LayoutParams.WRAP_CONTENT;
        getWindow().setAttributes((WindowManager.LayoutParams) params);
    }

    public void setOnDismissListener(OnDismissListener listener ) {
        _listener = listener ;
    }

    public HashMap<String, String> getData() {
        HashMap<String, String> medical = new HashMap<>();
        medical.put("insert_date", insert_date);
        medical.put("target", target);
        medical.put("department", department);
        medical.put("disease", disease);
        medical.put("delete_flag", delete_flag);

        return medical;
    }

    public void setTitle(String title){
        tv_Title.setText(title);
        insert_date = title.replace(".","");
        LogUtil.LOGE("insert_date : " + insert_date);
    }

    public void setDate(String target, String disease, String department) {
        switch (target) {
            case "할머니":
                spinnerObject.setSelection(1);
                break;
            case "할아버지":
                spinnerObject.setSelection(2);
                break;
            case "아빠":
                spinnerObject.setSelection(3);
                break;
            case "엄마":
                spinnerObject.setSelection(4);
                break;
            case "아기":
                spinnerObject.setSelection(5);
                break;
        }

        switch (disease) {
            case "결막염":
                spinnerSymptom.setSelection(1);
                break;
            case "구내염":
                spinnerSymptom.setSelection(2);
                break;
            case "기관지천식":
                spinnerSymptom.setSelection(3);
                break;
            case "모세기관지염":
                spinnerSymptom.setSelection(4);
                break;
            case "수족구":
                spinnerSymptom.setSelection(5);
                break;
            case "알레르기비염":
                spinnerSymptom.setSelection(6);
                break;
            case "인후염":
                spinnerSymptom.setSelection(7);
                break;
            case "중이염":
                spinnerSymptom.setSelection(8);
                break;
            case "축농증":
                spinnerSymptom.setSelection(9);
                break;
            case "편도선염":
                spinnerSymptom.setSelection(10);
                break;
            case "폐렴":
                spinnerSymptom.setSelection(11);
                break;
            case "기타":
                spinnerSymptom.setSelection(12);
                break;
        }

        switch (department) {
            case "가정의학과":
                spinnerHospital.setSelection(1);
                break;
            case "내과":
                spinnerHospital.setSelection(2);
                break;
            case "소아청소년과":
                spinnerHospital.setSelection(3);
                break;
            case "안과":
                spinnerHospital.setSelection(4);
                break;
            case "이비인후과":
                spinnerHospital.setSelection(5);
                break;
            case "기타":
                spinnerHospital.setSelection(6);
                break;
        }
    }
}
