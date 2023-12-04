import { schema, CustomMessages } from '@ioc:Adonis/Core/Validator'

export default class BaseValidator {

  public schema = schema.create({})

  public messages: CustomMessages = {
    minLength: 'Deve ter pelo menos {{ options.minLength }} caracteres',
    maxLength: 'Deve ter menos de {{ options.maxLength }} caracteres',
    required: 'O campo é obrigatório',
    email: 'Precisa ser um e-mail válido',
    notIn: 'O valor não é permitido para o campo',
    unique: 'Esse valor já está em uso',
    number: 'O campo precisa ser um número',
    range: 'O valor está fora da faixa do campo',
    exists: 'O valor não foi encontrado',
    confirmed: 'Não conferem os valores',
  }
}
