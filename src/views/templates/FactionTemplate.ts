import {AbstractTemplate} from "../../abstracts/AbstractTemplate";

export class FactionTemplate extends AbstractTemplate {
	protected generateFrontmatterTags(
	): string {
		return 'tags: [' + this.settings.factionTag + '/' + this.campaignId + ']\n';
	}

	protected generateFrontmatterSynopsis(
	): string {
		return 'synopsis: ""\n';
	}

	protected generateFrontmatterRelationships(
	): string|null {
		return ' locations: \n';
	}

	protected generateTemplate(
	): string {
		let response = this.getRpgManagerCodeblock('faction');
		response += this.getAdditionalInformation();

		return response;
	}
}
