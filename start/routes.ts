/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer''
|
*/

/*
  - Likes, comentarios e bookmarks precisam ser tratados dps (Modelos próprios? Relacionamentos?)
  - Resolver posts e comentários apagados (por enquanto tá em cascada, vai continuar assim?) - FLAG 
  - Sistema de tags e pesquisa

  - Criar um sistema de log decente :/
*/

/*
  controladores - auth - validators
*/

import Route from '@ioc:Adonis/Core/Route'
import User from 'App/Models/User'

// Não gostei da forma que as rotas ficaram organizadas, mas não consegui pensar em uma forma melhor por agora
// O que mais está me incomodando é a parte do handle/id e a parte do session ter coisa do session e usuário (registro)

Route.group(() => {
    Route.get('/', async ({ response }) => {
      return response.redirect().toRoute('post.index')
    }).as('home')     

    Route.group(() => {
      Route.get('/register', 'UserController.create').as('register.show')
      Route.post('/register', 'UserController.store').as('register.create')
      Route.get('/login', 'SessionController.show').as('show')
      Route.post('/login', 'SessionController.store').as('login')
      Route.get('/logout', 'SessionController.destroy').as('logout')
    }).as('session')

    Route.group(() => {
      Route.get('/edit', 'UserController.update').as('update')
      Route.patch('/edit', 'UserController.patch').as('patch') 
      Route.get('/:handle', 'UserController.show').where('handle', User.regex_handle).as('show.handle')
      Route.get('/:id', 'UserController.show').as('show_id').where('id', /^[0-9]+$/).as('show.id')
      Route.get('/', 'UserController.show').as('show')
    }).prefix('user').as('user').middleware('auth:web')

    Route.group(() => {
      Route.get('/', 'PostsController.index').as('index')
      Route.get('/create', 'PostsController.create').as('create')
      Route.post('/create', 'PostsController.store').as('store')
      Route.get('/:id', 'PostsController.show').where('id', /^[0-9]+$/).as('show')
    }).prefix('post').as('post').middleware('auth:web')

    Route.any('*', async ({ view }) => {
      return view.render('404')
    }).as('404')
  }
).namespace('App/Controllers/Http/Web')

//aaa

/*
  Route.get('/:handle/likes', async ({ view }) => {
        return view.render('wip')
      }).where('handle', /^[a-zA-Z][a-zA-Z0-9]{3,17}$/).as('likes')

      Route.get('/:handle/bookmarks', async ({ view }) => {
        return view.render('wip')
      }).as('bookmarks')
*/