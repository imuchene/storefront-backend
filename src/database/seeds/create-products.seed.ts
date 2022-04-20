import { Product } from '../../modules/products/entities/product.entity';
import { Connection } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';

export default class CreateProducts implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any>{
    await connection.createQueryBuilder()
    .insert()
    .into(Product)
    .values([
      {
        name: 'Berries',
        unitPrice: 23.54,
        isDiscontinued: false,
        description: 'The bestest fruit known to man. Sweet yet sour but beautiful',
        image: '/assets/images/berries.jpeg'
      },
      {
        name: 'Orange',
        unitPrice: 10.33,
        isDiscontinued: false,
        description: `Succulent and watery, you'll never run out of water`,
        image: '/assets/images/oranges.jpeg'
      },
      {
        name: 'Lemons',
        unitPrice: 12.13,
        isDiscontinued: false,
        description: 'Sour but important for revitalization',
        image: '/assets/images/lemons.jpeg'
      },
      {
        name: 'Bananas',
        unitPrice: 10.33,
        isDiscontinued: false,
        description: 'An every day fruit, can be served with every dish',
        image: '/assets/images/banana.jpeg'
      },
      {
        name: 'Apples',
        unitPrice: 10.33,
        isDiscontinued: false,
        description: 'Sliced and served with your salad. Served as snacks midway through the day',
        image: '/assets/images/apple-item.png'
      },
      {
        name: 'Sharifa',
        unitPrice: 10.33,
        isDiscontinued: false,
        description: 'A great fruit, also known as custard apple',
        image: '/assets/images/unknown.jpeg',
      },

    ])
    .execute()
  }
}