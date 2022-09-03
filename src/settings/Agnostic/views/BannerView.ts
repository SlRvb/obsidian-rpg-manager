import {AbstractView} from "../../../abstracts/AbstractView";
import {BannerResponseInterface} from "../../../interfaces/response/BannerResponseInterface";

export class BannerView extends AbstractView {
	public render(
		container: HTMLElement,
		data: BannerResponseInterface,
	): void {
		if (data.image !== null) {
			const bannerContainer = container.createDiv({cls: 'rpg-container'});

			const header = bannerContainer.createDiv({cls: 'rpgm-header'});
			header.style.backgroundImage = 'url(\'' + data.image + '\')';

			const overlay = header.createDiv({cls: 'rpgm-header-overlay'});
			overlay.createDiv({cls: 'rpgm-header-title', text: data.title});
		} else {
			container.createEl('h1', {text: data.title});
		}
	}
}