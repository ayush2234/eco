export interface ApiResponse<Type> {
  data: Type;
  message: string;
}

// New Generic response type
export interface EcommifyApiResponse<Type> {
  result: Type,
  resultInfo: [],
  message: string,
  success: boolean
}