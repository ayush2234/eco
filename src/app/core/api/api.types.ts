// New Generic response type
export interface EcommifyApiResponse<Type> {
  result: Type;
  message: string;
  success: boolean;
  errors: [];
}
