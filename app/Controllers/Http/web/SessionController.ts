import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class SessionController {

    public async show({ response, auth, view }: HttpContextContract) {
        if (auth.use('web').isLoggedIn) {
            return response.redirect().toRoute('home')
        }

        return view.render('user/login')
    }

    // Precisa validar o input? O auth meio que já faz isso...
    // only works with e-mail for now and is not case insensitive
    public async store({ request, auth, response, session, view }: HttpContextContract) {
        var email = request.input('user', undefined)
        var password = request.input('password', undefined) 

        try {
            await auth.use('web').attempt(email, password)
            console.log('logged in')
            return response.redirect().toRoute('home')
        } catch (error) {
            console.log('Invalid login')
            session.flashExcept(['login'])
            session.flash({errors : {login: 'Credenciais inválidas!'}})
            response.status(401) // There must be a better way to do that
            return view.render('user/login')
        }
    }

    public async destroy({ auth, response }: HttpContextContract) {
        if (auth.use('web').isLoggedIn) {
            console.log(auth.user?.handle + " logged out")
            await auth.use('web').logout()
        }

        return response.redirect().toRoute('session.login')
    }

}