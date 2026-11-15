package com.chiasma.app.ui.components

import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.tween
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.offset
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import com.chiasma.app.data.FrictionScore
import com.chiasma.app.ui.theme.Hairline
import com.chiasma.app.ui.theme.Ink
import com.chiasma.app.ui.theme.InkMuted
import com.chiasma.app.ui.theme.System1
import com.chiasma.app.ui.theme.System2

private const val THRESHOLD = 0.75f

@Composable
fun FrictionBar(friction: FrictionScore?, modifier: Modifier = Modifier) {
    val value = friction?.value ?: 0f
    val isSystem2 = value >= THRESHOLD

    val animatedPct by animateFloatAsState(
        targetValue = value.coerceIn(0f, 1f),
        animationSpec = tween(durationMillis = 300),
        label = "frictionAnimation",
    )

    Column(modifier = modifier) {
        Row(modifier = Modifier.fillMaxWidth().padding(bottom = 4.dp)) {
            Text(
                text = "Friction",
                style = MaterialTheme.typography.labelSmall,
                color = InkMuted,
                modifier = Modifier.weight(1f),
            )
            Text(
                text = "%.2f".format(value),
                style = MaterialTheme.typography.labelMedium,
                color = if (isSystem2) System2 else Ink,
            )
        }

        Box(
            modifier = Modifier
                .fillMaxWidth()
                .height(8.dp)
                .clip(RoundedCornerShape(50))
                .background(Hairline),
        ) {
            // Animated fill
            Box(
                modifier = Modifier
                    .fillMaxWidth(animatedPct)
                    .height(8.dp)
                    .clip(RoundedCornerShape(50))
                    .background(if (isSystem2) System2 else System1),
            )

            // Threshold marker at 0.75
            Box(
                modifier = Modifier
                    .offset(x = (THRESHOLD * 100).dp * 0.01f) // approximate
                    .width(2.dp)
                    .height(8.dp)
                    .background(Color(0x44161615)),
            )
        }

        Row(modifier = Modifier.fillMaxWidth().padding(top = 4.dp)) {
            Text(
                text = "System 1 (local)",
                style = MaterialTheme.typography.labelSmall,
                color = InkMuted,
                modifier = Modifier.weight(1f),
            )
            Text(
                text = "System 2 (cloud)",
                style = MaterialTheme.typography.labelSmall,
                color = InkMuted,
            )
        }
    }
}
