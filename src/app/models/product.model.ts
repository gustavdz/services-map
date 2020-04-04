import {CategoryModel} from './category.model';

export class ProductModel {
    id: number;
    name: string;
    description: string;
    price: number;
    category_id: number;
    status: string;
    category: CategoryModel;
    image: string;
}
