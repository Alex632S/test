import { ref, onUnmounted } from 'vue'

export interface TickTimerOptions {
  intervalMs?: number
  onTick: () => void | Promise<void>
}

export function useTickTimer({
  intervalMs = 15000,
  onTick,
}: TickTimerOptions) {
  const secondsLeft = ref(intervalMs / 1000)

  let tickTimer: number | null = null
  let countdownTimer: number | null = null
  let cycleStartedAt = Date.now()

  function resetCycle(): void {
    cycleStartedAt = Date.now()
    secondsLeft.value = intervalMs / 1000
  }

  async function runTick(): Promise<void> {
    await onTick()
    resetCycle()
  }

  function startTimer(): void {
    stopTimer()
    tickTimer = window.setInterval(runTick, intervalMs)
  }

  function stopTimer(): void {
    if (tickTimer !== null) {
      clearInterval(tickTimer)
      tickTimer = null
    }
  }

  function startCountdown(): void {
    stopCountdown()
    countdownTimer = window.setInterval(() => {
      const elapsed = Date.now() - cycleStartedAt
      secondsLeft.value = Math.max(0, intervalMs - elapsed) / 1000
    }, 100)
  }

  function stopCountdown(): void {
    if (countdownTimer !== null) {
      clearInterval(countdownTimer)
      countdownTimer = null
    }
  }

  function start(): void {
    resetCycle()
    startTimer()
    startCountdown()
  }

  function stop(): void {
    stopTimer()
    stopCountdown()
  }

  async function triggerNow(): Promise<void> {
    stopTimer()
    await runTick()
    startTimer()
  }

  onUnmounted(stop)

  return {
    secondsLeft,
    start,
    stop,
    triggerNow,
  }
}