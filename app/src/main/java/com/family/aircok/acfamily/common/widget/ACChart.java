package com.family.aircok.acfamily.common.widget;

import android.content.Context;
import android.content.res.Resources;
import android.graphics.Canvas;
import android.graphics.Paint;
import android.graphics.Rect;
import android.graphics.RectF;
import android.util.AttributeSet;
import android.util.TypedValue;
import android.view.View;

import org.json.JSONArray;
import org.json.JSONObject;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Locale;

public class ACChart extends View {

    public static final int NONE        = 0;
    public static final int TODAY       = 1;
    public static final int YESTERDAY   = 2;

    private class Item {
        Date dataTime;
        float pm10Value;
        float pm25Value;
    }

    private final static SimpleDateFormat SDF_SOURCE = new SimpleDateFormat("yyyy-MM-dd HH:mm");
    private final static SimpleDateFormat SDF_DATE = new SimpleDateFormat("yyyy-MM-dd");
    private final static SimpleDateFormat SDF_SHOW = new SimpleDateFormat("hha", Locale.US);

    private Paint paint;
    private List<Item> items;
    private float min = 0.0f;
    private float max = 50.0f;
    private boolean limit20Hour = false;
    private int dayType = NONE;

    public ACChart(Context context) {
        super(context);
        initialize();
    }

    public ACChart(Context context, AttributeSet attrs) {
        super(context, attrs);
        initialize();
    }

    public ACChart(Context context, AttributeSet attrs, int defStyleAttr) {
        super(context, attrs, defStyleAttr);
        initialize();
    }

    private void initialize() {
        paint = new Paint();
        paint.setAntiAlias(true);
        paint.setFlags(Paint.ANTI_ALIAS_FLAG);
        items = new ArrayList<Item>();
    }

    @Override
    protected void onDraw(Canvas canvas) {
        super.onDraw(canvas);
        float drawingStartX = dp2px(53.3f);
        float drawingStartY = dp2px(52.0f);
        float drawingWidth = getWidth() - dp2px(27.7f) - drawingStartX;
        float rrWidth = dp2px(32.0f);
        float rrHeight = dp2px(12.0f);
        if (!limit20Hour) {
            drawingWidth -= rrWidth;
        }
        float drawingHeight = getHeight() - dp2px(42.3f) - drawingStartY;
        float div = (max - min == 0) ? 1 : (max - min);
        float lineTick = dp2px(2);
        float lineThin = dp2px(1);
        Rect bounds = new Rect();
        paint.setTextSize(dp2px(8.7f));
        paint.setStyle(Paint.Style.FILL);

        float valueMargin = dp2px(20.0f);
        float diff = max - min;
        int mod = 1;
        float compare = 5.0f;
        while (true) {
            if (diff <= compare) {
                break;
            }
            mod++;
            compare += 5.0f;
        }

        for (float i = max - 1; i > min; i = i - 1.0f) {
            int temp = (int)(i - min);
            if (temp % mod == 0) {
                String value = String.format("%.0f", i);
                paint.setColor(0xFF969696);
                paint.getTextBounds(value, 0, value.length(), bounds);
                canvas.drawText(value, valueMargin, (max - i) / div * drawingHeight + drawingStartY + (bounds.bottom - bounds.top) / 2, paint);
            }
        }

        float itemWidth = drawingWidth / 24;
        float probe = drawingStartX;
        Date date = safeParseDate(SDF_DATE.format(new Date()) + " 00:00");
        int voidCount = 0;
        for (Item item : items) {
            if (item.dataTime != null) {
                date = item.dataTime;
                break;
            }
            voidCount++;
        }
        date.setTime(date.getTime() - 3600 * 1000 * voidCount);

        for (int i = 0; i <= 24; i++) {
            if (i % 4 == 0) {
                paint.setColor(0xFFECECEC);
                paint.setStrokeWidth(lineThin);
                canvas.drawLine(probe, drawingStartY, probe, drawingHeight + drawingStartY, paint);

                String showTime = SDF_SHOW.format(date);
                paint.setColor(0xFF969696);
                float textWidth = paint.measureText(showTime);
                paint.getTextBounds(showTime, 0, showTime.length(), bounds);
                canvas.drawText(showTime, probe - textWidth / 2, drawingHeight + drawingStartY + dp2px(8) + bounds.bottom - bounds.top, paint);
            }
            probe += itemWidth;
            long time = date.getTime() + 3600 * 1000;
            date.setTime(time);
        }
        probe = drawingStartX;
        float prevPm10Value = Float.NaN;
        float prevPm25Value = Float.NaN;
        float prevProbe = Float.NaN;
        float lastPm10Prove = Float.NaN;
        float lastPm25Prove = Float.NaN;
        float startPm10Prove = Float.NaN;
        float startPm25Prove = Float.NaN;
        List<Float> pm10X = new ArrayList<Float>();
        List<Float> pm10Y = new ArrayList<Float>();
        List<Float> pm25X = new ArrayList<Float>();
        List<Float> pm25Y = new ArrayList<Float>();
        for (Item item : items) {
            if (item.dataTime != null) {
                if (Float.isNaN(startPm10Prove)) {
                    startPm10Prove = probe;
                }
                if (Float.isNaN(startPm25Prove)) {
                    startPm25Prove = probe;
                }
                pm10X.add(probe);
                pm10Y.add((max - item.pm10Value) / div * drawingHeight + drawingStartY);
                pm25X.add(probe);
                pm25Y.add((max - item.pm25Value) / div * drawingHeight + drawingStartY);
                prevPm10Value = item.pm10Value;
                prevPm25Value = item.pm25Value;
                lastPm10Prove = probe;
                lastPm25Prove = probe;
            }
            prevProbe = probe;
            probe += itemWidth;
        }

        if (!Float.isNaN(lastPm10Prove)) {
            float y = (max - prevPm10Value) / div * drawingHeight + drawingStartY;
            paint.setColor(0xFF52D4DC);
            canvas.drawRoundRect(new RectF(lastPm10Prove, y - rrHeight / 2, lastPm10Prove + rrWidth, y + rrHeight / 2), rrHeight / 2, rrHeight / 2, paint);

            String showText = "PM10";
            paint.setColor(0xFFFFFFFF);
            float textWidth = paint.measureText(showText);
            paint.getTextBounds(showText, 0, showText.length(), bounds);
            canvas.drawText(showText, lastPm10Prove + (rrWidth - textWidth) / 2, y + (bounds.bottom - bounds.top) / 2, paint);
        }
        if (!Float.isNaN(lastPm25Prove)) {
            float y = (max - prevPm25Value) / div * drawingHeight + drawingStartY;
            paint.setColor(0xFF8CE87B);
            canvas.drawRoundRect(new RectF(lastPm25Prove, y - rrHeight / 2, lastPm25Prove + rrWidth, y + rrHeight / 2), rrHeight / 2, rrHeight / 2, paint);

            String showText = "PM2.5";
            paint.setColor(0xFFFFFFFF);
            float textWidth = paint.measureText(showText);
            paint.getTextBounds(showText, 0, showText.length(), bounds);
            canvas.drawText(showText, lastPm25Prove + (rrWidth - textWidth) / 2, y + (bounds.bottom - bounds.top) / 2, paint);
        }

        try {
            SplineInterpolator pm10Interpolator = SplineInterpolator.createMonotoneCubicSpline(pm10X, pm10Y);
            prevPm10Value = Float.NaN;
            prevProbe = Float.NaN;
            paint.setColor(0xFF52D4DC);
            paint.setStrokeWidth(lineTick);
            for (int i = 0; i <= 100; i++) {
                float x = startPm10Prove + (lastPm10Prove - startPm10Prove) * i / 100;
                float y = pm10Interpolator.interpolate(x);
                if (!Float.isNaN(prevPm10Value)) {
                    canvas.drawLine(x, y, prevProbe, prevPm10Value, paint);
                }
                prevProbe = x;
                prevPm10Value = y;
            }
        } catch (Exception e) {
        }

        try {
            SplineInterpolator pm25Interpolator = SplineInterpolator.createMonotoneCubicSpline(pm25X, pm25Y);
            prevPm25Value = Float.NaN;
            paint.setColor(0xFF8CE87B);
            paint.setStrokeWidth(lineThin);
            for (int i = 0; i <= 100; i++) {
                float x = startPm25Prove + (lastPm25Prove - startPm25Prove) * i / 100;
                float y = pm25Interpolator.interpolate(x);
                if (!Float.isNaN(prevPm25Value)) {
                    canvas.drawLine(x, y, prevProbe, prevPm25Value, paint);
                }
                prevProbe = x;
                prevPm25Value = y;
            }
        } catch (Exception e) {
        }
    }

    private void calcMinMax() {
        float min = Float.MAX_VALUE;
        float max = Float.MIN_VALUE;
        boolean check = false;
        for (Item item : items) {
            if (item.dataTime == null) {
                continue;
            }
            float value1 = item.pm10Value;
            float value2 = item.pm25Value;
            if (!Float.isNaN(value1)) {
                min = Math.min(min, value1);
                max = Math.max(max, value1);
                check = true;
            }
            if (!Float.isNaN(value2)) {
                min = Math.min(min, value2);
                max = Math.max(max, value2);
                check = true;
            }
        }
        if (check) {
            if (max == min) {
                max = max + 5;
                min = min - 5;
            }
            min = (float)Math.floor(min - 5);
            max = (float)Math.ceil(max + 5);
            if (min < 0) {
                min = 0;
            }
            if (max < 0) {
                max = 0;
            }
            this.min = min;
            this.max = max;
        }
    }

    public void setData(boolean limit20Hour, int dayType, JSONArray array) {
        initialize();
        this.limit20Hour = limit20Hour;
        this.dayType = dayType;
        String today = null;
        String yesterday = null;
        try {

            for (int i = 0; i < array.length(); i++) {
                JSONObject object = array.getJSONObject(i);
                yesterday = object.getString("dataTime");
                Date date = safeParseDate(yesterday);
                yesterday = yesterday.substring(0, 10);
                today = SDF_DATE.format(date);
                if (!yesterday.equals(today)) {
                    break;
                }
            }

            List<Item> tempItems = new ArrayList<Item>();
            for (int i = 0; i < array.length(); i++) {
                JSONObject object = array.getJSONObject(i);
                String time = object.getString("dataTime");
                if (dayType == TODAY) {
                    String str = SDF_DATE.format(safeParseDate(time));
                    if (!today.equals(str)) {
                        continue;
                    }
                } else if (dayType == YESTERDAY) {
                    String str = time.substring(0, 10);
                    if (!yesterday.equals(str)) {
                        continue;
                    }
                }
                Item item = new Item();
                item.dataTime = safeParseDate(time);
                item.pm10Value = safeParseFloat(object.getString("pm10Value"));
                item.pm25Value = safeParseFloat(object.getString("pm25Value"));
                tempItems.add(0, item);
            }

            Item prevItem = null;
            for (Item item : tempItems) {
                Date date = item.dataTime;
                if (prevItem != null) {
                    long time = prevItem.dataTime.getTime() + 3600 * 1000;
                    while (time < date.getTime()) {
                        Item insert = new Item();
                        insert.dataTime = new Date(time);
                        insert.pm10Value = prevItem.pm10Value;
                        insert.pm25Value = prevItem.pm25Value;
                        items.add(insert);
                        time = time + 3600 * 1000;
                    }
                }
                items.add(item);
                prevItem = item;
            }

            while (items.size() > (limit20Hour ? 21 : 25)) {
                items.remove(0);
            }

            if (dayType == YESTERDAY) {
                while (items.size() <= (limit20Hour ? 20 : 24)) {
                    Item item = new Item();
                    items.add(0, item);
                }
            }
            float prevPm10Value = 0.0f;
            float prevPm25Value = 0.0f;
            for (Item item : items) {
                if (item.dataTime == null) {
                    continue;
                }
                if (Float.isNaN(item.pm10Value)) {
                    item.pm10Value = prevPm10Value;
                }
                if (Float.isNaN(item.pm25Value)) {
                    item.pm25Value = prevPm25Value;
                }
                prevPm10Value = item.pm10Value;
                prevPm25Value = item.pm25Value;
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        calcMinMax();
        invalidate();
    }

    private static float safeParseFloat(String value) {
        try {
            return Float.parseFloat(value);
        } catch (Exception e) {
        }
        return Float.NaN;
    }

    private static Date safeParseDate(String value) {
        try {
            return SDF_SOURCE.parse(value);
        } catch (Exception e) {
        }
        return new Date();
    }

    private float dp2px(float value) {
        Resources r = getContext().getResources();
        return TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_DIP, value, r.getDisplayMetrics());
    }

    private static class SplineInterpolator {

        private final List<Float> mX;
        private final List<Float> mY;
        private final float[] mM;

        private SplineInterpolator(List<Float> x, List<Float> y, float[] m) {
            mX = x;
            mY = y;
            mM = m;
        }

        private static SplineInterpolator createMonotoneCubicSpline(List<Float> x, List<Float> y) {
            if (x == null || y == null || x.size() != y.size() || x.size() < 2) {
                throw new IllegalArgumentException("There must be at least two control "
                        + "points and the arrays must be of equal length.");
            }

            final int n = x.size();
            float[] d = new float[n - 1]; // could optimize this out
            float[] m = new float[n];

            // Compute slopes of secant lines between successive points.
            for (int i = 0; i < n - 1; i++) {
                float h = x.get(i + 1) - x.get(i);
                if (h <= 0f) {
                    throw new IllegalArgumentException("The control points must all "
                            + "have strictly increasing X values.");
                }
                d[i] = (y.get(i + 1) - y.get(i)) / h;
            }

            // Initialize the tangents as the average of the secants.
            m[0] = d[0];
            for (int i = 1; i < n - 1; i++) {
                m[i] = (d[i - 1] + d[i]) * 0.5f;
            }
            m[n - 1] = d[n - 2];

            // Update the tangents to preserve monotonicity.
            for (int i = 0; i < n - 1; i++) {
                if (d[i] == 0f) { // successive Y values are equal
                    m[i] = 0f;
                    m[i + 1] = 0f;
                } else {
                    float a = m[i] / d[i];
                    float b = m[i + 1] / d[i];
                    float h = (float) Math.hypot(a, b);
                    if (h > 9f) {
                        float t = 3f / h;
                        m[i] = t * a * d[i];
                        m[i + 1] = t * b * d[i];
                    }
                }
            }
            return new SplineInterpolator(x, y, m);
        }

        public float interpolate(float x) {
            final int n = mX.size();
            if (Float.isNaN(x)) {
                return x;
            }
            if (x <= mX.get(0)) {
                return mY.get(0);
            }
            if (x >= mX.get(n - 1)) {
                return mY.get(n - 1);
            }

            int i = 0;
            while (x >= mX.get(i + 1)) {
                i += 1;
                if (x == mX.get(i)) {
                    return mY.get(i);
                }
            }

            // Perform cubic Hermite spline interpolation.
            float h = mX.get(i + 1) - mX.get(i);
            float t = (x - mX.get(i)) / h;
            return (mY.get(i) * (1 + 2 * t) + h * mM[i] * t) * (1 - t) * (1 - t)
                    + (mY.get(i + 1) * (3 - 2 * t) + h * mM[i + 1] * (t - 1)) * t * t;
        }
    }
}
