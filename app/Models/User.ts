import { DateTime } from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash'
import { column, beforeSave, BaseModel, hasMany, HasMany, afterFind, beforeFind, afterFetch, beforeFetch, ModelQueryBuilderContract, afterSave } from '@ioc:Adonis/Lucid/Orm'
import Post from './Post'
import Crypto from 'Contracts/crypto';

export default class User extends BaseModel {

  static readonly regex_email: RegExp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  static readonly regex_number: RegExp = /^[0-9]$/;
  static readonly regex_handle: RegExp = /^[a-zA-Z][a-zA-Z0-9]{3,17}$/;

  @column({ isPrimary: true })
  public id: number

  @column()
  public handle: string

  @column()
  public email: string

  @column()
  public name: string 

  @column({ serializeAs: null })
  public password: string

  @column()
  public description: string

  @column()
  public profilePicture: string

  @column()
  public rememberMeToken: string | null

  @hasMany(() => Post, {
    foreignKey: 'userId',
  })
  public posts: HasMany<typeof Post>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeSave()
  public static async hashPassword (user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }

  @beforeSave()
  public static async encryptEmail(user: User) {
    if (user.$dirty.email) {
        user.email = Crypto.encrypt(user.email.toLowerCase())
    }
  }
  
  @afterFetch()
  @afterFind()
  @afterSave()
  public static async decryptEmail(user: User) {
    if (user.email) {
      user.email = Crypto.decrypt(user.email)
    }
  }
}
