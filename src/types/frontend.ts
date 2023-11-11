import { z } from 'zod';

// Frontend Error - generic error object for the frontend app,
// this may hold a backend error or it may not
const frontendError = z.object({
  statusCode: z.union([z.number(), z.string()]),
  message: z.string(),
});

export type frontendErrorType = z.infer<typeof frontendError>;
// export const isFrontendErrorType = (unk: unknown): unk is frontendErrorType => {
//   const { success } = frontendError.safeParse(unk);
//   return success;
// };

//
// Validation Errors Shape
//
const validationErrors = z.record(z.string(), z.boolean());

export type validationErrorsType = z.infer<typeof validationErrors>;
