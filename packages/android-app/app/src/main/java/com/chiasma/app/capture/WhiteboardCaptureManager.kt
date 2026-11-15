package com.chiasma.app.capture

import android.graphics.Bitmap
import com.chiasma.app.domain.PiiScrubber
import com.google.mlkit.vision.common.InputImage
import com.google.mlkit.vision.text.TextRecognition
import com.google.mlkit.vision.text.latin.TextRecognizerOptions
import kotlinx.coroutines.suspendCancellableCoroutine
import kotlin.coroutines.resume
import kotlin.coroutines.resumeWithException

/**
 * WhiteboardCaptureManager — ML Kit text recognition on camera photos.
 *
 * Usage:
 *   1. User taps "Scan Board"
 *   2. Camera activity returns a Bitmap
 *   3. Call recognizeText(bitmap) → returns scrubbed text
 *   4. Show preview to user, then save as ContextNode
 */
class WhiteboardCaptureManager {

    private val recognizer = TextRecognition.getClient(TextRecognizerOptions.DEFAULT_OPTIONS)

    sealed class RecognitionResult {
        data class Success(val scrubbed: String, val hadPii: Boolean) : RecognitionResult()
        data class Empty(val reason: String) : RecognitionResult()
        data class Failure(val error: String) : RecognitionResult()
    }

    /**
     * Run ML Kit text recognition on a Bitmap.
     * Always scrubs PII from the extracted text before returning.
     */
    suspend fun recognizeText(bitmap: Bitmap): RecognitionResult {
        val image = InputImage.fromBitmap(bitmap, 0)

        return suspendCancellableCoroutine { cont ->
            recognizer.process(image)
                .addOnSuccessListener { visionText ->
                    val rawText = visionText.text.trim()
                    if (rawText.isEmpty()) {
                        cont.resume(
                            RecognitionResult.Empty("No text detected — try better lighting"),
                        )
                        return@addOnSuccessListener
                    }

                    // NFR-05: always scrub before storing
                    val scrubResult = PiiScrubber.scrub(rawText)
                    cont.resume(
                        RecognitionResult.Success(
                            scrubbed = scrubResult.redacted,
                            hadPii = scrubResult.hasPii,
                        ),
                    )
                }
                .addOnFailureListener { e ->
                    cont.resume(RecognitionResult.Failure(e.message ?: "OCR failed"))
                }
        }
    }

    fun close() {
        recognizer.close()
    }
}
