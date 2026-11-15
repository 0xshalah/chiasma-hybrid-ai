package com.chiasma.app.ui

import androidx.compose.foundation.layout.padding
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import com.chiasma.app.data.ContextNode
import com.chiasma.app.data.FrictionScore
import com.chiasma.app.ui.components.ExtensionStage
import com.chiasma.app.ui.components.StagePill
import com.chiasma.app.ui.theme.Canvas
import com.chiasma.app.ui.theme.Surface

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun MainScreen(
    stage: ExtensionStage,
    friction: FrictionScore?,
    recentNodes: List<ContextNode>,
    pendingCount: Int,
    onCaptureVoice: () -> Unit,
    onScanBoard: () -> Unit,
) {
    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Text(
                        text = "CHIASMA",
                        style = androidx.compose.material3.MaterialTheme.typography.headlineMedium,
                    )
                },
                actions = {
                    StagePill(stage = stage)
                    androidx.compose.foundation.layout.Spacer(
                        modifier = Modifier.padding(end = 16.dp)
                    )
                },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = Surface),
            )
        },
        containerColor = Canvas,
    ) { innerPadding ->
        HomeScreen(
            stage = stage,
            friction = friction,
            recentNodes = recentNodes,
            pendingCount = pendingCount,
            onCaptureVoice = onCaptureVoice,
            onScanBoard = onScanBoard,
            modifier = Modifier.padding(innerPadding),
        )
    }
}
