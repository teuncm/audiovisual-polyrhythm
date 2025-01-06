import { map as _map, filter as _filter, range as _range, reverse as _reverse } from 'lodash-es';
import { ET12 } from '@teuncm/n-et';

const et12 = new ET12();

let globalAudioCtx = null;
const chordOffsets = [0, 2, 4, 7, 9];
const rootMidi = et12.SPNToMidiNum("F2");

export function getAudioCtx() {
  if (!globalAudioCtx) {
    globalAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
    console.log("Initialized audio context:", globalAudioCtx);
  }

  return globalAudioCtx;
}

export function start() {
  const expandedOffsets = expandChord(5);

  for (const [idx, chordOffset] of expandedOffsets.entries()) {
    const freq = et12.midiNumToFreq(rootMidi + chordOffset);

    setTimeout(ring, idx * 100, freq);
  }
}

export function expandChord(numOctaves) {
  const expandedOffsets = [];
  for (const i of _range(0, numOctaves)) {
    expandedOffsets.push(..._map(chordOffsets, (x) => x + i*12));
  }

  return _reverse(expandedOffsets);
}

export function ring(freq) {
  const audioCtx = getAudioCtx();

  // Create an oscillator
  const oscillator = audioCtx.createOscillator();
  oscillator.type = 'triangle';
  oscillator.frequency.setValueAtTime(freq, audioCtx.currentTime);

  // Create a gain node for the envelope
  const gainNode = audioCtx.createGain();

  // Connect the oscillator to the gain node and the gain node to the destination
  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  // Define the envelope parameters
  const attackTime = 0.05; // seconds
  const holdTime = 0.0;   // seconds
  const decayTime = 0.5;  // seconds

  const now = audioCtx.currentTime;

  // Set up the envelope: Attack -> Hold -> Decay
  gainNode.gain.setValueAtTime(0, now); // Start at 0 gain
  gainNode.gain.linearRampToValueAtTime(0.5, now + attackTime); // Attack to full gain
  gainNode.gain.setValueAtTime(0.5, now + attackTime + holdTime); // Hold the gain
  gainNode.gain.linearRampToValueAtTime(0, now + attackTime + holdTime + decayTime); // Decay back to 0

  // Start and stop the oscillator
  oscillator.start(now);
  oscillator.stop(now + attackTime + holdTime + decayTime); // Stop after the envelope completes
}
