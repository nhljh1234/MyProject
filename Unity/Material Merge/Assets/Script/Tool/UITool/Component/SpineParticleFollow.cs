using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using Spine;
using Spine.Unity;

namespace TJ_UNITY_TOOL
{
    public class SpineParticleFollow : MonoBehaviour
    {
        //跟随的结点
        public string boneName;
        public Transform particle;
        public Vector2 offset = Vector2.zero;
        private SkeletonAnimation _skeletonAnimation;
		private Bone _bone = null;
        void Start()
        {
			_skeletonAnimation = GetComponent<SkeletonAnimation>();
			_bone = _skeletonAnimation.skeleton.FindBone(boneName);
        }

        // Update is called once per frame
        void Update()
        {
			if (_bone != null && particle) 
			{
				particle.position = new Vector3(_bone.worldX + transform.position.x + offset.x, 
                _bone.worldY + transform.position.y + offset.y, 0);
			}
        }
    }
}
