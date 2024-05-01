import * as constants from "./constant.js";
import * as store from "./store.js";
import * as webRTCHandler from "./webRTCHandler.js";
import * as wss from "./wss.js";
// Initialize the store with the initial state
const socket = io("http://localhost:8080");
wss.resgisterSocketEvents(socket);

webRTCHandler.getLocalPreview();

//copy the personal code to clipboard
const personalCodeCopyButton = document.getElementById(
  "personal_code_copy_button"
);
personalCodeCopyButton.addEventListener("click", () => {
  navigator.clipboard.writeText(store.getState().socketId);
});
//register event listeners for the connection buttons
const personalCodeChatButton = document.getElementById(
  "personal_code_chat_button"
);
const personalCodeVideoButton = document.getElementById(
  "personal_code_video_button"
);

personalCodeChatButton.addEventListener("click", () => {
  console.log("Chat button clicked");
  const calleePersonalCodeInput = document.getElementById(
    "personal_code_input"
  ).value;
  const callType = constants.callType.CHAT_PERSONAL_CODE;
  webRTCHandler.sendPreOffer(callType, calleePersonalCodeInput);
});

personalCodeVideoButton.addEventListener("click", () => {
  console.log("Video button clicked");
  const calleePersonalCodeInput = document.getElementById(
    "personal_code_input"
  ).value;
  const callType = constants.callType.VIDEO_PERSONAL_CODE;

  webRTCHandler.sendPreOffer(callType, calleePersonalCodeInput);
});
