import {AbstractListView} from "../../abstracts/AbstractListView";
import {ClueListInterface} from "../../data/ClueData";

export class ClueListView extends AbstractListView {
	async render(
		data: ClueListInterface
	): Promise<void>
	{
		this.dv.span("## Clues");

		this.dv.table(["", "Clue", "Found", "Synopsis"],
			data.elements
				.map(clue => [
					clue.image,
					clue.link,
					clue.found === false ? '<span class="rpgm-missing">no</span>' : clue.found,
					clue.synopsis,
				])
		);

		this.spacer();
	}
}
