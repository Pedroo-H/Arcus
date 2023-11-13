import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'

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

    // Handle is not insentive for now, but it SHOULD be in future
    public async show({ response, session, params, view, auth }: HttpContextContract) {
        try {
            var user: User
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

    public async store({ response, request, view, session }: HttpContextContract) {
        var name = request.input('name', undefined)
        var email = request.input('email', undefined)
        var password = request.input('password', undefined)
        var handle = request.input('handle', undefined)
        
        if (!name || !email || !password || !handle) {
            session.flashExcept(['register'])
            session.flash({ errors: { register: 'Todos os campos são obrigatórios!' } })
            response.status(400)
            return view.render('user/register')
        }

        const user = await User.create({ name: name, email: email, password: password, handle: handle })
        console.log(user.id)

        return view.render('user/login')
    }

}
