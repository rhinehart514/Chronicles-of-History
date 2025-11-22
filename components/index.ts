// Component exports for easier imports

// Core UI
export { default as LoadingScreen, InlineLoader, SkeletonLoader } from './LoadingScreen';
export { default as ErrorBoundary } from './ErrorBoundary';
export { default as Tooltip, STAT_TOOLTIPS } from './Tooltip';

// Modals
export { default as SaveLoadModal } from './SaveLoadModal';
export { default as SettingsModal } from './SettingsModal';
export { default as PauseMenu } from './PauseMenu';
export { default as QuickStart } from './QuickStart';
export { default as ConfirmDialog, useConfirmDialog, presetDialogs } from './ConfirmDialog';
export { default as HotkeyOverlay } from './HotkeyOverlay';

// Game panels
export { default as EndGamePanel } from './EndGamePanel';
export { default as AchievementsPanel } from './AchievementsPanel';
export { default as DiplomaticRelationsPanel } from './DiplomaticRelationsPanel';
export { default as TimelineView } from './TimelineView';
export { default as WarDeclarationPanel, DEFAULT_WAR_GOALS } from './WarDeclarationPanel';
export { default as EconomyPanel } from './EconomyPanel';
export { default as TechTree } from './TechTree';
export { default as AdvisorPanel, DEFAULT_ADVISORS } from './AdvisorPanel';

// Controls
export { default as GameSpeedControls, GameSpeedControlsCompact } from './GameSpeedControls';
export { default as Minimap, MinimapCompact } from './Minimap';

// Types
// Nation management
export { default as NationComparison } from './NationComparison';
export { default as RulerPanel } from './RulerPanel';
export { default as FactionSystem } from './FactionSystem';

// War and military
export { default as WarProgressPanel } from './WarProgressPanel';
export { default as ArmyManagement } from './ArmyManagement';
export { default as NavyManagement } from './NavyManagement';

// Diplomacy
export { default as DiplomaticActions } from './DiplomaticActions';

// Events and decisions
export { default as DecisionEvent } from './DecisionEvent';
export { default as EventQueue, EventIndicator } from './EventQueue';
export { default as NotificationCenter, NotificationBadge } from './NotificationCenter';

// Map and exploration
export { default as MapLegend, MapModeSelector } from './MapLegend';
export { default as ProvinceDetail } from './ProvinceDetail';

// Scenario and victory
export { default as ScenarioSelect, DEFAULT_SCENARIOS } from './ScenarioSelect';
export { default as VictoryTracker, DEFAULT_VICTORY_CONDITIONS } from './VictoryTracker';

// Statistics
export { default as StatisticsPanel } from './StatisticsPanel';

// Main menu and settings
export { default as MainMenu } from './MainMenu';
export { default as SettingsPanel, DEFAULT_SETTINGS } from './SettingsPanel';

// Types
export type { Technology } from './TechTree';
export type { Advisor, AdvisorAdvice } from './AdvisorPanel';
export type { MapMode } from './MapLegend';
export type { Province } from './ProvinceDetail';
export type { Fleet, Ship, ShipType } from './NavyManagement';
export type { DiplomaticActionType, DiplomaticAction } from './DiplomaticActions';
export type { GameSettings } from './SettingsPanel';
export type { Scenario } from './ScenarioSelect';
export type { VictoryCondition } from './VictoryTracker';
export type { HistoricalDataPoint } from './StatisticsPanel';
export type { QueuedEvent } from './EventQueue';
