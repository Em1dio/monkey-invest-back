import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const User = createParamDecorator(
  (data: unknown, ctx) => {
    const user = ctx.user;

    const {
      id,
      name,
      username,
      password,
      active,
      createAt,
      telephone
    } = user

    return {
      id,
      name,
      username,
      password,
      active,
      createAt,
      telephone
    }
  },
);