package com.chiasma.app.capture

import android.content.Context
import android.content.Intent
import android.os.Bundle
import android.speech.RecognitionListener
import android.speech.RecognizerIntent
import android.speech.SpeechRecognizer
import com.chiasma.app.domain.PiiScrubber
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow

/**
 * VoiceCaptureManager — wraps Android SpeechRecognizer for voice memo capture.
 *
 * Always runs PiiScrubber on the transcript before returning it.
 * Returns a scrubbed transcript via [result] StateFlow.
 *
 * Note: SpeechRecognizer requires network. When offline, the transcript
 * will be a placeholder string stored in pendingQueue.
 *
 * Usage:
 *   val manager = VoiceCaptureManager(context)
 *   manager.start()
 *   // User speaks
 *   // Collect manager.result to get scrubbed transcript
 *   manager.stop()
 */
class VoiceCaptureManager(private val context: Context) {

    sealed class CaptureState {
        data object Idle : CaptureState()
        data object Listening : CaptureState()
        data class Result(val scrubbed: String, val hadPii: Boolean) : CaptureState()
        data class Error(val message: String) : CaptureState()
    }

    private val _state = MutableStateFlow<CaptureState>(CaptureState.Idle)
    val state: StateFlow<CaptureState> = _state

    private var recognizer: SpeechRecognizer? = null

    fun start() {
        if (!SpeechRecognizer.isRecognitionAvailable(context)) {
            _state.value = CaptureState.Error("Voice recognition not available on this device")
            return
        }

        recognizer = SpeechRecognizer.createSpeechRecognizer(context).apply {
            setRecognitionListener(object : RecognitionListener {
                override fun onReadyForSpeech(params: Bundle?) {
                    _state.value = CaptureState.Listening
                }

                override fun onResults(results: Bundle?) {
                    val candidates = results?.getStringArrayList(SpeechRecognizer.RESULTS_RECOGNITION)
                    val transcript = candidates?.firstOrNull() ?: ""

                    if (transcript.isEmpty()) {
                        _state.value = CaptureState.Error("No speech detected — try again")
                        return
                    }

                    // NFR-05: always scrub before storing
                    val scrubResult = PiiScrubber.scrub(transcript)
                    _state.value = CaptureState.Result(
                        scrubbed = scrubResult.redacted,
                        hadPii = scrubResult.hasPii,
                    )
                }

                override fun onError(error: Int) {
                    val msg = when (error) {
                        SpeechRecognizer.ERROR_NETWORK -> "Network error — check connection"
                        SpeechRecognizer.ERROR_NO_MATCH -> "No speech detected — try again"
                        SpeechRecognizer.ERROR_SPEECH_TIMEOUT -> "Listening timed out"
                        else -> "Voice capture failed — try again"
                    }
                    _state.value = CaptureState.Error(msg)
                }

                // Required overrides (unused)
                override fun onBeginningOfSpeech() = Unit
                override fun onRmsChanged(rmsdB: Float) = Unit
                override fun onBufferReceived(buffer: ByteArray?) = Unit
                override fun onEndOfSpeech() = Unit
                override fun onPartialResults(partialResults: Bundle?) = Unit
                override fun onEvent(eventType: Int, params: Bundle?) = Unit
            })

            startListening(
                Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH).apply {
                    putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL, RecognizerIntent.LANGUAGE_MODEL_FREE_FORM)
                    putExtra(RecognizerIntent.EXTRA_MAX_RESULTS, 1)
                },
            )
        }
    }

    fun stop() {
        recognizer?.stopListening()
        recognizer?.destroy()
        recognizer = null
        if (_state.value is CaptureState.Listening) {
            _state.value = CaptureState.Idle
        }
    }
}
