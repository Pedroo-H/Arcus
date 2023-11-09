import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'post_comments'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
        .primary()
        
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

      table.integer('parent_comment_id')  
        .nullable() // if the parent comment is deleted, should it be deleted in cascade or it keeps there and shows a "deleted comment" part. If this is the case, then posts should have a deleted boolean

      table.string('comment', 255)
        .notNullable()

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
