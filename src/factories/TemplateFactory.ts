import {CampaignTemplate} from "../settings/Agnostic/templates/CampaignTemplate";
import {AdventureTemplate} from "../settings/Agnostic/templates/AdventureTemplate";
import {SessionTemplate} from "../settings/Agnostic/templates/SessionTemplate";
import {SceneTemplate} from "../settings/Agnostic/templates/SceneTemplate";
import {CharacterTemplate} from "../settings/Agnostic/templates/CharacterTemplate";
import {NonPlayerCharacterTemplate} from "../settings/Agnostic/templates/NonPlayerCharacterTemplate";
import {LocationTemplate} from "../settings/Agnostic/templates/LocationTemplate";
import {EventTemplate} from "../settings/Agnostic/templates/EventTemplate";
import {ClueTemplate} from "../settings/Agnostic/templates/ClueTemplate";
import {FactionTemplate} from "../settings/Agnostic/templates/FactionTemplate";
import {App} from "obsidian";

const TemplatesMap = {
	AgnosticCampaign: CampaignTemplate,
	AgnosticAdventure: AdventureTemplate,
	AgnosticSession: SessionTemplate,
	AgnosticScene: SceneTemplate,
	AgnosticCharacter: CharacterTemplate,
	AgnosticNonPlayerCharacter: NonPlayerCharacterTemplate,
	AgnosticLocation: LocationTemplate,
	AgnosticEvent: EventTemplate,
	AgnosticClue: ClueTemplate,
	AgnosticFaction: FactionTemplate,
};
type TemplatesMapType = typeof TemplatesMap;
type TemplateKeys = keyof TemplatesMapType;
type Tuples<T> = T extends TemplateKeys ? [T, InstanceType<TemplatesMapType[T]>] : never;
export type SingleTemplateKey<K> = [K] extends (K extends TemplateKeys ? [K] : never) ? K : never;
type TemplateClassType<A extends TemplateKeys> = Extract<Tuples<TemplateKeys>, [A, any]>[1];

export class TemplateFactory {
	static create<K extends TemplateKeys>(
		k: SingleTemplateKey<K>,
		app: App,
		createFrontMatterOnly: boolean,
		name: string,
		campaignId: number|null,
		adventureId: number|null,
		sessionId: number|null,
		sceneId: number|null,
	): TemplateClassType<K> {
		return new TemplatesMap[k](app, createFrontMatterOnly, name, campaignId, adventureId, sessionId, sceneId);
	}
}