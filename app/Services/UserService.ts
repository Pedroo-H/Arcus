import User from "App/Models/User"
import Crypto from "Contracts/crypto"

export default class UserService {
    constructor() {}

    public async findUser(str: string): Promise<User> {
        let user: User

        if (!str) throw new Error('No user specified')

        if (User.regex_email.test(str)) {
            user = await User.findByOrFail('email', Crypto.encrypt(str.toLowerCase()))
        } else if (User.regex_handle.test(str)) {
            user = await User.query().whereRaw('LOWER(handle) = ?', [str.toLowerCase()]).firstOrFail()
        }  else if (User.regex_number.test(str)) {
            user = await User.findOrFail(str)
        }

        return user!
    }

    public async create(email: string, name: string, handle: string, password: string): Promise<User> {
        return await User.create({ email: email, name: name, handle: handle, password: password })
    }
}
