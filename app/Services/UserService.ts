import User from "App/Models/User"

export default class UserService {
    constructor() {}

    public async findUser(str: string): Promise<User> {
        let user: User;
        if (User.regex_email.test(str)) {
            user = await User.query().whereRaw('LOWER(email) = ?', [str.toLowerCase()]).firstOrFail()
        } else if (User.regex_handle.test(str)) {
            user = await User.query().whereRaw('LOWER(handle) = ?', [str.toLowerCase()]).firstOrFail()
        }  else if (User.regex_number.test(str)) {
            user = await User.findOrFail(str)
        }

        return user!;
    }
}
