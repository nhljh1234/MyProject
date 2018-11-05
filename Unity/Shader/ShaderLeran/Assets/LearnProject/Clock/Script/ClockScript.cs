using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System;

public class ClockScript : MonoBehaviour {

    private Transform HourArmTransform;
    private Transform MinuteArmTransform;
    private Transform SecondArmTransform;

    //是否使用1秒钟跳一次这样的表现形式
    public bool useJumpType = true;

    const float DEGREES_PER_HOUR = 30f, DEGREES_PER_MINUTE = 6f, DEGREES_PER_SECOND = 6f;

    // Use this for initialization
    void Start ()
    {
        HourArmTransform = transform.Find("Hour Arm");
        MinuteArmTransform = transform.Find("Minute Arm");
        SecondArmTransform = transform.Find("Second Arm");
    }
	
	// Update is called once per frame
	void Update ()
    {
        showTime();
	}

    private void showTime ()
    {
        if (useJumpType)
        {
            DateTime time = DateTime.Now;
            float hour, minute;
            minute = time.Minute + time.Second / 60f;
            hour = time.Hour + minute / 60f;
            HourArmTransform.localRotation = Quaternion.Euler(0f, hour * DEGREES_PER_HOUR, 0f);
            MinuteArmTransform.localRotation = Quaternion.Euler(0f, minute * DEGREES_PER_MINUTE, 0f);
            SecondArmTransform.localRotation = Quaternion.Euler(0f, time.Second * DEGREES_PER_SECOND, 0f);
        }
        else
        {
            TimeSpan time = DateTime.Now.TimeOfDay;
            HourArmTransform.localRotation = Quaternion.Euler(0f, (float)time.TotalHours * DEGREES_PER_HOUR, 0f);
            MinuteArmTransform.localRotation = Quaternion.Euler(0f, (float)time.TotalMinutes * DEGREES_PER_MINUTE, 0f);
            SecondArmTransform.localRotation = Quaternion.Euler(0f, (float)time.TotalSeconds * DEGREES_PER_SECOND, 0f);
        }
    }
}
