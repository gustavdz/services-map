import {CategoryModel} from './category.model';

export class MarkerModel {
  _id: string;
  lat: string;
  lng: string;
  label?: string;
  draggable: boolean;
  name: string;
  description?: string;
  category: CategoryModel;
  category_id?: string;
}
