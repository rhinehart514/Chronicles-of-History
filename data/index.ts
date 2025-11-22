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
export { default as buildings, BUILDINGS, getBuildingsByCategory, calculateBuildingEffects, canBuild, getBuildingChain } from './buildings';
export { default as parliamentSystem, PARLIAMENT_ISSUES, SEAT_CONCERNS, calculateIssueSupport, getBribeCost, doesIssuPass } from './parliamentSystem';
export { default as mercenarySystem, MERCENARY_COMPANIES, calculateHireCost, calculateMonthlyCost, getAvailableCompanies, getCompanyStrength } from './mercenarySystem';
export { default as cultureSystem, CULTURE_GROUPS, getCultureGroup, getCulture, areCulturesRelated, getRandomMonarchName } from './cultureSystem';
export { default as achievements, ACHIEVEMENTS, getAchievementsByCategory, getAchievementsByDifficulty, calculateTotalPoints, getAchievementProgress } from './achievements';
export { default as tradeRoutes, TRADE_NODES, calculateTradePowerModifiers, calculateDownstreamValue, getRouteControl, canSteerTrade } from './tradeRoutes';

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
export type { Building, BuildingCategory, BuildingEffect, BuildingRequirement } from './buildings';
export type { Parliament, ParliamentType, ParliamentSeat, ParliamentIssue, IssueCategory, IssueEffect } from './parliamentSystem';
export type { MercenaryCompany, HiredMercenary, UnitComposition } from './mercenarySystem';
export type { CultureGroup, Culture, CultureBonus } from './cultureSystem';
export type { Achievement, AchievementCategory, AchievementDifficulty, AchievementRequirement } from './achievements';
export type { TradeNode, TradeRoute, TradePresence } from './tradeRoutes';
