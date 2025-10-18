declare module 'express-mysql-session' {
  import { SessionStore } from 'express-session';
  import { Pool } from 'mysql2/promise';

  interface MySQLStoreOptions {
    [key: string]: any;
  }

  interface MySQLStoreConstructor {
    new (options: MySQLStoreOptions, connection: Pool): SessionStore;
  }

  function MySQLStoreFactory(session: any): MySQLStoreConstructor;

  export default MySQLStoreFactory;
}
