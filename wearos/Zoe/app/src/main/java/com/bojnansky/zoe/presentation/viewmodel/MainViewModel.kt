package com.bojnansky.zoe.presentation.viewmodel

import android.content.Intent
import android.speech.RecognizerIntent
import android.speech.tts.TextToSpeech
import androidx.compose.runtime.State
import androidx.compose.runtime.mutableStateOf
import androidx.lifecycle.ViewModel
import com.bojnansky.zoe.presentation.service.ApiService
import com.bojnansky.zoe.presentation.MainActivity
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import retrofit2.Retrofit
import retrofit2.converter.scalars.ScalarsConverterFactory
import java.util.*

data class MainViewModelState(var text: String = "")

class MainViewModel : ViewModel {
    private val activity: MainActivity
    private var tts: TextToSpeech? = null;
    private val _state = mutableStateOf(MainViewModelState())

    val state: State<MainViewModelState> = _state

    constructor(activity: MainActivity) {
        this.activity = activity
    }

    fun initTextToSpeech() {
        this.tts = TextToSpeech(activity.applicationContext, activity);
    }

    fun configureTextToSpeech(p0: Int) {
        if(p0 == TextToSpeech.SUCCESS) {
           this.tts!!.language = Locale.US;
        }
    }

    fun listen() {
        _state.value = MainViewModelState(text = "..")
        val intent = Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH)
        intent.putExtra(
            RecognizerIntent.EXTRA_LANGUAGE_MODEL,
            RecognizerIntent.LANGUAGE_MODEL_FREE_FORM
        )
        // This starts the activity and populates the intent with the speech text.
        activity.startActivityForResult(intent, 0)
    }

    fun afterListen(requestCode: Int, resultCode: Int, data: Intent?) {
        // if (requestCode == 0 && resultCode == ComponentActivity.RESULT_OK) {
            val results: List<String>? = data?.getStringArrayListExtra(
                RecognizerIntent.EXTRA_RESULTS
            )
            val command = results!![0] ?: ""
            if(command == "") {
                _state.value = MainViewModelState(text = "")
                return;
            }
            runCommand(command)
        // }
    }

    fun runCommand(command: String) {
        _state.value = MainViewModelState(text = "Please wait")
        val service = Retrofit.Builder()
            .baseUrl("https://script.google.com/")
            .addConverterFactory(ScalarsConverterFactory.create())
            .build()
            .create(ApiService::class.java)

        service.runCommand(command).enqueue(object : Callback<String?> {
            override fun onFailure(call: Call<String?>, t: Throwable) {
                _state.value = MainViewModelState(text = "Network error")
                speak("Network error. Try again, please.")
            }

            override fun onResponse(call: Call<String?>, response: Response<String?>) {
                val reply = response.body().orEmpty();
                if (reply.isNotBlank()) {
                    _state.value = MainViewModelState(text = reply)
                    speak(reply);
                }
            }

        })
    }

    private fun speak(text: String) {
        tts!!.speak(text, TextToSpeech.QUEUE_FLUSH, null, "")
    }
}