export interface ResetPasswordData {
  userId: number;
  token: string;
  password: string;
}

export interface ActivateAccData {
  id: number;
  token: string;
}
