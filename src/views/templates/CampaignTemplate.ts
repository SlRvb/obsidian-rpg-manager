import {AbstractTemplate} from "../../abstracts/AbstractTemplate";

export class CampaignTemplate extends AbstractTemplate{
    protected generateFrontmatterTags(
	): string {
		return 'tags: [' + this.settings.campaignTag +'/' + this.campaignId + ']\n';
	}

	protected generateFrontmatterDates(
	): string|null {
		return ' current: \n';
	}

	protected generateTemplate(
	): string {
		let response = this.getRpgManagerCodeblock('campaignNavigation');
		response += this.getHeader('Plot');
		response += this.getAbtPlot();
		response += this.getRpgManagerCodeblock('campaign');

		return response;
	}
}
