using Spine.Unity;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class XiunvCtrl : MonoBehaviour
{

    [SpineAnimation]
    public string aniName1;

    [SpineAnimation]
    public string aniName2;


    SkeletonAnimation skeletonAnimation;

    // Spine.AnimationState and Spine.Skeleton are not Unity-serialized objects. You will not see them as fields in the inspector.
    public Spine.AnimationState spineAnimationState;
    public Spine.Skeleton skeleton;

    void Start()
    {
        // Make sure you get these AnimationState and Skeleton references in Start or Later.
        // Getting and using them in Awake is not guaranteed by default execution order.
        skeletonAnimation = GetComponent<SkeletonAnimation>();
        //Debug.Log(skeletonAnimation.skeletonDataAsset.GetAnimationStateData().DefaultMix);
        spineAnimationState = skeletonAnimation.AnimationState;
        skeleton = skeletonAnimation.Skeleton;

        StartCoroutine(DoDemoRoutine());
    }

    IEnumerator DoDemoRoutine()
    {
        while (true)
        {
            spineAnimationState.SetAnimation(0, aniName1, true);
            yield return new WaitForSeconds(3.5f);

            //spineAnimationState.SetAnimation(0, aniName1, false);
            spineAnimationState.SetAnimation(0, aniName2, true);
            yield return new WaitForSeconds(3);

            //spineAnimationState.SetEmptyAnimation(0, 4);
            //yield return new WaitForSeconds(4);

        }
    }
}

