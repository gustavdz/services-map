import {CategoryModel} from './category.model';

export class MarkerModel {
  id?: string;
  lat: number;
  lng: number;
  label?: string;
  draggable: boolean;
  name: string;
  description: string;
  category?: CategoryModel;
}
