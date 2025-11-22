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
export type { Technology } from './TechTree';
export type { Advisor, AdvisorAdvice } from './AdvisorPanel';
