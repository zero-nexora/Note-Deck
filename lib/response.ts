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

export function unwrapActionResult<T>(result: ActionResult<T>): T | null {
  if (!result.success || result.data == null) return null;
  return result.data;
}
