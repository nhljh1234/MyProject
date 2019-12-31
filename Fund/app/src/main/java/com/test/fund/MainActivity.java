package com.test.fund;

import android.os.Bundle;

import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;

import android.os.Handler;
import android.os.Message;
import android.view.Menu;
import android.view.MenuItem;
import android.widget.ListView;

import java.util.ArrayList;

public class MainActivity extends AppCompatActivity {

    private GetInfo getInfo;
    public static final int UPDATE_LIST_VIEW = 1;

    private Handler handler = new Handler() {
        @Override
        public void handleMessage(Message msg) {
            switch (msg.what) {
                case UPDATE_LIST_VIEW:
                    changeListView((ArrayList<StockInfo>)msg.obj);
                    break;
                default:
                    break;
            }
        }
    };

    private void changeListView(ArrayList<StockInfo> stockInfos) {
        StockAdapter stockAdapter = new StockAdapter(MainActivity.this, R.layout.item, stockInfos);
        ((ListView) findViewById(R.id.list_view)).setAdapter(stockAdapter);
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        Toolbar toolbar = findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);

        getInfo = new GetInfo(this);
        InfoSave infoSave = new InfoSave(this);
        String stockInfosStr = infoSave.get(InfoSave.STOCK_INFO_KEY);
        if (stockInfosStr != null) {
            ArrayList<StockInfo> stockInfos = getInfo.GetStockInfosByStr(stockInfosStr);
            Message message = new Message();
            message.what = UPDATE_LIST_VIEW;
            message.obj = stockInfos;
            handler.sendMessage(message); // 将Message对象发送出去
        }
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.menu_main, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        // Handle action bar item clicks here. The action bar will
        // automatically handle clicks on the Home/Up button, so long
        // as you specify a parent activity in AndroidManifest.xml.
        int id = item.getItemId();

        //noinspection SimplifiableIfStatement
        if (id == R.id.action_refresh) {
            new Thread(new Runnable() {
                @Override
                public void run() {
                    ArrayList<StockInfo> stockInfos = getInfo.GetStockInfos();
                    Message message = new Message();
                    message.what = UPDATE_LIST_VIEW;
                    message.obj = stockInfos;
                    handler.sendMessage(message); // 将Message对象发送出去
                }
            }).start();
            return true;
        }

        return super.onOptionsItemSelected(item);
    }
}
