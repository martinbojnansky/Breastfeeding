/* While this template provides a good starting point for using Wear Compose, you can always
 * take a look at https://github.com/android/wear-os-samples/tree/main/ComposeStarter and
 * https://github.com/android/wear-os-samples/tree/main/ComposeAdvanced to find the most up to date
 * changes to the libraries and their usages.
 */

package com.bojnansky.zoe.presentation

import android.content.Intent
import android.os.Bundle
import android.speech.tts.TextToSpeech
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.ScrollState
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.tooling.preview.Devices
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.wear.compose.material.Button
import androidx.wear.compose.material.MaterialTheme
import androidx.wear.compose.material.Text
import com.bojnansky.zoe.presentation.theme.FireBotTheme
import com.bojnansky.zoe.presentation.viewmodel.MainViewModel

class MainActivity : ComponentActivity(), TextToSpeech.OnInitListener {
    private val vm = MainViewModel(this)

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            WearApp(vm)
        }
        vm.initTextToSpeech()
    }

    override fun onActivityResult(
        requestCode: Int, resultCode: Int,
        data: Intent?
    ) {
        vm.afterListen(resultCode, requestCode, data)
        super.onActivityResult(requestCode, resultCode, data)
    }

    override fun onInit(p0: Int) {
        vm.configureTextToSpeech(p0)
    }
}

@Composable
fun WearApp(vm: MainViewModel) {
    FireBotTheme {
        /* If you have enough items in your list, use [ScalingLazyColumn] which is an optimized
         * version of LazyColumn for wear devices with some added features. For more information,
         * see d.android.com/wear/compose.
         */
        Column(
            modifier = Modifier
                .fillMaxSize()
                .background(MaterialTheme.colors.background)
                .verticalScroll(ScrollState(0)),
            verticalArrangement = Arrangement.Center,
            horizontalAlignment = Alignment.CenterHorizontally,
        ) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(MaterialTheme.colors.background),
                horizontalArrangement = Arrangement.SpaceAround
            ) {
                Button(
                    modifier = Modifier.background(MaterialTheme.colors.primary, CircleShape),
                    onClick = fun () { vm.runCommand("last feeding") }
                ) {
                    Text("Report")
                }
                Button(
                    modifier = Modifier.background(MaterialTheme.colors.primary, CircleShape),
                    onClick = fun () { vm.listen() }
                ) {
                    Text("Talk")
                }
            }
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(MaterialTheme.colors.background),
                horizontalArrangement = Arrangement.SpaceAround
            ) {
                Button(
                    modifier = Modifier.background(MaterialTheme.colors.primary, CircleShape),
                    onClick = fun () { vm.runCommand("start feeding") }
                ) {
                    Text("Start")
                }
                Button(
                    modifier = Modifier.background(MaterialTheme.colors.primary, CircleShape),
                    onClick = fun () { vm.runCommand("end feeding") }
                ) {
                    Text("Stop")
                }
            }
            Text(
                modifier = Modifier.fillMaxWidth().padding(top = 10.dp),
                textAlign = TextAlign.Center,
                color = MaterialTheme.colors.primary,
                text = vm.state.value.text
            )
        }
    }
}

@Preview(device = Devices.WEAR_OS_SMALL_ROUND, showSystemUi = true)
@Composable
fun DefaultPreview() {
    WearApp(MainViewModel(MainActivity()))
}