import { Exception } from '@adonisjs/core/build/standalone'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import UserService from 'App/Services/UserService'
import Crypto from 'Contracts/crypto'

export default class SessionController {

    public async show({ response, auth, view }: HttpContextContract) {
        if (auth.use('web').isLoggedIn) {
            return response.redirect().toRoute('home')
        }
        
        return view.render('user/login')
    }

    public async store({ request, auth, response, session }: HttpContextContract) {
        var login = request.input('user', undefined)
        var password = request.input('password', undefined)

        try {
            var service = new UserService()
            var user = await service.findUser(login)

            if (!user) {
                throw new Exception('User not found', 403, 'E_USER_NOT_FOUND')
            }

            await auth.use('web').attempt(Crypto.encrypt(user.email), password)
            console.log(`${user.handle} logged in`)

            return response.redirect().toRoute('home')
        } catch (error) {
            if (error.code === 'E_USER_NOT_FOUND') {
                console.log('User não encontrado!')
            } else if (error.code === 'E_INVALID_AUTH_PASSWORD') {
                console.log('Senha incorreta')
            } else {
                console.log('Erro no login :/')
                console.log(error)
            }

            console.log('Invalid login')
            session.flashExcept(['login'])
            session.flash({errors : {login: 'Credenciais inválidas!'}})
            return response.redirect().back()
        }
    }

    public async destroy({ auth, response }: HttpContextContract) {
        if (auth.use('web').isLoggedIn) {
            console.log(auth.user?.handle + " logged out")
            console.log(auth.user)
            await auth.use('web').logout()
        }

        return response.redirect().toRoute('session.login')
    }

}