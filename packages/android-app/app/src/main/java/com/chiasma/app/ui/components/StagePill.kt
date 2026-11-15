package com.chiasma.app.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.chiasma.app.ui.theme.StageCloud
import com.chiasma.app.ui.theme.StageDistilling
import com.chiasma.app.ui.theme.StageDone
import com.chiasma.app.ui.theme.StageInk
import com.chiasma.app.ui.theme.StageRouting
import com.chiasma.app.ui.theme.StageScrubbing
import com.chiasma.app.ui.theme.InkMuted
import com.chiasma.app.ui.theme.Hairline

enum class ExtensionStage {
    IDLE, SCRUBBING, DISTILLING, ROUTING, CLOUD, DONE
}

private data class StageConfig(val label: String, val bg: Color, val fg: Color)

private val STAGE_CONFIGS = mapOf(
    ExtensionStage.IDLE to StageConfig("Idle", Hairline, InkMuted),
    ExtensionStage.SCRUBBING to StageConfig("Scrubbing PII", StageScrubbing, StageInk),
    ExtensionStage.DISTILLING to StageConfig("Distilling context", StageDistilling, StageInk),
    ExtensionStage.ROUTING to StageConfig("Routing", StageRouting, StageInk),
    ExtensionStage.CLOUD to StageConfig("Cloud reasoning", StageCloud, StageInk),
    ExtensionStage.DONE to StageConfig("System 1 — Local", StageDone, StageInk),
)

@Composable
fun StagePill(stage: ExtensionStage, modifier: Modifier = Modifier) {
    val config = STAGE_CONFIGS[stage] ?: STAGE_CONFIGS[ExtensionStage.IDLE]!!

    Row(
        modifier = modifier
            .clip(RoundedCornerShape(50))
            .background(config.bg)
            .padding(horizontal = 10.dp, vertical = 4.dp),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        Spacer(
            modifier = Modifier
                .size(6.dp)
                .clip(CircleShape)
                .background(config.fg),
        )
        Spacer(modifier = Modifier.width(6.dp))
        Text(
            text = config.label,
            color = config.fg,
            fontSize = 11.sp,
            fontWeight = FontWeight.SemiBold,
        )
    }
}
