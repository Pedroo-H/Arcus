import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BaseValidator from './BaseValidator'
import User from 'App/Models/User'

export default class CreateUserValidator extends BaseValidator {
  constructor(protected ctx: HttpContextContract) {
    super()
  }

  public schema = schema.create({
    email: schema.string({ trim: true }, [
      rules.email(),
      rules.unique({ table: 'users', column: 'email', caseInsensitive: true }),
    ]),
    name: schema.string({ trim: true }, [
      rules.minLength(4),
      rules.maxLength(256),
    ]),
    handle: schema.string({ trim: true }, [
      rules.minLength(4),
      rules.maxLength(256),
      rules.regex(User.regex_handle),
      rules.unique({ table: 'users', column: 'handle', caseInsensitive: true }),
    ]),
    password: schema.string([
      rules.minLength(8),
      rules.maxLength(128),
    ]),
  })

  public messages: CustomMessages = {...this.messages}
}
