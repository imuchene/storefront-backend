import { Product } from '../../modules/products/entities/product.entity';
import { Repository } from 'typeorm';
import { Seeder } from 'nestjs-seeder';
import { InjectRepository } from '@nestjs/typeorm';

export default class CreateProductsSeeder implements Seeder {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
  ) {}

  public async seed(): Promise<any> {
    const products = [
      {
        name: 'Blackberries',
        unitPrice: 23.54,
        description:
          'The bestest fruit known to man. Sweet yet sour but beautiful',
        imageUrl:
          'https://images.pexels.com/photos/892808/pexels-photo-892808.jpeg?cs=srgb&dl=pexels-ir-solyanaya-892808.jpg&fm=jpg&w=640&h=426',
      },
      {
        name: 'Oranges',
        unitPrice: 10.33,
        description: `Succulent and watery, you'll never run out of water`,
        imageUrl:
          'https://images.pexels.com/photos/2247142/pexels-photo-2247142.jpeg?cs=srgb&dl=pexels-engin-akyurt-2247142.jpg&fm=jpg&w=640&h=427',
      },
      {
        name: 'Lemons',
        unitPrice: 12.13,
        description: 'Sour but important for revitalization',
        imageUrl:
          'https://images.pexels.com/photos/1414122/pexels-photo-1414122.jpeg?cs=srgb&dl=pexels-lukas-1414122.jpg&fm=jpg&w=640&h=424',
      },
      {
        name: 'Bananas',
        unitPrice: 10.33,
        description: 'An every day fruit, can be served with every dish',
        imageUrl:
          'https://images.pexels.com/photos/5966630/pexels-photo-5966630.jpeg?cs=srgb&dl=pexels-vanessa-loring-5966630.jpg&fm=jpg&w=640&h=427',
      },
      {
        name: 'Apples',
        unitPrice: 10.33,
        description:
          'Sliced and served with your salad. Served as snacks midway through the day',
        imageUrl:
          'https://images.pexels.com/photos/672101/pexels-photo-672101.jpeg?cs=srgb&dl=pexels-mareefe-672101.jpg&fm=jpg&w=640&h=427',
      },
      {
        name: 'Custard Apples',
        unitPrice: 10.33,
        description: 'A great fruit, also known as Sharifa (in Nigeria)',
        imageUrl:
          'https://images.pexels.com/photos/2957793/pexels-photo-2957793.jpeg?cs=srgb&dl=pexels-gilmer-diaz-estela-2957793.jpg&fm=jpg&w=640&h=427',
      },
      {
        name: 'Strawberries',
        unitPrice: 23.54,
        description: 'A very tasty fruit',
        imageUrl:
          'https://images.pexels.com/photos/1125122/pexels-photo-1125122.jpeg?cs=srgb&dl=pexels-david-j-boozer-1125122.jpg&fm=jpg&w=640&h=427',
      },
    ];

    return await this.productsRepository.insert(products);
  }

  async drop(): Promise<any> {
    return this.productsRepository.delete({});
  }
}
