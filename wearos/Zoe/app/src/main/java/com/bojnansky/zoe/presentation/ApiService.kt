package com.bojnansky.zoe.presentation

import retrofit2.Call
import retrofit2.http.POST
import retrofit2.http.Query

interface ApiService {
    @POST("macros/s/AKfycbyvste5gKHjoe6YmvPf1GtoyZIc85w2JdVbE_cTXhCyo5CHD7EI3NGPUaWWrvQFPYyDug/exec")
    fun runCommand(@Query("command") command: String): Call<String>
}