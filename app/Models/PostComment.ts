import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column, hasMany } from '@ioc:Adonis/Lucid/Orm'
import Post from './Post'
import User from './User'

// TODO remake this model

export default class PostComment extends BaseModel {
  @column({ isPrimary: true })
  public userId: number

  @column({ isPrimary: true })
  public postId: number

  @column()
  public comment: string

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @belongsTo(() => Post)
  public post: BelongsTo<typeof Post>

  // hasMany or hasManyThrough?

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
