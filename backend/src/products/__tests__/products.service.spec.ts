import { ProductsService } from '../products.service';

describe('ProductsService', () => {
  let service: ProductsService;

  beforeEach(() => {
    service = new ProductsService();
  });

  it('should return exactly 7 products', () => {
    const products = service.findAll();
    expect(products).toHaveLength(7);
  });

  it('should contain all required products', () => {
    const products = service.findAll();
    const ids = products.map((p) => p.id);

    expect(ids).toContain('red');
    expect(ids).toContain('green');
    expect(ids).toContain('blue');
    expect(ids).toContain('yellow');
    expect(ids).toContain('pink');
    expect(ids).toContain('purple');
    expect(ids).toContain('orange');
  });

  it('should have correct prices', () => {
    const products = service.findAll();
    const priceMap = Object.fromEntries(products.map((p) => [p.id, p.price]));

    expect(priceMap['red']).toBe(50);
    expect(priceMap['green']).toBe(40);
    expect(priceMap['blue']).toBe(30);
    expect(priceMap['yellow']).toBe(50);
    expect(priceMap['pink']).toBe(80);
    expect(priceMap['purple']).toBe(90);
    expect(priceMap['orange']).toBe(120);
  });

  it('should have only Orange, Pink, Green as pair-discount eligible', () => {
    const products = service.findAll();
    const eligible = products
      .filter((p) => p.isPairDiscountEligible)
      .map((p) => p.id);

    expect(eligible).toHaveLength(3);
    expect(eligible).toContain('orange');
    expect(eligible).toContain('pink');
    expect(eligible).toContain('green');
  });

  it('should find product by id', () => {
    const product = service.findById('orange');
    expect(product).toBeDefined();
    expect(product?.price).toBe(120);
  });

  it('should return undefined for invalid id', () => {
    const product = service.findById('invalid');
    expect(product).toBeUndefined();
  });
});
