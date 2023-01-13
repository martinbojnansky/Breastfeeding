package com.bojnansky.zoe.presentation.service

import retrofit2.Call
import retrofit2.http.POST
import retrofit2.http.Query

interface ApiService {
    @POST("macros/s/AKfycbzgY6pZ-FYoDfh5OJWHl7mRW_f8u8gksSKps-fvttJizje9ifAwjQFPTTmq1pf2wpxJ5A/exec")
    fun runCommand(@Query("command") command: String): Call<String>
}