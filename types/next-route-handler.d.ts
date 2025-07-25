import 'next/server';

declare module 'next/server' {
  interface RouteHandlerContext {
    params: Record<string, string>;
  }

  interface RouteHandler {
    (
      request: Request,
      context: RouteHandlerContext
    ): Promise<Response>;
  }
}
