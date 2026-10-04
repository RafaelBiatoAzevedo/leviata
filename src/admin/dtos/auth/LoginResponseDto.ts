export interface LoginUserResponseDto {
  id: string;

  email: string;

  firstName?: string | null;

  lastName?: string | null;

  role: string;
}

export interface LoginResponseDto {
  accessToken: string;

  refreshToken: string;

  tokenType: string;

  user: LoginUserResponseDto;
}
