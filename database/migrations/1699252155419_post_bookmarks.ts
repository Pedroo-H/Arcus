import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'post_bookmarks'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.integer('post_id', 255)
        .notNullable()
        .unsigned()
        .references('id')
        .inTable('posts')
        .onDelete('CASCADE')  
        .onUpdate('CASCADE')
        .notNullable()

      table.integer('user_id', 255)
        .notNullable()
        .unsigned()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
        .onUpdate('CASCADE')
        .notNullable()

      table.primary(['user_id', 'post_id'])

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
