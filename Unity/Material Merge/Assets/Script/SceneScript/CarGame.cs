using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class CarGame : MonoBehaviour
{
    public Transform myCar;
    private Rigidbody2D _rigidbody2D;
    private Vector2 _speed = new Vector2(0, 0.1f);
    // Start is called before the first frame update
    void Start()
    {
        _rigidbody2D = myCar.GetComponent<Rigidbody2D>();
        _rigidbody2D.gravityScale = 0;
    }

    // Update is called once per frame
    void FixedUpdate()
    {
        if (Input.GetKeyDown(KeyCode.A))
        {
            _speed.x = _speed.x - 0.01f;
            if (_speed.x <= -1 * _speed.y)
            {
                _speed.x = -1 * _speed.y;
            }
        }
        else if (Input.GetKeyDown(KeyCode.D))
        {
            _speed.x = _speed.x + 0.01f;
            if (_speed.x >= _speed.y)
            {
                _speed.x = _speed.y;
            }
        }
        else
        {
            if (_speed.x > 0.01f)
            {
                _speed.x = _speed.x - 0.01f;
            }
            else if (_speed.x < -0.01f)
            {
                _speed.x = _speed.x + 0.01f;
            }
            else
            {
                _speed.x = 0;
            }
        }

        _rigidbody2D.MovePosition(new Vector2(myCar.position.x, myCar.position.y) + _speed);
        _rigidbody2D.MoveRotation(Mathf.Atan(_speed.x / _speed.y) * Mathf.Rad2Deg);

        Debug.Log(_speed);
    }
}
