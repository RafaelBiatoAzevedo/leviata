export interface LoginUserResponseDto {
  id: string;

  email: string;

  firstName?: string;

  lastName?: string;

  role: string;
}

export interface LoginResponseDto {
  accessToken: string;

  tokenType: string;

  user: LoginUserResponseDto;
}
