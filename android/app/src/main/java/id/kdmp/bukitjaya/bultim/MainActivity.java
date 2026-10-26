package id.kdmp.bukitjaya.bultim;

import android.Manifest;
import android.os.Bundle;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        requestPermissions(
                new String[]{
                        Manifest.permission.CAMERA
                },
                100
        );
    }
}