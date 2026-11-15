package com.chiasma.app.ui.theme

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable

private val ChiasmaLightColors = lightColorScheme(
    primary = System1,
    onPrimary = Surface,
    primaryContainer = System1Soft,
    onPrimaryContainer = System1Ink,
    secondary = System2,
    onSecondary = Surface,
    secondaryContainer = System2Soft,
    onSecondaryContainer = System2Ink,
    background = Canvas,
    onBackground = Ink,
    surface = Surface,
    onSurface = Ink,
    surfaceVariant = SurfaceRaised,
    onSurfaceVariant = InkSecondary,
    outline = Hairline,
    outlineVariant = Hairline,
)

@Composable
fun ChiasmaTheme(content: @Composable () -> Unit) {
    MaterialTheme(
        colorScheme = ChiasmaLightColors,
        typography = ChiasmaTypography,
        content = content,
    )
}
