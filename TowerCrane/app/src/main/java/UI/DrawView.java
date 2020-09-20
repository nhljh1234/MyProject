package UI;

import android.annotation.SuppressLint;
import android.content.Context;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.DashPathEffect;
import android.graphics.Paint;
import android.graphics.Paint.Style;
import android.graphics.Path;
import android.graphics.Rect;
import android.graphics.RectF;
import android.os.Debug;
import android.util.AttributeSet;
import android.util.Log;
import android.view.View;

import Data.TowerCraneRunData;

public class DrawView extends View {
    //点在臂上的比例
    private TowerCraneRunData towerCraneRunData;

    public DrawView(Context context, AttributeSet attrs) {
        super(context, attrs);


    }

    public void setRunData(TowerCraneRunData towerCraneRunDataIn) {
        towerCraneRunData = towerCraneRunDataIn;
        this.invalidate();
    }

    @SuppressLint("DrawAllocation")
    protected void onDraw(Canvas canvas) {
        float width = this.getWidth();
        float height = this.getHeight();
        float cx = width / 2 - 20;
        float cy = height / 2;
        float radius = Math.min(height, width) / 2 - 20;
        float textSize = 30;

        //圆心画个点
        @SuppressLint("DrawAllocation") Paint paintNormal = new Paint();
        paintNormal.setColor(Color.parseColor("#F6BD3F"));
        canvas.drawCircle(cx, cy, 8, paintNormal);

        //画虚线圆形
        @SuppressLint("DrawAllocation") Paint paintDotted = new Paint();
        paintDotted.setStyle(Paint.Style.STROKE);
        paintDotted.setAntiAlias(true);
        paintDotted.setStrokeWidth(4);
        paintDotted.setColor(Color.parseColor("#F6BD3F"));
        paintDotted.setPathEffect(new DashPathEffect(new float[]{10, 5}, 0));
        canvas.drawCircle(cx, cy, radius, paintDotted);
        //画直线
        @SuppressLint("DrawAllocation") Path path = new Path();
        path.moveTo(cx, cy);
        path.lineTo(cx + radius, cy);
        canvas.drawPath(path, paintDotted);

        //写字
        paintNormal.setTextSize(textSize);
        canvas.drawText("0°", cx + radius + 10, cy + textSize / 2 - 10, paintNormal);

        if (towerCraneRunData != null) {
            @SuppressLint("DrawAllocation") Path towerPath = new Path();
            //角度处理
            float angle = (float) towerCraneRunData.turnAround;
            float amplitude = (float) towerCraneRunData.getAmplitudeScale();
            //angle = 135;
            //获取角度在圆上的点的位置
            float pointX, pointY;
            pointX = (float) (radius * Math.cos(Math.toRadians(angle)));
            pointY = (float) (radius * Math.sin(Math.toRadians(angle)));
            paintNormal.setStrokeWidth(4);
            paintNormal.setAntiAlias(true);
            canvas.drawLine(-0.2f * pointX + cx, -0.2f * pointY + cy, 1.2f * pointX + cx, 1.2f * pointY + cy, paintNormal);
            //角度
            //canvas.drawText(String.format("%.1f°", Math.abs(angle)), 1.2f * pointX + cx, 1.2f * pointY + cy, paintNormal);
            //幅度
            paintNormal.setColor(Color.parseColor("#FF0000"));
            canvas.drawCircle(amplitude * pointX + cx, amplitude * pointY + cy, 6, paintNormal);
        }
    }
}
