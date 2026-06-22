<template>
  <RouterLink to="/" class="auth-brand" aria-label="Rojan Cuisines — home">
    <span class="auth-mark" aria-hidden="true">
      <svg width="40" height="40" viewBox="0 0 40 40" role="img">
        <defs>
          <linearGradient id="rojanMarkGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#2D7DF0" />
            <stop offset="100%" stop-color="#0D47A1" />
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="40" height="40" rx="10" fill="url(#rojanMarkGrad)" />
        <circle cx="29.5" cy="10.5" r="3" fill="#8AC2FB" />
        <text
          x="16.5" y="23"
          text-anchor="middle" dominant-baseline="central"
          font-family="Inter, ui-sans-serif, system-ui, sans-serif"
          font-size="19" font-weight="800" fill="#ffffff"
        >R</text>
      </svg>
    </span>
    <span class="auth-wordmark">Rojan<span class="auth-wordmark-light">Cuisines</span></span>
  </RouterLink>
</template>
