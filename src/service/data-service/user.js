'use strict';

const passwordUtils = require(`../lib/password`);

class UserService {
  constructor(sequelize) {
    this._User = sequelize.models.User;
  }

  async add(userData) {
    const {password} = userData;
    const passwordHash = await passwordUtils.hash(password);

    const updatedFormData = {
      ...userData,
      passwordHash
    };

    delete updatedFormData.passwordRepeat;

    const newUser = await this._User.create(updatedFormData);
    return newUser.get();
  }

  async findAll() {
    const users = await this._User.findAll();
    return users.map((item) => item.get());
  }

  async findByEmail(email) {
    const foundUser = await this._User.findOne({where: {email}});
    return foundUser && foundUser.get();
  }
}

module.exports = UserService;
