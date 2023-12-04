import { Exception } from '@adonisjs/core/build/standalone'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import UserService from 'App/Services/UserService'
import CreateUserValidator from 'App/Validators/CreateUserValidator'

// Needs to validate some inputs, improve the logic behind some methods, mainly update/patch
export default class UsersController {

    public async create({ view }: HttpContextContract) {
        return view.render('user/register')
    }

    // In future, this method will allow moderators to edit other users profile
    // So the logic behind this will be slightly different
    public async update({ session, view, params, response }: HttpContextContract) {
        try {
            const id = User.findOrFail(params.id)
            return view.render('user/edit', { id: id })
        } catch (error) {
            session.flashExcept(['edit'])
            session.flash({ errors: { edit: 'Perfil não encontrado!' } })
            return response.redirect().toRoute('user.show')
        }
    }

    public async patch({ response, session, params, request }: HttpContextContract) {
        try {   
            const user = await User.findOrFail(params.id)
            const email = request.input('email', undefined) || user.email
            const name = request.input('name', undefined) || user.name
            const description = request.input('description', undefined) || user.description

            user.email = email
            user.name = name
            user.description = description

            await user.save()
            session.flashExcept(['success'])
            session.flash({ success: 'Perfil atualizado com sucesso!' })
            return response.redirect().toRoute('user.show', { id: user.id })
        } catch (error) {
            session.flashExcept(['edit'])
            session.flash({ errors: { edit: 'Erro ao atualizar perfil!' } })
            return response.redirect().toRoute('user.edit', { id: params.id })
        }
    }

    public async show({ response, session, params, view, auth }: HttpContextContract) {
        try {
            var user

            var userService = new UserService()
            if (!params.id && !params.handle) {
                throw new Exception('No user specified', 404, 'E_ROUTE_NOT_FOUND')
            }

            
            if (params.id || params.handle) {
                user = params.id ? await User.findOrFail(params.id) : await User.findByOrFail('handle', params.handle)
            } else user = auth.user!

            console.log(user.id, user.handle)

            return view.render('wip', {user: user})
        } catch (error) {
            session.flashExcept(['show'])
            session.flash({ errors: { show: 'Usuário não encontrado!' } })
            response.status(404)
            return view.render('wip')
        }
    }

    public async store({ response, request, session }: HttpContextContract) {
        const payload = await request.validate(CreateUserValidator)
        const userService = new UserService()

        const user = await userService.create(payload.email, payload.name, payload.handle, payload.password)
        console.log(`account with ID ${user.id} created, handle: ${user.handle}, email: ${user.email}, name: ${user.email}`)

        session.flashOnly([])
        session.flash({ register: {success: 'Conta criada com sucesso!'} })

        return response.redirect().toRoute('session.login')
    }

}
