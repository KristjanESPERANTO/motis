// Compatibility types for consumers migrating off @hey-api/client-fetch.

import type { QuerySerializerOptions as CoreQuerySerializerOptions } from './core/bodySerializer.gen';
import type { RequestResult as ClientRequestResult, ResponseStyle } from './client/types.gen';

/**
 * @deprecated Use the `querySerializer` option on `client.setConfig()` directly.
 * The @hey-api/client-fetch package is no longer a separate dependency.
 */
export type QuerySerializerOptions = CoreQuerySerializerOptions;

/**
 * @deprecated Use `Awaited<ReturnType<typeof serviceFn>>` or import
 * `RequestResult` from the generated `client/types.gen` module instead.
 * The @hey-api/client-fetch package is no longer a separate dependency.
 */
export type RequestResult<
  Data = unknown,
  TError = unknown,
  ThrowOnError extends boolean = boolean,
  TResponseStyle extends ResponseStyle = 'fields',
> = ClientRequestResult<Data, TError, ThrowOnError, TResponseStyle>;
