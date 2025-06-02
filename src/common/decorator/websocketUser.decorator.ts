import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const WebsocketUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const client = ctx.switchToWs().getClient();
    return client.data.user;
  },
);
