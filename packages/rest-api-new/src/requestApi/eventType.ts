/**
 * EventType
 *
 * Interne hendelser i en request-prosess. Kan kobles til eksterne hendelser
 * via @see NotificationMapper.
 */
enum EventType {
  POLLING_HALTED_OR_DELAYED = 'POLLING_HALTED_OR_DELAYED',
  POLLING_TIMEOUT = 'POLLING_TIMEOUT',
  REQUEST_ERROR = 'REQUEST_ERROR',
  REQUEST_FINISHED = 'REQUEST_FINISHED',
  REQUEST_FORBIDDEN = 'REQUEST_FORBIDDEN',
  REQUEST_STARTED = 'REQUEST_STARTED',
  REQUEST_UNAUTHORIZED = 'REQUEST_UNAUTHORIZED',
  STATUS_REQUEST_FINISHED = 'STATUS_REQUEST_FINISHED',
  STATUS_REQUEST_STARTED = 'STATUS_REQUEST_STARTED',
  UPDATE_POLLING_MESSAGE = 'UPDATE_POLLING_MESSAGE',
  REQUEST_GATEWAY_TIMEOUT_OR_NOT_FOUND = 'REQUEST_GATEWAY_TIMEOUT_OR_NOT_FOUND',
}

export default EventType;
