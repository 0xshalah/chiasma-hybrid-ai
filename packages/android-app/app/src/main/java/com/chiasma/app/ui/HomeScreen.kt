package com.chiasma.app.ui

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.chiasma.app.data.ContextNode
import com.chiasma.app.data.FrictionScore
import com.chiasma.app.ui.components.ContextNodeCard
import com.chiasma.app.ui.components.ExtensionStage
import com.chiasma.app.ui.components.FrictionBar
import com.chiasma.app.ui.components.PendingBadge
import com.chiasma.app.ui.components.StagePill
import com.chiasma.app.ui.theme.InkMuted
import com.chiasma.app.ui.theme.System2

@Composable
fun HomeScreen(
    stage: ExtensionStage,
    friction: FrictionScore?,
    recentNodes: List<ContextNode>,
    pendingCount: Int,
    onCaptureVoice: () -> Unit,
    onScanBoard: () -> Unit,
    modifier: Modifier = Modifier,
) {
    LazyColumn(
        modifier = modifier
            .fillMaxSize()
            .padding(horizontal = 16.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp),
    ) {
        // ── Friction card ───────────────────────────────
        item {
            Spacer(modifier = Modifier.height(8.dp))
            FrictionBar(
                friction = friction,
                modifier = Modifier.fillMaxWidth(),
            )
        }

        // ── High friction chip ──────────────────────────
        if ((friction?.value ?: 0f) > 0.75f) {
            item {
                Text(
                    text = "High friction — consider escalating",
                    style = MaterialTheme.typography.labelSmall,
                    color = System2,
                )
            }
        }

        // ── Recent context nodes ────────────────────────
        item {
            Text(
                text = "Recent context",
                style = MaterialTheme.typography.labelMedium,
                color = InkMuted,
            )
        }

        if (recentNodes.isEmpty()) {
            item {
                Text(
                    text = "No context captured yet.",
                    style = MaterialTheme.typography.bodySmall,
                    color = InkMuted,
                )
            }
        } else {
            items(recentNodes, key = { it.id }) { node ->
                ContextNodeCard(node = node, modifier = Modifier.fillMaxWidth())
            }
        }

        // ── Capture buttons ─────────────────────────────
        item {
            Spacer(modifier = Modifier.height(4.dp))

            Button(
                onClick = onCaptureVoice,
                modifier = Modifier.fillMaxWidth(),
                colors = ButtonDefaults.buttonColors(
                    containerColor = MaterialTheme.colorScheme.primary,
                ),
            ) {
                Text("Capture Voice")
            }

            Spacer(modifier = Modifier.height(8.dp))

            OutlinedButton(
                onClick = onScanBoard,
                modifier = Modifier.fillMaxWidth(),
            ) {
                Text("Scan Board")
            }
        }

        // ── Pending badge ───────────────────────────────
        item {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.End,
            ) {
                PendingBadge(count = pendingCount)
            }
            Spacer(modifier = Modifier.height(16.dp))
        }
    }
}
