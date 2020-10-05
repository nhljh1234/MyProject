package com.liaojh.towercrane.UI;

import android.app.Activity;
import android.util.TypedValue;
import android.view.View;
import android.widget.FrameLayout;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;

import com.liaojh.towercrane.Activity.BaseActivity;
import com.liaojh.towercrane.Activity.MainActivity;
import com.liaojh.towercrane.Data.TowerCraneData;
import com.liaojh.towercrane.R;

import java.util.ArrayList;

import com.liaojh.towercrane.Data.Constant;
import com.liaojh.towercrane.Data.TowerCraneRunData;
import com.liaojh.towercrane.Tool.Tool;

public class UITowerCraneRunInfo implements InterfaceUI {
    private TowerCraneRunData oldData;

    private Activity activity;

    private TextView textNumber, textSpecifications, textMonitorNumber, textMagnification;

    private TextView textWireRope, textLoad, textHeight, textTurnAround, textTorque, textWeight, textWindPower, textAmplitude;

    private TextView textLabelWireRope, textLabelLoad, textLabelHeight, textLabelTurnAround, textLabelTorque, textLabelWeight, textLabelWindPower, textLabelAmplitude;

    private LinearLayout layoutWireRope, layoutLoad, layoutHeight, layoutTurnAround, layoutTorque, layoutWeight, layoutWindPower, layoutAmplitude;

    private LinearLayout layoutUp, layoutDown, layoutLeft, layoutRight, layoutFront, layoutBack;

    private ImageView imageUp, imageDown, imageLeft, imageRight, imageFront, imageBack;

    private TextView textUp, textDown, textLeft, textRight, textFront, textBack;

    private TextView textLabelCordHarmNumber, textCordHarmNumber, textLabelCordPos, textCordPos, textLabelCordHarmPos, textCordHarmPos;

    private TextView textBackArmLength, textBigArmLength, textMaxHeight, textNowPosHeight;

    private DrawView drawView;

    private FrameLayout frameLayoutThing;

    private ImageView imageThing;

    private ImageView imageWaring;

    private LinearLayout layoutWaring_1, layoutWaring_2, layoutWaring_3;

    private TextView textWaring_1, textWaring_2, textWaring_3;

    private FrameLayout frameLayoutTower, frameLayoutTowerImage;

    private LinearLayout layoutBackArm, layoutBigArm, layoutMaxHeight;

    //转换数值为dp
    private int getDpNum(int number) {
        int dp = (int) TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_DIP, number, activity.getResources().getDisplayMetrics());
        return Tool.getDPIRatioNum(activity, dp);
    }

    //动态设置货位位置
    private void updateThingPos(TowerCraneRunData towerCraneRunData) {
        int frameLayoutPosXMin = 55;
        int frameLayoutPosXMax = 165;
        int imagePosYMin = -110;
        int imagePosYMax = 0;

        int frameLayoutMarginLeft = frameLayoutPosXMin + (int) ((frameLayoutPosXMax - frameLayoutPosXMin) * towerCraneRunData.getAmplitudeScale());
        int marginTop = imagePosYMin + (int) ((imagePosYMax - imagePosYMin) * towerCraneRunData.getHeightScale());

        FrameLayout.LayoutParams lpFrameLayout = new FrameLayout.LayoutParams(getDpNum(20), LinearLayout.LayoutParams.MATCH_PARENT);
        lpFrameLayout.setMargins(getDpNum(frameLayoutMarginLeft), getDpNum(23), 0, 0);
        frameLayoutThing.setLayoutParams(lpFrameLayout);

        FrameLayout.LayoutParams lpImage = new FrameLayout.LayoutParams(LinearLayout.LayoutParams.MATCH_PARENT, getDpNum(135));
        lpImage.setMargins(0, getDpNum(marginTop), 0, 0);
        imageThing.setLayoutParams(lpImage);
    }

    private void updateLayoutWaringInfo(Boolean isWaring, TextView textNumber, LinearLayout layout, TextView textLabel) {
        if (isWaring) {
            layout.setBackground(activity.getDrawable(R.drawable.frame_red));
            textNumber.setTextColor(activity.getResources().getColor(R.color.color_number_waring));
            textLabel.setTextColor(activity.getResources().getColor(R.color.color_number_waring));
        } else {
            layout.setBackground(activity.getDrawable(R.drawable.frame_gray));
            textNumber.setTextColor(activity.getResources().getColor(R.color.color_number));
            textLabel.setTextColor(activity.getResources().getColor(R.color.color_number_label));
        }
    }

    private void updateLayoutStatusInfo(Boolean isSelect, TextView text, LinearLayout layout, ImageView image, int selectImgId, int unSelectImgId) {
        if (isSelect) {
            image.setImageDrawable(activity.getDrawable(selectImgId));
            layout.setBackground(activity.getDrawable(R.drawable.frame_full_green));
            text.setTextColor(activity.getResources().getColor(R.color.color_status_select));
        } else {
            image.setImageDrawable(activity.getDrawable(unSelectImgId));
            layout.setBackground(activity.getDrawable(R.drawable.frame_gray));
            text.setTextColor(activity.getResources().getColor(R.color.color_status_un_select));
        }
    }

    @Override
    public void onTowerCraneRunDateUpdate(TowerCraneRunData towerCraneRunData) {
        textWireRope.setText(towerCraneRunData.getWireRopeStr());
        textLoad.setText(towerCraneRunData.getLoadStr());
        textHeight.setText(towerCraneRunData.getHeightStr());
        textTurnAround.setText(towerCraneRunData.getTurnAroundStr());
        textTorque.setText(towerCraneRunData.getTorqueStr());
        textWeight.setText(towerCraneRunData.getWeightStr());
        textWindPower.setText(towerCraneRunData.getWindPowerStr());
        textAmplitude.setText(towerCraneRunData.getAmplitudeStr());

        updateLayoutWaringInfo(towerCraneRunData.judgeWireRopeIsWaring(), textWireRope, layoutWireRope, textLabelWireRope);
        updateLayoutWaringInfo(towerCraneRunData.judgeLoadIsWaring(), textLoad, layoutLoad, textLabelLoad);
        updateLayoutWaringInfo(towerCraneRunData.judgeHeightIsWaring(), textHeight, layoutHeight, textLabelHeight);
        updateLayoutWaringInfo(towerCraneRunData.judgeTurnAroundIsWaring(), textTurnAround, layoutTurnAround, textLabelTurnAround);
        updateLayoutWaringInfo(towerCraneRunData.judgeTorqueIsWaring(), textTorque, layoutTorque, textLabelTorque);
        updateLayoutWaringInfo(towerCraneRunData.judgeWeightIsWaring(), textWeight, layoutWeight, textLabelWeight);
        updateLayoutWaringInfo(towerCraneRunData.judgeWindPowerIsWaring(), textWindPower, layoutWindPower, textLabelWindPower);
        updateLayoutWaringInfo(towerCraneRunData.judgeAmplitudeIsWaring(), textAmplitude, layoutAmplitude, textLabelAmplitude);

        updateLayoutStatusInfo(towerCraneRunData.getUpDownStatus() == Constant.Status_Up_Or_Down.Up,
                textUp, layoutUp, imageUp, R.drawable.shangxing_sel, R.drawable.shangxing);
        updateLayoutStatusInfo(towerCraneRunData.getUpDownStatus() == Constant.Status_Up_Or_Down.Down,
                textDown, layoutDown, imageDown, R.drawable.xiaxing_sel, R.drawable.xiaxing);
        updateLayoutStatusInfo(towerCraneRunData.getLeftRightStatus() == Constant.Status_Left_Or_Right.Left,
                textLeft, layoutLeft, imageLeft, R.drawable.zuozhaun_sel, R.drawable.zuozhaun);
        updateLayoutStatusInfo(towerCraneRunData.getLeftRightStatus() == Constant.Status_Left_Or_Right.Right,
                textRight, layoutRight, imageRight, R.drawable.youzhuan_sel, R.drawable.youzhuan);
        updateLayoutStatusInfo(towerCraneRunData.getFrontBackStatus() == Constant.Status_Front_Or_Back.Front,
                textFront, layoutFront, imageFront, R.drawable.qianxing_sel, R.drawable.qianxing);
        updateLayoutStatusInfo(towerCraneRunData.getFrontBackStatus() == Constant.Status_Front_Or_Back.Back,
                textBack, layoutBack, imageBack, R.drawable.houxing_sel, R.drawable.houxing);

        Boolean cordIsHarm = towerCraneRunData.judgeCordIsHarm();
        int viewStatus = cordIsHarm ? View.VISIBLE : View.GONE;
        textLabelCordHarmNumber.setVisibility(viewStatus);
        textCordHarmNumber.setVisibility(viewStatus);
        textLabelCordHarmPos.setVisibility(viewStatus);
        textCordHarmPos.setVisibility(viewStatus);

        if (cordIsHarm) {
            textCordHarmNumber.setText(towerCraneRunData.getCordHarmNumberStr());
            textCordHarmPos.setText(towerCraneRunData.getCordHarmPosStr());
        }
        textCordPos.setText(towerCraneRunData.getCordPosStr());

        textBackArmLength.setText(towerCraneRunData.getBackArmLength());
        textBigArmLength.setText(towerCraneRunData.getBigArmLength());
        textMaxHeight.setText(towerCraneRunData.getMaxHeight());
        textNowPosHeight.setText(towerCraneRunData.getNowPosMaxWeight());

        drawView.setRunData(towerCraneRunData);

        updateThingPos(towerCraneRunData);

        ArrayList<String> waringStrList = towerCraneRunData.getWaringStrList();
        if (waringStrList.size() == 0) {
            imageWaring.setImageDrawable(activity.getDrawable(R.drawable.baojing));
        } else {
            imageWaring.setImageDrawable(activity.getDrawable(R.drawable.baojing_sel));
        }
        layoutWaring_1.setVisibility(View.INVISIBLE);
        layoutWaring_2.setVisibility(View.INVISIBLE);
        layoutWaring_3.setVisibility(View.INVISIBLE);
        for (int i = 0; i < waringStrList.size(); i++) {
            if (i == 0) {
                layoutWaring_1.setVisibility(View.VISIBLE);
                textWaring_1.setText(waringStrList.get(i));
            } else if (i == 1) {
                layoutWaring_2.setVisibility(View.VISIBLE);
                textWaring_2.setText(waringStrList.get(i));
            } else if (i == 2) {
                layoutWaring_3.setVisibility(View.VISIBLE);
                textWaring_3.setText(waringStrList.get(i));
            }
        }


        //自适应frameLayoutTower和frameLayoutTowerImage
        int towerHeight = frameLayoutTower.getMeasuredHeight();
        int towerImageHeight = frameLayoutTowerImage.getMeasuredHeight();
        int disHeight = towerHeight - towerImageHeight;

        if (disHeight < 0) {
            disHeight = Tool.getDPIRatioNum(activity, 10);
            frameLayoutTowerImage.setScaleX((float) (towerHeight - disHeight) / towerImageHeight);
            frameLayoutTowerImage.setScaleY((float) (towerHeight - disHeight) / towerImageHeight);
            LinearLayout.LayoutParams lpTowerImage = new LinearLayout.LayoutParams(getDpNum(180), getDpNum(160));
            lpTowerImage.setMargins(0, 0, 0, (towerHeight - towerImageHeight - disHeight) / 2);
            frameLayoutTowerImage.setLayoutParams(lpTowerImage);
        }

        FrameLayout.LayoutParams lpBackArm = new FrameLayout.LayoutParams(LinearLayout.LayoutParams.WRAP_CONTENT, LinearLayout.LayoutParams.WRAP_CONTENT);
        lpBackArm.setMargins(getDpNum(6), disHeight, 0, 0);
        layoutBackArm.setLayoutParams(lpBackArm);

        FrameLayout.LayoutParams lpBigArm = new FrameLayout.LayoutParams(LinearLayout.LayoutParams.WRAP_CONTENT, LinearLayout.LayoutParams.WRAP_CONTENT);
        lpBigArm.setMargins(getDpNum(110), disHeight, 0, 0);
        layoutBigArm.setLayoutParams(lpBigArm);

        FrameLayout.LayoutParams lpMaxHeight = new FrameLayout.LayoutParams(LinearLayout.LayoutParams.WRAP_CONTENT, LinearLayout.LayoutParams.WRAP_CONTENT);
        lpMaxHeight.setMargins(getDpNum(12), disHeight + getDpNum(70), 0, 0);
        layoutMaxHeight.setLayoutParams(lpMaxHeight);
    }

    @Override
    public void onUICreate(MainActivity activityIn) {
        activity = activityIn;

        textNumber = activity.findViewById(R.id.text_number);
        textSpecifications = activity.findViewById(R.id.text_specifications);
        textMonitorNumber = activity.findViewById(R.id.text_monitorNumber);
        textMagnification = activity.findViewById(R.id.text_magnification);

        textWireRope = activity.findViewById(R.id.text_wire_rope);
        textLoad = activity.findViewById(R.id.text_load);
        textHeight = activity.findViewById(R.id.text_height);
        textTurnAround = activity.findViewById(R.id.text_turn_around);
        textTorque = activity.findViewById(R.id.text_torque);
        textWeight = activity.findViewById(R.id.text_weight);
        textWindPower = activity.findViewById(R.id.text_wind_power);
        textAmplitude = activity.findViewById(R.id.text_amplitude);

        textLabelWireRope = activity.findViewById(R.id.wire_rope);
        textLabelLoad = activity.findViewById(R.id.load);
        textLabelHeight = activity.findViewById(R.id.height);
        textLabelTurnAround = activity.findViewById(R.id.turn_around);
        textLabelTorque = activity.findViewById(R.id.torque);
        textLabelWeight = activity.findViewById(R.id.weight);
        textLabelWindPower = activity.findViewById(R.id.wind_power);
        textLabelAmplitude = activity.findViewById(R.id.amplitude);

        layoutWireRope = activity.findViewById(R.id.layout_wire_rope);
        layoutLoad = activity.findViewById(R.id.layout_load);
        layoutHeight = activity.findViewById(R.id.layout_height);
        layoutTurnAround = activity.findViewById(R.id.layout_turn_around);
        layoutTorque = activity.findViewById(R.id.layout_torque);
        layoutWeight = activity.findViewById(R.id.layout_weight);
        layoutWindPower = activity.findViewById(R.id.layout_wind_power);
        layoutAmplitude = activity.findViewById(R.id.layout_amplitude);

        layoutUp = activity.findViewById(R.id.layout_up);
        layoutDown = activity.findViewById(R.id.layout_down);
        layoutLeft = activity.findViewById(R.id.layout_left);
        layoutRight = activity.findViewById(R.id.layout_right);
        layoutFront = activity.findViewById(R.id.layout_front);
        layoutBack = activity.findViewById(R.id.layout_back);

        imageUp = activity.findViewById(R.id.img_up);
        imageDown = activity.findViewById(R.id.img_down);
        imageLeft = activity.findViewById(R.id.img_left);
        imageRight = activity.findViewById(R.id.img_right);
        imageFront = activity.findViewById(R.id.img_front);
        imageBack = activity.findViewById(R.id.img_back);

        textUp = activity.findViewById(R.id.text_up);
        textDown = activity.findViewById(R.id.text_down);
        textLeft = activity.findViewById(R.id.text_left);
        textRight = activity.findViewById(R.id.text_right);
        textFront = activity.findViewById(R.id.text_front);
        textBack = activity.findViewById(R.id.text_back);

        textLabelCordHarmNumber = activity.findViewById(R.id.cord_harm_number);
        textCordHarmNumber = activity.findViewById(R.id.text_cord_harm_number);
        textLabelCordPos = activity.findViewById(R.id.cord_pos);
        textCordPos = activity.findViewById(R.id.text_cord_pos);
        textLabelCordHarmPos = activity.findViewById(R.id.cord_harm_pos);
        textCordHarmPos = activity.findViewById(R.id.text_cord_harm_pos);

        textBackArmLength = activity.findViewById(R.id.text_back_arm_length);
        textBigArmLength = activity.findViewById(R.id.text_big_arm_length);
        textMaxHeight = activity.findViewById(R.id.text_max_height);
        textNowPosHeight = activity.findViewById(R.id.text_now_pos_max_weight);

        drawView = activity.findViewById(R.id.DrawView_view);

        frameLayoutThing = activity.findViewById(R.id.frame_layout_thing);

        imageThing = activity.findViewById(R.id.image_thing);

        imageWaring = activity.findViewById(R.id.image_waring);

        layoutWaring_1 = activity.findViewById(R.id.layout_waring_1);
        layoutWaring_2 = activity.findViewById(R.id.layout_waring_2);
        layoutWaring_3 = activity.findViewById(R.id.layout_waring_3);

        textWaring_1 = activity.findViewById(R.id.text_waring_1);
        textWaring_2 = activity.findViewById(R.id.text_waring_2);
        textWaring_3 = activity.findViewById(R.id.text_waring_3);

        frameLayoutTower = activity.findViewById(R.id.frame_layout_tower);
        frameLayoutTowerImage = activity.findViewById(R.id.frame_layout_tower_image);

        layoutBackArm = activity.findViewById(R.id.layout_back_arm);
        layoutBigArm = activity.findViewById(R.id.layout_big_arm);
        layoutMaxHeight = activity.findViewById(R.id.layout_max_height);
    }

    @Override
    public void onUIStart() {
        textNumber.setText(TowerCraneData.getInstance().getNumberStr());
        textSpecifications.setText(TowerCraneData.getInstance().getSpecificationsStr());
        textMonitorNumber.setText(TowerCraneData.getInstance().getMonitorNumber());
        textMagnification.setText(TowerCraneData.getInstance().getMagnificationStr());
    }

    @Override
    public void onUIDestroy() {

    }

    @Override
    public void onClick(View view) {

    }
}
