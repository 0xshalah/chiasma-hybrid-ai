package com.chiasma.app.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import com.chiasma.app.data.ContextNode
import com.chiasma.app.ui.theme.Hairline
import com.chiasma.app.ui.theme.Ink
import com.chiasma.app.ui.theme.InkMuted
import com.chiasma.app.ui.theme.InkSecondary
import com.chiasma.app.ui.theme.Surface
import com.chiasma.app.ui.theme.System1Soft
import com.chiasma.app.ui.theme.System2Soft

@Composable
fun ContextNodeCard(node: ContextNode, modifier: Modifier = Modifier) {
    val surfaceBg = when (node.surface) {
        "chrome-extension" -> System2Soft
        "android-app" -> System1Soft
        else -> Surface
    }

    val surfaceIcon = when (node.surface) {
        "chrome-extension" -> "🌐"
        "android-app" -> "📱"
        else -> "💡"
    }

    Row(
        modifier = modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(8.dp))
            .background(Surface)
            .padding(12.dp),
        verticalAlignment = Alignment.Top,
    ) {
        // Surface badge
        Text(
            text = surfaceIcon,
            style = MaterialTheme.typography.bodyMedium,
        )

        Spacer(modifier = Modifier.width(10.dp))

        Column(modifier = Modifier.weight(1f)) {
            // Source
            Text(
                text = node.packet.source,
                style = MaterialTheme.typography.labelMedium,
                color = Ink,
                maxLines = 1,
                overflow = TextOverflow.Ellipsis,
            )

            // Summary (max 80 chars)
            val summary = if (node.packet.summary.length > 80)
                node.packet.summary.take(80) + "…"
            else
                node.packet.summary

            Text(
                text = "\"$summary\"",
                style = MaterialTheme.typography.bodySmall,
                color = InkSecondary,
                maxLines = 2,
                overflow = TextOverflow.Ellipsis,
                modifier = Modifier.padding(top = 2.dp),
            )

            // Footer: tokens + time
            Text(
                text = "${node.packet.tokenCount} tokens · ${formatRelativeTime(node.createdAt)}",
                style = MaterialTheme.typography.labelSmall,
                color = InkMuted,
                modifier = Modifier.padding(top = 4.dp),
            )
        }
    }
}

private fun formatRelativeTime(isoTimestamp: String): String {
    return try {
        val instant = java.time.Instant.parse(isoTimestamp)
        val now = java.time.Instant.now()
        val seconds = java.time.Duration.between(instant, now).seconds
        when {
            seconds < 60 -> "${seconds}s ago"
            seconds < 3600 -> "${seconds / 60}m ago"
            seconds < 86400 -> "${seconds / 3600}h ago"
            else -> "${seconds / 86400}d ago"
        }
    } catch (e: Exception) {
        "unknown"
    }
}
