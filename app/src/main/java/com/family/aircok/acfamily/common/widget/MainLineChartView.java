package com.family.aircok.acfamily.common.widget;

import android.annotation.TargetApi;
import android.content.Context;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.graphics.Typeface;
import android.os.Build;
import android.support.annotation.Nullable;
import android.util.AttributeSet;
import android.view.View;

import com.family.aircok.acfamily.R;
import com.family.aircok.acfamily.common.C2Util;
import com.family.aircok.acfamily.common.LogUtil;
import com.family.aircok.acfamily.common.Util;

/**
 * Created by ssong on 2017. 6. 2..
 */

public class MainLineChartView extends View {

    private Paint mInLinePaint;
    private Paint mOutLinePaint;
    private Paint mTextPaint;
    private Paint mPointPaint;
    private int mPoint = 0;
    private int state = 0;
    private int color = 0;
    private int mMax = 500;

    public MainLineChartView(Context context) {
        super(context);
        init();
    }

    public MainLineChartView(Context context, @Nullable AttributeSet attrs) {
        super(context, attrs);
        init();
    }

    public MainLineChartView(Context context, @Nullable AttributeSet attrs, int defStyleAttr) {
        super(context, attrs, defStyleAttr);
        init();
    }

    @TargetApi(Build.VERSION_CODES.LOLLIPOP)
    public MainLineChartView(Context context, @Nullable AttributeSet attrs, int defStyleAttr, int defStyleRes) {
        super(context, attrs, defStyleAttr, defStyleRes);
        init();
    }

    private void init(){
        mOutLinePaint = new Paint();
        mOutLinePaint.setColor(getResources().getColor(R.color.line_chart_outline));
        mOutLinePaint.setAntiAlias(true);
        mOutLinePaint.setStrokeWidth((Util.getDpToPx(getContext(), 4)));

        mTextPaint = new Paint();
        mTextPaint.setColor(getResources().getColor(R.color.circle_chart_stroke));
        mTextPaint.setTextSize(Util.getDpToPx(getContext(), 8));

        mInLinePaint = new Paint();
        mInLinePaint.setAntiAlias(true);
        mInLinePaint.setStrokeWidth((Util.getDpToPx(getContext(), 4)));

        mPointPaint = new Paint();
        mPointPaint.setColor(Color.BLACK);
        mPointPaint.setTypeface(Typeface.create(Typeface.DEFAULT, Typeface.BOLD));
        mPointPaint.setTextSize(Util.getDpToPx(getContext(), 14));

    }

    public void setPM10Value(int value){
        mMax = 600;
        this.state = C2Util.getDustState(value);
        this.color = C2Util.getN10DustColor(value);
        setProgress(value);
        mInLinePaint.setColor(color);
    }

    public void setPM25Value(int value){
        mMax = 500;
        this.state = C2Util.getDustState(value);
        this.color = C2Util.getN25DustColor(value);
        setProgress(value);
        mInLinePaint.setColor(color);
    }

    public void setProgress(int progress) {
        mPoint = progress * 70 / mMax;
        if (progress > 70) {
            progress = 70;
        }
        invalidate();

//        if (progress >= 0 && progress <= 100) {
//            LogUtil.LOGE("mPoint: " + mPoint);
//            mPoint = (int) (progress * 0.7);
//            invalidate();
//        }
    }

    @Override
    protected void onDraw(Canvas canvas) {
        super.onDraw(canvas);
        float width = getWidth();
        float height = getHeight();
        LogUtil.LOGE("width: " + width + " height: " + height);

        if (width == 0 || height == 0) {
            return;
        }

        canvas.drawLine((float) (Util.getDpToPx(getContext(), 15)), (float) (Util.getDpToPx(getContext(), 7)), (float) (Util.getDpToPx(getContext(), 15)), (float) (Util.getDpToPx(getContext(), 77)), mOutLinePaint);
        canvas.drawLine((float) (Util.getDpToPx(getContext(), 15)), (float) (Util.getDpToPx(getContext(), 77 - mPoint)), (float) (Util.getDpToPx(getContext(), 15)),  (float) (Util.getDpToPx(getContext(), 77)), mInLinePaint);
//        canvas.drawText(topText, (width/10) * 2, 35, mTextPaint);
//        canvas.drawText(mPoint, (float) ((int) (width/10) * 2.5), 240, mPointPaint);
//        canvas.drawText("㎍/㎥", (width/10) * 2, 270, mTextPaint);
    }
}
