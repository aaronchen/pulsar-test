import { QueryTypes, Sequelize } from 'sequelize'

class Database {
  readonly connection: Sequelize

  constructor(connectionString: string) {
    this.connection = new Sequelize({
      dialect: 'mssql',
      dialectModulePath: 'msnodesqlv8/lib/sequelize',
      dialectOptions: {
        options: {
          connectionString
        }
      },
      pool: {
        min: 0,
        max: 5,
        idle: 10000
      }
    })
  }

  async select<T>(sql: string): Promise<T[]> {
    return <T[]>(<unknown>await this.connection.query(sql, { type: QueryTypes.SELECT }))
  }

  async query(sql: string): Promise<[results: unknown[], metadata: unknown]> {
    return await this.connection.query(sql)
  }

  async close(): Promise<void> {
    await this.connection.close()
  }
}

export { Database }
