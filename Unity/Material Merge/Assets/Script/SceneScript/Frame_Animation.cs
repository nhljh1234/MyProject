using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class Frame_Animation : MonoBehaviour
{

    public GameObject sprite;
    public Button button_1;
    public Button button_2;

    // Use this for initialization
    void Start()
    {
        Animator animator = sprite.GetComponent<Animator>();
        button_1.onClick.AddListener(() =>
        {
            animator.SetInteger("ChangeStatus", 1);
        });
        button_2.onClick.AddListener(() =>
		{
			animator.SetInteger("ChangeStatus", 2);
		});
    }

    // Update is called once per frame
    void Update()
    {

    }
}
