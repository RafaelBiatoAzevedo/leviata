export interface LoginUserResponseDto {
  id: string;

  email: string;

  firstName?: string;

  lastName?: string;

  role: string;
}

export interface LoginResponseDto {
  accessToken: string;

  refreshToken: string;

  tokenType: string;

  user: LoginUserResponseDto;
}
