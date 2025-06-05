import { applyDecorators, Type } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiNoContentResponse,
} from '@nestjs/swagger';

export function ApiCommonErrors() {
  return applyDecorators(
    ApiBadRequestResponse({
      description: 'Invalid data or incorrect parameters',
    }),
    ApiUnauthorizedResponse({
      description: 'Unauthorized - Invalid or expired token',
    }),
    ApiForbiddenResponse({
      description: 'Not allowed',
    }),
  );
}

export function ApiResourceErrors() {
  return applyDecorators(
    ApiCommonErrors(),
    ApiNotFoundResponse({ description: 'Resource not found' }),
  );
}

export function ApiCreationErrors() {
  return applyDecorators(
    ApiCommonErrors(),
    ApiConflictResponse({ description: 'Conflict - resource already exists' }),
  );
}

export function ApiGetEndpoint<T>(type: Type<T> | [Type<T>]) {
  return applyDecorators(
    ApiOkResponse({ description: 'Success', type }),
    ApiResourceErrors(),
  );
}

export function ApiCreateEndpoint<T>(type: Type<T> | [Type<T>]) {
  return applyDecorators(
    ApiCreatedResponse({ description: 'Created', type }),
    ApiCreationErrors(),
  );
}
export function ApiDeleteEndpoint() {
  return applyDecorators(
    ApiNoContentResponse({ description: 'Success' }),
    ApiNotFoundResponse({ description: 'Resource not found' }),
    ApiCommonErrors(),
  );
}

export function ApiUpdateEndpoint<T>(type: Type<T> | [Type<T>]) {
  return applyDecorators(
    ApiCommonErrors(),
    ApiOkResponse({ description: 'Success', type }),
    ApiResourceErrors(),
  );
}
