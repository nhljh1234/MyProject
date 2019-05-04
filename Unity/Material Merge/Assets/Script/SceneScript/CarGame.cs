using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class CarGame : MonoBehaviour
{
    public Transform myCar;
    private Rigidbody2D _rigidbody2D;
    private readonly float _speedForwad = 10;
    private int status = 0;
    // Start is called before the first frame update
    void Start()
    {
        _rigidbody2D = myCar.GetComponent<Rigidbody2D>();
    }

    private Vector2 GetVelocity()
    {
        float angle = -1 * _rigidbody2D.rotation;
        return new Vector2(_speedForwad * Mathf.Sin(angle *  Mathf.Deg2Rad), 
            _speedForwad * Mathf.Cos(angle * Mathf.Deg2Rad));
    }

    // Update is called once per frame
    void Update()
    {
        if (Input.GetKeyDown(KeyCode.A))
        {
            status = 1;
        }
        else if (Input.GetKeyDown(KeyCode.D))
        {
            status = 2;
        }

        if (Input.GetKeyUp(KeyCode.A) || Input.GetKeyUp(KeyCode.D))
        {
            status = 0;
            _rigidbody2D.angularVelocity = 0;
        }

        if (status == 1)
        {
            _rigidbody2D.angularVelocity = 400;
        }
        else if (status == 2)
        {
            _rigidbody2D.angularVelocity = -400;
        }

        _rigidbody2D.velocity = GetVelocity();
    }
}
