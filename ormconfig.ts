import { ConfigModule } from '@nestjs/config';
import dbConfig from './src/common/config/db.config';

ConfigModule.forRoot({
  load: [dbConfig],
});

export default dbConfig();
