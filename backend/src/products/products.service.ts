import { PRODUCTS, Product } from './products.data';

export class ProductsService {
  findAll(): Product[] {
    return PRODUCTS;
  }

  findById(id: string): Product | undefined {
    return PRODUCTS.find((p) => p.id === id);
  }
}
