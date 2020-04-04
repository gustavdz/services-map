import {AreaModel} from './area.model';

export class TableModel {
    id: number;
    name: string;
    number: number;
    seats: number;
    area_id: number;
    status: string;
    area: AreaModel;
}
