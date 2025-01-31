import {App, Component, FileSystemAdapter, TAbstractFile, TFile} from "obsidian";
import {Literal} from "obsidian-dataview/lib/data-model/value";
import {DateTime} from "obsidian-dataview";
import {FileFactory} from "./factories/FileFactory";
import {DataType} from "./io/IoData";
import {RpgManagerSettings} from "./Settings";

export class Api extends Component {
	private root: string;
	public fileFactory: FileFactory;

	constructor(
		public app: App,
		public settings: RpgManagerSettings,
	) {
		super();
		this.initialiseRoots();

		this.fileFactory = new FileFactory(this);
	}

	private initialiseRoots() {
		if (this.app.vault.getFiles().length !== 0) {
			const filePath = this.app.vault.getFiles()[0].path;

			let slashCount = 0;
			let p = filePath.indexOf('/');
			while (p !== -1) {
				slashCount++;
				p = filePath.indexOf('/', p + 1);
			}

			slashCount++;
			const file = this.app.vault.getAbstractFileByPath(filePath);

			if (file instanceof TFile) {
				this.root = this.app.vault.getResourcePath(file);
			}

			if (this.root === null) {
				console.log('Rpg Manager failed to find the root folder!');
				return;
			}

			if (this.root.includes("?")) {
				this.root = this.root.substring(0, this.root.lastIndexOf("?"));
			}

			for (let removedSlash = slashCount; removedSlash > 0; removedSlash--) {
				this.root = this.root.slice(0, this.root.lastIndexOf('/'));
			}

			if (!this.root.endsWith("/")) {
				this.root += "/";
			}
		}
	}

	fileExists(path: string): boolean {
		const abstractFile = this.app.vault.getAbstractFileByPath(path);
		let response = false;

		if (abstractFile instanceof TAbstractFile) {
			response = true;
		}

		return response;
	}

	getImageLink(page: Record<string, Literal>|undefined){
		const imageExtensions = ["jpeg", "jpg", "png", "webp"];

		for (let extensionCount = 0; extensionCount < imageExtensions.length; extensionCount++){
			const fileName = this.app.vault.config.attachmentFolderPath + '/' + page?.file.name + '.' + imageExtensions[extensionCount];

			if (this.fileExists(fileName)){
				if (this.root == null){
					this.initialiseRoots();
				}
				return this.root + fileName;
			}
		}

		return null;
	}

	getImageElement(
		page: Record<string, Literal>|undefined,
		width: number|undefined =75,
		height: number|undefined =75,
	): HTMLImageElement|null
	{
		let imageFile = null;

		if (page !== undefined) {
			imageFile = this.getImageLink(page);
		}

		if (imageFile === null) {
			return null;
		}

		if (width !== 75 && height === 75){
			height = undefined;
		} else if (width === 75 && height !== 75){
			width = undefined;
		}

		const response = new Image(width, height);
		response.src = imageFile;
		response.style.objectFit = 'cover';

		return response;
	}

	getImage(page: Record<string, Literal>|undefined, width=75, height=75){
		let imageFile = null;

		if (page !== undefined) {
			imageFile = this.getImageLink(page);
		}

		let minimalDimensions = false;
		let dimensions = "width: " + width + "px; height: " + height + "px;";

		if (width !== 75 && height === 75){
			dimensions = "width: " + width + "px;";
		} else if (width === 75 && height !== 75){
			dimensions = "height: " + height + "px;";
		} else if (width === 75 && height === 75) {
			minimalDimensions = true;
		}

		if (imageFile === null) {
			if (!minimalDimensions){
				return "";
			} else {
				return "<div style=\"" + dimensions + "\"></div>";
			}
		}

		return "<img src=\"" + imageFile + "\" style=\"object-fit: cover;" + dimensions + "\">";
	}

	public getTagId(
		tags: Array<string>|null,
		type: DataType,
	): number {
		if (tags == null) {
			throw new Error();
		}

		let response = '';

		tags.forEach((tag: string) => {
			if (response === ''){
				if (tag.startsWith(this.settings.campaignTag)){
					if (type === DataType.Campaign){
						response = tag.substring(this.settings.campaignTag.length + 1);
					} else {
						throw new Error();
					}
				} else if (tag.startsWith(this.settings.adventureTag)){
					const parts = tag.substring(this.settings.adventureTag.length + 1).split('/');
					if (parts.length === 2){
						if (type === DataType.Campaign){
							response = parts[0];
						} else if (type === DataType.Adventure){
							response = parts[1];
						}
					} else if (parts.length === 1 && type === DataType.Adventure){
						response = parts[0];
					}
				} else if (tag.startsWith(this.settings.sessionTag)){
					const parts = tag.substring(this.settings.sessionTag.length + 1).split('/');
					if (parts.length === 3){
						if (type === DataType.Campaign){
							response = parts[0];
						} else if (type === DataType.Adventure){
							response = parts[1];
						} else if (type === DataType.Session){
							response = parts[2];
						}
					} else if (parts.length === 2){
						if (type === DataType.Adventure){
							response = parts[0];
						} else if (type === DataType.Session){
							response = parts[1];
						}
					}
				} else if (tag.startsWith(this.settings.sceneTag)){
					const parts = tag.substring(this.settings.sceneTag.length + 1).split('/');
					if (parts.length === 4){
						if (type === DataType.Campaign){
							response = parts[0];
						} else if (type === DataType.Adventure){
							response = parts[1];
						} else if (type === DataType.Session){
							response = parts[2];
						} else if (type === DataType.Scene){
							response = parts[3]
						}
					} else if (parts.length === 3){
						if (type === DataType.Adventure){
							response = parts[0];
						} else if (type === DataType.Session){
							response = parts[1];
						} else if (type === DataType.Scene) {
							response = parts[2]
						}
					}
				} else {
					let tagLength = 0;
					if (tag.startsWith(this.settings.npcTag)) {
						tagLength = this.settings.npcTag.length;
					} else if (tag.startsWith(this.settings.pcTag)) {
						tagLength = this.settings.pcTag.length;
					} else if (tag.startsWith(this.settings.eventTag)) {
						tagLength = this.settings.eventTag.length;
					} else if (tag.startsWith(this.settings.factionTag)) {
						tagLength = this.settings.factionTag.length;
					} else if (tag.startsWith(this.settings.locationTag)) {
						tagLength = this.settings.locationTag.length;
					} else if (tag.startsWith(this.settings.clueTag)) {
						tagLength = this.settings.clueTag.length;
					}else if (tag.startsWith(this.settings.timelineTag)) {
						tagLength = this.settings.timelineTag.length;
					}

					if (tagLength !== 0 && tag.length > tagLength && type === DataType.Campaign){
						response = tag.substring(tagLength+1);
					}
				}
			}
		});

		if (response === ''){
			throw new Error();
		}

		return +response;
	}

	/**
	 * Return an ISO formatted date
	 *
	 * @param date
	 * @returns {string|*}
	 */
	formatDate(date: DateTime|undefined, type: string|null = null): string{
		if (!date || date === undefined) return "";

		let options = null;

		if (type === "long"){
			options = {
				day:  'numeric',
				month : 'long',
				year: 'numeric',
			};

			return date.toLocaleString(options);
		}

		if (type === "short"){
			options = {
				weekday: 'short',
				month : 'short',
				day:  'numeric',
				year: 'numeric',
			};
		}

		if (options !== null){
			return date.toLocaleString(options);
		} else {
			return date.toISODate();
		}
	}

	formatTime(date: DateTime|undefined){
		if (!date || date === undefined) return "";

		const options = {
			hour12 : false,
			hour:  "2-digit",
			minute: "2-digit",
		};

		return date.toLocaleString(options);
	}

	calculateDuration(start:DateTime, end:DateTime){
		if (!start || !end) return "";

		const dtStart = new Date(start);
		const dtEnd = new Date(end);

		const difference = dtEnd.valueOf() - dtStart.valueOf();

		const minutes = difference/60000;
		const remaining = (difference-(minutes*60000));
		const seconds = remaining > 0 ?  remaining/1000 : 0;

		return minutes + ":" + (seconds < 10 ? "0" + seconds : seconds);
	}

	getDeathStatus(page: Record<string, Literal>){
		return (page.dates.death !== null ? "<br/>_(Deceased " + this.formatDate(page.dates.death) + ")_ " : "");
	}

	calculateAge(
		page: Record<string, Literal>|undefined,
		currentDate: DateTime,
	): string {
		if (page === undefined) return "";

		if (!page?.dates.dob) return "";

		const end = page.dates.death || currentDate;

		const startDate = new Date(page.dates.dob);
		const endDate = new Date(end);

		const ageDifMs = endDate.valueOf() - startDate.valueOf();
		const ageDate = new Date(ageDifMs);

		return (Math.abs(ageDate.getUTCFullYear() - 1970)).toString();
	}
}
