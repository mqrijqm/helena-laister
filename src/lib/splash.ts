/**
 * Mala "magistrala" između splash ekrana i hero animacija:
 * hero intro čeka da splash krene da nestaje, da se ne bi odigrao ispod crnog ekrana.
 */
let done = false
const listeners = new Set<() => void>()

export function markSplashDone() {
  if (done) return
  done = true
  listeners.forEach((cb) => cb())
  listeners.clear()
}

/** Pozovi cb kad splash završi (odmah, ako je već završio). Vraća funkciju za odjavu. */
export function onSplashDone(cb: () => void) {
  if (done) {
    cb()
    return () => {}
  }
  listeners.add(cb)
  return () => listeners.delete(cb)
}
