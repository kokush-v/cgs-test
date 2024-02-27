import HttpService from '../../../api/http.service';
import { BACKEND_KEYS, STORAGE_KEYS } from '../../consts/app-keys.const';
import { AuthData, ReqResetPasswordData, ResetPasswordData } from '../../types/auth/auth.types';
import UserModel from '../../types/user/user.model';
import { IUser } from '../../types/user/user.types';

class TodoService extends HttpService {
  async register(body: AuthData) {
    const { data } = await this.put<AuthData>({
      method: 'post',
      url: BACKEND_KEYS.AUTH.REG,
      data: body
    });

    return data;
  }

  async getUser() {
    const { data } = await this.get<IUser>({
      url: BACKEND_KEYS.AUTH.USER
    });

    return data;
  }

  async login(body: AuthData) {
    const { data: user, token } = await this.put<{ data: UserModel; token: string }>({
      method: 'post',
      url: BACKEND_KEYS.AUTH.LOGIN,
      data: body,
      withCredentials: true
    });

    if (token) {
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, `Bearer ${token}`);
    }

    return user;
  }

  async reqResetPass(body: ReqResetPasswordData) {
    await this.put({
      method: 'post',
      url: BACKEND_KEYS.AUTH.REQ_RESET_PASS,
      data: body
    });
  }

  async resetPass(body: ResetPasswordData) {
    await this.put({
      method: 'post',
      url: BACKEND_KEYS.AUTH.RESET_PASS,
      data: body
    });
  }
}

export default new TodoService();
