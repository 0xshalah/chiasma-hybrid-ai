package com.chiasma.app.ui.components

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.unit.dp
import com.chiasma.app.ui.theme.InkMuted
import com.chiasma.app.ui.theme.SurfaceRaised

@Composable
fun PendingBadge(count: Int, modifier: Modifier = Modifier) {
    AnimatedVisibility(visible = count > 0, modifier = modifier) {
        Text(
            text = "↑ $count pending",
            style = MaterialTheme.typography.labelSmall,
            color = InkMuted,
            modifier = Modifier
                .clip(RoundedCornerShape(50))
                .background(SurfaceRaised)
                .padding(horizontal = 10.dp, vertical = 4.dp),
        )
    }
}
