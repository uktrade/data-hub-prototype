export const SET_FLASH_MESSAGE = 'SET_FLASH_MESSAGE';
export const CLEAR_FLASH_MESSAGE = 'CLEAR_FLASH_MESSAGE';

export function setFlashMessage(message) {
  return {
    type: SET_FLASH_MESSAGE,
    payload: message,
  };
}

export function clearFlashMessage() {
  return {
    type: CLEAR_FLASH_MESSAGE,
  };
}
