package com.chiasma.app

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.chiasma.app.capture.VoiceCaptureManager
import com.chiasma.app.data.ContextNode
import com.chiasma.app.data.FrictionScore
import com.chiasma.app.data.LocalDatabase
import com.chiasma.app.ui.MainScreen
import com.chiasma.app.ui.components.ExtensionStage
import com.chiasma.app.ui.theme.ChiasmaTheme
import kotlinx.coroutines.flow.flowOf

class MainActivity : ComponentActivity() {

    private lateinit var voiceCaptureManager: VoiceCaptureManager

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()

        voiceCaptureManager = VoiceCaptureManager(this)

        setContent {
            ChiasmaTheme {
                // Scaffold state — will be replaced by ViewModel in production
                val db = LocalDatabase.getInstance(this)
                val pendingCount by db.pendingNodeDao().count()
                    .collectAsState(initial = 0)

                // TODO: replace with ViewModel observing FirestoreRepository
                val stage = ExtensionStage.IDLE
                val friction: FrictionScore? = null
                val recentNodes: List<ContextNode> = emptyList()

                MainScreen(
                    stage = stage,
                    friction = friction,
                    recentNodes = recentNodes,
                    pendingCount = pendingCount,
                    onCaptureVoice = {
                        voiceCaptureManager.start()
                    },
                    onScanBoard = {
                        // TODO: launch camera intent, pass bitmap to WhiteboardCaptureManager
                    },
                )
            }
        }
    }

    override fun onDestroy() {
        super.onDestroy()
        voiceCaptureManager.stop()
    }
}
