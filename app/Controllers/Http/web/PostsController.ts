import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Post from 'App/Models/Post'

export default class PostsController {

    public async index({view, auth}: HttpContextContract) {
        const posts = await Post.all()
        // TODO pagination
        return view.render('wip', {posts: posts, user: auth.user})
    }

    public async store({ session, view, request, response, auth }: HttpContextContract) {
        var title = request.input('title', undefined)
        var content = request.input('content', undefined)
        var userId = auth.user?.id

        if (!title || !content) {
            session.flashExcept(['create'])
            session.flash({ errors: { create: 'Título e conteúdo são obrigatórios!' } })
            return view.render('post/create')
        }

        var post = await Post.create({ userId: userId, title: title, content: content })

        return response.redirect().toRoute('view', { id: post.id, user: auth.user })
    }

    public async show({ response, params, view, auth }: HttpContextContract) {
        try {
            var post = await Post.findOrFail(params.id)
            return view.render('post/show', { post: post, user: auth.user})
        } catch (error) {
            response.status(404)
            return view.render('404')
        }
    }

    public async create({ view, auth }: HttpContextContract) {
        return view.render('post/create', { user: auth.user })
    }
}
