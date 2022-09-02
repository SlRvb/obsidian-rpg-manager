import {AbstractComponent} from "../../../abstracts/AbstractComponent";
import {GenericDataListInterface} from "../../../interfaces/data/GenericDataListInterface";
import {ResponseTable} from "../../../data/ResponseTable";
import {ContentFactory} from "../../../factories/ContentFactory";
import {ContentType} from "../../../enums/ContentType";
import {ResponseElementInterface} from "../../../interfaces/response/ResponseElementInterface";
import {LocationDataInterface} from "../../../interfaces/data/LocationDataInterface";

export class LocationTableComponent extends AbstractComponent {
	generateData(
		data: GenericDataListInterface,
		title:string|null,
	): ResponseElementInterface | null {
		if (data.elements.length === 0){
			return null;
		}

		const response = new ResponseTable();

		response.addTitle(title ? title : 'Locations');
		response.addHeaders([
			ContentFactory.create('', ContentType.String, true),
			ContentFactory.create('Name', ContentType.String),
			ContentFactory.create('Synopsis', ContentType.String),
		]);
		data.elements.forEach((location: LocationDataInterface) => {
			response.addContent([
				ContentFactory.create(location.imageSrcElement, ContentType.Image, true),
				ContentFactory.create(location.link, ContentType.Link, true),
				ContentFactory.create(location.synopsis, ContentType.Markdown),
			])
		});

		return response;
	}
}
