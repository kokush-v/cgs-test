import jwt from 'jsonwebtoken';
import { Response, NextFunction, Request } from 'express';
import passport from 'passport';

import UserService from '../services/user.service';
import {
  CreateUserRequest,
  GetUserRequest,
  LoginUserRequest,
  ResetPasswordRequest
} from '../types/requests.types';
import {
  CreateUserResponse,
  GetUserResponse,
  LoginUserResponse,
  Status
} from '../types/responses.types';
import { comparePasswords, hashPassword } from '../routes/middlewares/auth.middlewares';
import { User } from '../entities/User.entity';
import { IUserSession } from '../types/user.type';
import { ERRORS, MESSAGES } from '../constants';
import { ActivateAccData } from '../types/token.type';

export class UserController {
  constructor(private userService: UserService) {}

  async registerUser(req: CreateUserRequest, res: Response<CreateUserResponse>) {
    const { email, name, password } = req.body;
    const response = await this.userService.create({
      email,
      name,
      password: await hashPassword(password)
    });

    res.send({ data: response, message: MESSAGES.USER.CREATED });
  }

  async loginUser(
    req: LoginUserRequest,
    res: Response<LoginUserResponse | { error: string }>,
    next: NextFunction
  ) {
    passport.authenticate('login', async (err: Error) => {
      const userReq = req.body;
      const user = await User.findOneBy({ email: userReq.email, active: true });

      if (err || !user) {
        return res.status(400).json({ error: ERRORS.NOT_ACTIVE });
      }

      if (!(await comparePasswords(userReq.password, user.password))) {
        return res.status(400).json({ error: ERRORS.INCORRECT_PASS });
      }

      req.login(user, { session: false }, async (error) => {
        if (error) throw error;

        const body: IUserSession = { id: user.id, email: user.email, name: user.name };
        const token = jwt.sign({ user: body }, process.env.JWT_SECRET);

        return res.json({ data: user, token, message: MESSAGES.USER.LOGINED });
      });
    })(req, res, next);
  }

  async getUser(req: GetUserRequest, res: Response<GetUserResponse>) {
    const user = req.user as IUserSession;

    res.send({ data: user });
  }

  async reqPasswordReset(req: GetUserRequest, res: Response<Status>) {
    await this.userService.requestPasswordReset(req.body.email);

    res.send({ message: MESSAGES.USER.EMAIL_SENDED });
  }

  async resetPassword(req: ResetPasswordRequest, res: Response<Status>) {
    await this.userService.passwordReset({ ...req.body, userId: Number(req.body.userId) });

    res.send({ message: MESSAGES.USER.PASSWORD_CHANGED });
  }

  async activateAccount(req: Request<any, any, any, ActivateAccData>, res: Response<Status>) {
    await this.userService.activateAcc({ ...req.query, id: Number(req.query.id) });

    res.redirect(`${process.env.CLIENT_URL}/auth/login`);
  }
}

const userController = new UserController(new UserService());
export default userController;
