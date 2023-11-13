import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import UserService from 'App/Services/UserService'

export default class SessionController {

    public async show({ response, auth, view }: HttpContextContract) {
        if (auth.use('web').isLoggedIn) {
            return response.redirect().toRoute('home')
        }
        
        return view.render('user/login')
    }

    public async store({ request, auth, response, session, view }: HttpContextContract) {
        var login = request.input('user', undefined)
        var password = request.input('password', undefined) 

        try {
            var service = new UserService()
            var user = await service.findUser(login)
            await auth.use('web').attempt(user.email, password)
            console.log('logged in')
            return response.redirect().toRoute('home')
        } catch (error) {
            console.log('Invalid login')
            console.log(error)
            session.flashExcept(['login'])
            session.flash({errors : {login: 'Credenciais inválidas!'}})
            return response.redirect().back()
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