// Data index - export all game data and systems

// Core systems
export { default as reformSystem, GOVERNMENT_REFORMS, canEnactReform, calculateReformEffects } from './reformSystem';
export { default as missionSystem, DEFAULT_MISSIONS, checkMissionRequirements, getMissionsByCategory, getAvailableMissions } from './missionSystem';
export { default as armyTemplates, UNIT_TYPES, DEFAULT_TEMPLATES, calculateTemplateTotals, isUnitAvailable, getUnitsByCategory } from './armyTemplates';
export { default as religionSystem, RELIGIONS, getReligionsByGroup, getReligionIcon } from './religionSystem';
export { default as governmentTypes, GOVERNMENT_TYPES, getGovernmentsByCategory, getGovernmentIcon } from './governmentTypes';
export { default as estatesSystem, DEFAULT_ESTATES, calculateEstateEffects, checkEstateDisaster } from './estatesSystem';
export { default as greatProjects, GREAT_PROJECTS, getProjectsByType, calculateProjectEffects, canBuildProject } from './greatProjects';
export { default as advisorSystem, ADVISOR_TYPES, generateAdvisor, calculateAdvisorEffects, getAdvisorMaintenance } from './advisorSystem';
export { default as institutions, INSTITUTIONS, calculateTechPenalty, getAvailableInstitutions, calculateEmbraceCost } from './institutions';

// Export types
export type { Reform, ReformEffect, ReformRequirement } from './reformSystem';
export type { Mission, MissionCategory, MissionRequirement, MissionReward, MissionProgress } from './missionSystem';
export type { UnitType, UnitRequirement, ArmyTemplate, TemplateUnit } from './armyTemplates';
export type { Religion, ReligionGroup, ReligionMechanic, ReligionModifier } from './religionSystem';
export type { GovernmentType, GovernmentCategory, GovernmentModifier } from './governmentTypes';
export type { Estate, Privilege, EstateInteraction, EstateModifier } from './estatesSystem';
export type { GreatProject, ProjectType, ProjectCost, ProjectLevel, ProjectEffect, ProjectRequirement } from './greatProjects';
export type { Advisor, AdvisorType, AdvisorEffect } from './advisorSystem';
export type { Institution, OriginCondition, SpreadCondition, InstitutionEffect } from './institutions';
