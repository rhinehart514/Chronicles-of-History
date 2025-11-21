// Sound Service - Manages all game audio for immersion
// Uses Web Audio API for precise control and mixing

import { Era, Season } from '../types';

// Sound effect types
export type SoundEffect =
  | 'UI_CLICK'
  | 'UI_HOVER'
  | 'PARCHMENT_OPEN'
  | 'PARCHMENT_CLOSE'
  | 'QUILL_WRITE'
  | 'SEAL_STAMP'
  | 'COIN_DROP'
  | 'SWORD_UNSHEATH'
  | 'CANNON_FIRE'
  | 'CROWD_MURMUR'
  | 'CROWD_CHEER'
  | 'CROWD_ANGRY'
  | 'BELL_TOLL'
  | 'HORN_FANFARE'
  | 'HORSE_GALLOP'
  | 'SHIP_BELL'
  | 'CHURCH_BELLS'
  | 'DRUM_ROLL'
  | 'VICTORY_FANFARE'
  | 'DEFEAT_DIRGE'
  | 'ERA_TRANSITION'
  | 'NOTIFICATION'
  | 'DECISION_MADE'
  | 'WAR_DECLARED'
  | 'PEACE_TREATY'
  | 'TERRITORY_GAINED'
  | 'TERRITORY_LOST'
  | 'LEADER_DEATH'
  | 'NEW_RULER'
  | 'RESEARCH_COMPLETE'
  | 'EVENT_POPUP';

// Ambient sound types
export type AmbientSound =
  | 'COURT_MURMUR'
  | 'CITY_BUSTLE'
  | 'COUNTRYSIDE'
  | 'BATTLE_DISTANT'
  | 'RAIN'
  | 'STORM'
  | 'WIND'
  | 'FIRE_CRACKLING'
  | 'OCEAN_WAVES'
  | 'MARKET_CROWD';

// Music configuration by era
interface EraMusic {
  tracks: string[];
  style: string;
  composers?: string[];
}

const ERA_MUSIC: Record<Era, EraMusic> = {
  EARLY_MODERN: {
    tracks: ['baroque_court_1', 'baroque_court_2', 'renaissance_fanfare'],
    style: 'Baroque',
    composers: ['Vivaldi', 'Bach', 'Handel']
  },
  ENLIGHTENMENT: {
    tracks: ['classical_minuet_1', 'classical_symphony_1', 'mozart_style'],
    style: 'Classical',
    composers: ['Mozart', 'Haydn', 'Gluck']
  },
  REVOLUTIONARY: {
    tracks: ['revolutionary_march', 'romantic_prelude_1', 'dramatic_overture'],
    style: 'Early Romantic',
    composers: ['Beethoven', 'Schubert']
  },
  INDUSTRIAL: {
    tracks: ['romantic_symphony_1', 'romantic_nocturne', 'industrial_march'],
    style: 'Romantic',
    composers: ['Chopin', 'Brahms', 'Wagner']
  },
  IMPERIAL: {
    tracks: ['imperial_march', 'late_romantic_1', 'nationalist_anthem'],
    style: 'Late Romantic',
    composers: ['Tchaikovsky', 'Dvorak', 'Mahler']
  },
  GREAT_WAR: {
    tracks: ['wartime_somber', 'military_march_1', 'requiem_modern'],
    style: 'Early Modern',
    composers: ['Ravel', 'Debussy', 'Holst']
  },
  INTERWAR: {
    tracks: ['jazz_age', 'art_deco_theme', 'interwar_tension'],
    style: 'Jazz/Art Deco',
    composers: ['Gershwin', 'Stravinsky']
  },
  WORLD_WAR: {
    tracks: ['total_war_theme', 'resistance_melody', 'victory_approaching'],
    style: 'Mid-Century',
    composers: ['Shostakovich', 'Prokofiev', 'Copland']
  },
  COLD_WAR: {
    tracks: ['cold_war_tension', 'space_age_wonder', 'superpower_theme'],
    style: 'Mid-Century Modern',
    composers: ['Bernstein', 'Glass']
  },
  MODERN: {
    tracks: ['contemporary_theme', 'global_age', 'digital_frontier'],
    style: 'Contemporary',
    composers: ['Williams', 'Zimmer']
  }
};

// Season ambient configurations
const SEASON_AMBIENTS: Record<Season, AmbientSound[]> = {
  SPRING: ['COUNTRYSIDE', 'CITY_BUSTLE'],
  SUMMER: ['CITY_BUSTLE', 'MARKET_CROWD'],
  AUTUMN: ['WIND', 'COUNTRYSIDE'],
  WINTER: ['WIND', 'FIRE_CRACKLING']
};

class SoundService {
  private audioContext: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private musicGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private ambientGain: GainNode | null = null;

  private currentMusic: AudioBufferSourceNode | null = null;
  private currentAmbient: AudioBufferSourceNode | null = null;
  private loadedBuffers: Map<string, AudioBuffer> = new Map();

  private isMuted: boolean = false;
  private masterVolume: number = 0.7;
  private musicVolume: number = 0.5;
  private sfxVolume: number = 0.8;
  private ambientVolume: number = 0.3;

  private currentEra: Era = 'ENLIGHTENMENT';
  private currentSeason: Season = 'SPRING';
  private isInitialized: boolean = false;

  // Initialize audio context (must be called after user interaction)
  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();

      // Create gain nodes for mixing
      this.masterGain = this.audioContext.createGain();
      this.musicGain = this.audioContext.createGain();
      this.sfxGain = this.audioContext.createGain();
      this.ambientGain = this.audioContext.createGain();

      // Connect nodes
      this.musicGain.connect(this.masterGain);
      this.sfxGain.connect(this.masterGain);
      this.ambientGain.connect(this.masterGain);
      this.masterGain.connect(this.audioContext.destination);

      // Set initial volumes
      this.updateVolumes();

      this.isInitialized = true;
      console.log('Sound system initialized');
    } catch (error) {
      console.error('Failed to initialize audio:', error);
    }
  }

  // Update all volume levels
  private updateVolumes(): void {
    if (!this.masterGain || !this.musicGain || !this.sfxGain || !this.ambientGain) return;

    const mute = this.isMuted ? 0 : 1;
    this.masterGain.gain.value = this.masterVolume * mute;
    this.musicGain.gain.value = this.musicVolume;
    this.sfxGain.gain.value = this.sfxVolume;
    this.ambientGain.gain.value = this.ambientVolume;
  }

  // Generate procedural sound effect using Web Audio API
  private generateProceduralSound(effect: SoundEffect): void {
    if (!this.audioContext || !this.sfxGain) return;

    const now = this.audioContext.currentTime;

    switch (effect) {
      case 'UI_CLICK':
        this.playClick(now);
        break;
      case 'UI_HOVER':
        this.playHover(now);
        break;
      case 'PARCHMENT_OPEN':
      case 'PARCHMENT_CLOSE':
        this.playParchment(now);
        break;
      case 'QUILL_WRITE':
        this.playQuill(now);
        break;
      case 'SEAL_STAMP':
        this.playSealStamp(now);
        break;
      case 'COIN_DROP':
        this.playCoin(now);
        break;
      case 'BELL_TOLL':
        this.playBellToll(now);
        break;
      case 'NOTIFICATION':
        this.playNotification(now);
        break;
      case 'DECISION_MADE':
        this.playDecisionMade(now);
        break;
      case 'HORN_FANFARE':
      case 'VICTORY_FANFARE':
        this.playFanfare(now);
        break;
      case 'DRUM_ROLL':
        this.playDrumRoll(now);
        break;
      case 'WAR_DECLARED':
        this.playWarDeclared(now);
        break;
      case 'PEACE_TREATY':
        this.playPeaceTreaty(now);
        break;
      case 'TERRITORY_GAINED':
        this.playTerritoryGained(now);
        break;
      case 'TERRITORY_LOST':
        this.playTerritoryLost(now);
        break;
      case 'LEADER_DEATH':
        this.playLeaderDeath(now);
        break;
      case 'NEW_RULER':
        this.playNewRuler(now);
        break;
      case 'RESEARCH_COMPLETE':
        this.playResearchComplete(now);
        break;
      case 'ERA_TRANSITION':
        this.playEraTransition(now);
        break;
      case 'EVENT_POPUP':
        this.playEventPopup(now);
        break;
      default:
        this.playClick(now);
    }
  }

  // Individual sound generators
  private playClick(time: number): void {
    if (!this.audioContext || !this.sfxGain) return;

    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, time);
    osc.frequency.exponentialRampToValueAtTime(600, time + 0.05);

    gain.gain.setValueAtTime(0.3, time);
    gain.gain.exponentialRampToValueAtTime(0.01, time + 0.05);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(time);
    osc.stop(time + 0.05);
  }

  private playHover(time: number): void {
    if (!this.audioContext || !this.sfxGain) return;

    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, time);

    gain.gain.setValueAtTime(0.1, time);
    gain.gain.exponentialRampToValueAtTime(0.01, time + 0.03);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(time);
    osc.stop(time + 0.03);
  }

  private playParchment(time: number): void {
    if (!this.audioContext || !this.sfxGain) return;

    // White noise filtered to sound like paper
    const bufferSize = this.audioContext.sampleRate * 0.3;
    const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
    }

    const source = this.audioContext.createBufferSource();
    const filter = this.audioContext.createBiquadFilter();
    const gain = this.audioContext.createGain();

    source.buffer = buffer;
    filter.type = 'highpass';
    filter.frequency.value = 2000;

    gain.gain.setValueAtTime(0.2, time);

    source.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);

    source.start(time);
  }

  private playQuill(time: number): void {
    if (!this.audioContext || !this.sfxGain) return;

    // Scratchy sound
    const bufferSize = this.audioContext.sampleRate * 0.15;
    const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.3 * Math.sin(i * 0.1);
    }

    const source = this.audioContext.createBufferSource();
    const filter = this.audioContext.createBiquadFilter();
    const gain = this.audioContext.createGain();

    source.buffer = buffer;
    filter.type = 'highpass';
    filter.frequency.value = 3000;

    gain.gain.setValueAtTime(0.15, time);

    source.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);

    source.start(time);
  }

  private playSealStamp(time: number): void {
    if (!this.audioContext || !this.sfxGain) return;

    // Thump sound
    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(150, time);
    osc.frequency.exponentialRampToValueAtTime(50, time + 0.1);

    gain.gain.setValueAtTime(0.5, time);
    gain.gain.exponentialRampToValueAtTime(0.01, time + 0.15);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(time);
    osc.stop(time + 0.15);
  }

  private playCoin(time: number): void {
    if (!this.audioContext || !this.sfxGain) return;

    const frequencies = [2000, 2500, 3000];

    frequencies.forEach((freq, i) => {
      const osc = this.audioContext!.createOscillator();
      const gain = this.audioContext!.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, time + i * 0.03);

      gain.gain.setValueAtTime(0.2, time + i * 0.03);
      gain.gain.exponentialRampToValueAtTime(0.01, time + i * 0.03 + 0.1);

      osc.connect(gain);
      gain.connect(this.sfxGain!);

      osc.start(time + i * 0.03);
      osc.stop(time + i * 0.03 + 0.1);
    });
  }

  private playBellToll(time: number): void {
    if (!this.audioContext || !this.sfxGain) return;

    const osc = this.audioContext.createOscillator();
    const osc2 = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();

    osc.type = 'sine';
    osc.frequency.value = 440;

    osc2.type = 'sine';
    osc2.frequency.value = 880;

    gain.gain.setValueAtTime(0.4, time);
    gain.gain.exponentialRampToValueAtTime(0.01, time + 2);

    osc.connect(gain);
    osc2.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(time);
    osc2.start(time);
    osc.stop(time + 2);
    osc2.stop(time + 2);
  }

  private playNotification(time: number): void {
    if (!this.audioContext || !this.sfxGain) return;

    const notes = [523.25, 659.25, 783.99]; // C5, E5, G5

    notes.forEach((freq, i) => {
      const osc = this.audioContext!.createOscillator();
      const gain = this.audioContext!.createGain();

      osc.type = 'triangle';
      osc.frequency.value = freq;

      gain.gain.setValueAtTime(0.3, time + i * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.01, time + i * 0.1 + 0.15);

      osc.connect(gain);
      gain.connect(this.sfxGain!);

      osc.start(time + i * 0.1);
      osc.stop(time + i * 0.1 + 0.15);
    });
  }

  private playDecisionMade(time: number): void {
    if (!this.audioContext || !this.sfxGain) return;

    // Weighty thump followed by seal
    this.playSealStamp(time);
    this.playQuill(time + 0.1);
  }

  private playFanfare(time: number): void {
    if (!this.audioContext || !this.sfxGain) return;

    const notes = [261.63, 329.63, 392.00, 523.25]; // C4, E4, G4, C5

    notes.forEach((freq, i) => {
      const osc = this.audioContext!.createOscillator();
      const gain = this.audioContext!.createGain();

      osc.type = 'sawtooth';
      osc.frequency.value = freq;

      gain.gain.setValueAtTime(0.3, time + i * 0.15);
      gain.gain.exponentialRampToValueAtTime(0.01, time + i * 0.15 + 0.3);

      osc.connect(gain);
      gain.connect(this.sfxGain!);

      osc.start(time + i * 0.15);
      osc.stop(time + i * 0.15 + 0.3);
    });
  }

  private playDrumRoll(time: number): void {
    if (!this.audioContext || !this.sfxGain) return;

    const bufferSize = this.audioContext.sampleRate * 1;
    const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      const envelope = Math.sin((i / bufferSize) * Math.PI);
      data[i] = (Math.random() * 2 - 1) * envelope * 0.3;
    }

    const source = this.audioContext.createBufferSource();
    const filter = this.audioContext.createBiquadFilter();

    source.buffer = buffer;
    filter.type = 'lowpass';
    filter.frequency.value = 500;

    source.connect(filter);
    filter.connect(this.sfxGain);

    source.start(time);
  }

  private playWarDeclared(time: number): void {
    if (!this.audioContext || !this.sfxGain) return;

    this.playDrumRoll(time);

    // Ominous horns
    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(130.81, time + 0.5); // C3
    osc.frequency.setValueAtTime(116.54, time + 1); // Bb2

    gain.gain.setValueAtTime(0.4, time + 0.5);
    gain.gain.exponentialRampToValueAtTime(0.01, time + 1.5);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(time + 0.5);
    osc.stop(time + 1.5);
  }

  private playPeaceTreaty(time: number): void {
    if (!this.audioContext || !this.sfxGain) return;

    // Gentle major chord
    const notes = [261.63, 329.63, 392.00]; // C major

    notes.forEach(freq => {
      const osc = this.audioContext!.createOscillator();
      const gain = this.audioContext!.createGain();

      osc.type = 'sine';
      osc.frequency.value = freq;

      gain.gain.setValueAtTime(0.2, time);
      gain.gain.exponentialRampToValueAtTime(0.01, time + 1);

      osc.connect(gain);
      gain.connect(this.sfxGain!);

      osc.start(time);
      osc.stop(time + 1);
    });

    this.playSealStamp(time + 0.5);
  }

  private playTerritoryGained(time: number): void {
    this.playFanfare(time);
  }

  private playTerritoryLost(time: number): void {
    if (!this.audioContext || !this.sfxGain) return;

    // Minor chord descent
    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(392, time); // G4
    osc.frequency.exponentialRampToValueAtTime(196, time + 0.8); // G3

    gain.gain.setValueAtTime(0.3, time);
    gain.gain.exponentialRampToValueAtTime(0.01, time + 0.8);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(time);
    osc.stop(time + 0.8);
  }

  private playLeaderDeath(time: number): void {
    if (!this.audioContext || !this.sfxGain) return;

    this.playBellToll(time);

    // Somber tone
    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();

    osc.type = 'sine';
    osc.frequency.value = 220; // A3

    gain.gain.setValueAtTime(0.2, time + 0.5);
    gain.gain.exponentialRampToValueAtTime(0.01, time + 3);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(time + 0.5);
    osc.stop(time + 3);
  }

  private playNewRuler(time: number): void {
    this.playFanfare(time);
    this.playBellToll(time + 0.6);
  }

  private playResearchComplete(time: number): void {
    if (!this.audioContext || !this.sfxGain) return;

    // Ascending arpeggio
    const notes = [261.63, 329.63, 392.00, 523.25, 659.25]; // C major arpeggio

    notes.forEach((freq, i) => {
      const osc = this.audioContext!.createOscillator();
      const gain = this.audioContext!.createGain();

      osc.type = 'triangle';
      osc.frequency.value = freq;

      gain.gain.setValueAtTime(0.25, time + i * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.01, time + i * 0.08 + 0.2);

      osc.connect(gain);
      gain.connect(this.sfxGain!);

      osc.start(time + i * 0.08);
      osc.stop(time + i * 0.08 + 0.2);
    });
  }

  private playEraTransition(time: number): void {
    if (!this.audioContext || !this.sfxGain) return;

    this.playDrumRoll(time);
    this.playFanfare(time + 1);
    this.playBellToll(time + 1.5);
  }

  private playEventPopup(time: number): void {
    this.playParchment(time);
    this.playNotification(time + 0.1);
  }

  // Public methods

  playSFX(effect: SoundEffect): void {
    if (!this.isInitialized || this.isMuted) return;
    this.generateProceduralSound(effect);
  }

  setEra(era: Era): void {
    if (era !== this.currentEra) {
      this.currentEra = era;
      // Could trigger music change here
      console.log(`Era changed to ${era}, music style: ${ERA_MUSIC[era].style}`);
    }
  }

  setSeason(season: Season): void {
    if (season !== this.currentSeason) {
      this.currentSeason = season;
      // Update ambient sounds for season
      console.log(`Season changed to ${season}`);
    }
  }

  setMasterVolume(volume: number): void {
    this.masterVolume = Math.max(0, Math.min(1, volume));
    this.updateVolumes();
  }

  setMusicVolume(volume: number): void {
    this.musicVolume = Math.max(0, Math.min(1, volume));
    this.updateVolumes();
  }

  setSFXVolume(volume: number): void {
    this.sfxVolume = Math.max(0, Math.min(1, volume));
    this.updateVolumes();
  }

  setAmbientVolume(volume: number): void {
    this.ambientVolume = Math.max(0, Math.min(1, volume));
    this.updateVolumes();
  }

  toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    this.updateVolumes();
    return this.isMuted;
  }

  getMuteState(): boolean {
    return this.isMuted;
  }

  getVolumes(): { master: number; music: number; sfx: number; ambient: number } {
    return {
      master: this.masterVolume,
      music: this.musicVolume,
      sfx: this.sfxVolume,
      ambient: this.ambientVolume
    };
  }

  // Resume audio context (needed after user interaction)
  async resume(): Promise<void> {
    if (this.audioContext?.state === 'suspended') {
      await this.audioContext.resume();
    }
  }

  // Clean up
  dispose(): void {
    if (this.currentMusic) {
      this.currentMusic.stop();
    }
    if (this.currentAmbient) {
      this.currentAmbient.stop();
    }
    if (this.audioContext) {
      this.audioContext.close();
    }
    this.loadedBuffers.clear();
    this.isInitialized = false;
  }
}

// Singleton instance
export const soundService = new SoundService();

// Convenience functions
export const playSFX = (effect: SoundEffect) => soundService.playSFX(effect);
export const initializeSound = () => soundService.initialize();
export const setEra = (era: Era) => soundService.setEra(era);
export const setSeason = (season: Season) => soundService.setSeason(season);
