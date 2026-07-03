/**
 * Web Audio API synthesizer for clean, premium, and zero-dependency audio soundscapes.
 * Overcomes the limitations of loading custom URLs by synthesizing chimes directly in the browser.
 */

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
 * Synthesizes a high-energy, sparkling success chime:
 * A rapid rising arpeggio (C5 -> E5 -> G5 -> C6) with rich harmonics.
 */
export function playSuccessChime() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);
      
      gainNode.gain.setValueAtTime(0, now + idx * 0.08);
      gainNode.gain.linearRampToValueAtTime(0.18, now + idx * 0.08 + 0.02);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.35);
      
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.4);
    });
  } catch (error) {
    console.error('Failed to play success chime synth:', error);
  }
}

/**
 * Synthesizes a resonant, meditative Tibetan Singing Bowl bell chime for Pomodoro transitions:
 * Consists of a fundamental warm frequency (440Hz base) folded over rich low-frequency vibrato.
 */
export function playBellChime() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    
    const fundamental = 440; // A4
    const partials = [1, 1.25, 1.5, 2]; // Harmonics for warm metallic structure
    
    partials.forEach((mult, index) => {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      osc.type = index === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(fundamental * mult, now);
      
      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(0.15 / (index + 1), now + 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 1.8 - (index * 0.2));
      
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      osc.start(now);
      osc.stop(now + 2.0);
    });
  } catch (error) {
    console.error('Failed to play bell chime synth:', error);
  }
}

/**
 * Synthesizes a subtle, pleasant toggle click for UI feedback.
 */
export function playClickSound() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(200, now + 0.05);
    
    gainNode.gain.setValueAtTime(0.08, now);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
    
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    osc.start(now);
    osc.stop(now + 0.06);
  } catch (error) {
    // Fail silently since this is tiny UI feedback
  }
}

/**
 * Synthesizes a short, clean countdown beep sound.
 */
export function playCountdownBeep() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, now); // A5 note beep
    
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.12, now + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
    
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    osc.start(now);
    osc.stop(now + 0.15);
  } catch (error) {
    // Fail silently
  }
}

