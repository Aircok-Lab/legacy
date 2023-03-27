package com.family.aircok.acfamily;

import android.annotation.TargetApi;
import android.content.Context;
import android.graphics.Canvas;
import android.graphics.Paint;
import android.os.Build;
import android.support.annotation.Nullable;
import android.support.annotation.RequiresApi;
import android.util.AttributeSet;
import android.view.View;

/**
 * Created by ssong on 2017. 5. 17..
 */

public class TestCircle extends View {

    Paint mOutLinePaint;
    private int mStrokeWidth = 25;

    public TestCircle(Context context) {
        super(context);
        init();
    }

    public TestCircle(Context context, @Nullable AttributeSet attrs) {
        super(context, attrs);
        init();
    }

    public TestCircle(Context context, @Nullable AttributeSet attrs, int defStyleAttr) {
        super(context, attrs, defStyleAttr);
        init();
    }

    @TargetApi(Build.VERSION_CODES.LOLLIPOP)
    public TestCircle(Context context, @Nullable AttributeSet attrs, int defStyleAttr, int defStyleRes) {
        super(context, attrs, defStyleAttr, defStyleRes);
        init();
    }

    public void init(){
        mOutLinePaint = new Paint();
        mOutLinePaint.setStrokeWidth((float) 7);
        mOutLinePaint.setAntiAlias(true);
        mOutLinePaint.setStyle(Paint.Style.STROKE);
        mOutLinePaint.setColor(getResources().getColor(R.color.circle_chart_stroke));
    }

    @Override
    protected void onDraw(Canvas canvas) {
        super.onDraw(canvas);
        float width = getWidth();
        float height = getHeight();

        float radius = (height / 2f) - mStrokeWidth;
        canvas.drawCircle(width / 2f, height / 2f , radius, mOutLinePaint);
    }
}
