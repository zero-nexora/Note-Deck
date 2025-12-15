export const success = <T>(message: string, data?: T) => ({
  success: true as const,
  message,
  data,
});

export const error = (message: string, errors?: any) => ({
  success: false as const,
  message,
  errors,
});

export type ActionResult<T = unknown> =
  | {
      success: true;
      message: string;
      data?: T;
    }
  | {
      success: false;
      message: string;
      errors?: any;
    };
