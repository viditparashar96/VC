import * as constants from "./constant.js";
import * as elements from "./elements.js";
export const updatePersonalCode = (socketId) => {
  const personalCodePara = document.getElementById("personal_code_paragraph");
  personalCodePara.innerText = socketId;
};

export const updateLocalVideo = (stream) => {
  const localVideo = document.getElementById("local_video");
  localVideo.srcObject = stream;
  localVideo.addEventListener("loadedmetadata", () => {
    localVideo.play();
  });
};

export const updateRemoteVideo = (stream) => {
  const remoteVideo = document.getElementById("remote_video");
  remoteVideo.srcObject = stream;
  // remoteVideo.addEventListener("loadedmetadata", () => {
  //   remoteVideo.play();
  // });
};

export const showIncomingCallDialog = (
  callType,
  acceptCallHandler,
  rejectCallHandler
) => {
  const callTypeInfo =
    callType === constants.callType.CHAT_PERSONAL_CODE ? "Chat" : "Video";

  const incomingCallDialog = elements.getIncomingCallDialog(
    callTypeInfo,
    acceptCallHandler,
    rejectCallHandler
  );

  // Removing all dialogs
  const dialog = document.getElementById("dialog");
  dialog.querySelectorAll("*").forEach((n) => n.remove());
  dialog.appendChild(incomingCallDialog);
};
export const showCallinDialog = (rejectCallHandler) => {
  const callingDialog = elements.getCallingDialog(rejectCallHandler);
  const dialog = document.getElementById("dialog");
  dialog.querySelectorAll("*").forEach((n) => n.remove());

  dialog.appendChild(callingDialog);
};

export const removeAllDialogs = () => {
  const dialog = document.getElementById("dialog");
  dialog.querySelectorAll("*").forEach((n) => n.remove());
};

export const showInfoDialog = (preOfferAnswer) => {
  let infoDialog = null;
  if (preOfferAnswer === constants.preOfferAnswer.CALL_REJECTED) {
    infoDialog = elements.getInfoDialog(
      "Call Rejected",
      "Callee rejected your call"
    );
  }
  if (preOfferAnswer === constants.preOfferAnswer.CALLEE_NOT_FOUND) {
    infoDialog = elements.getInfoDialog(
      "Callee not found",
      "Callee is not connected to the server. Please try again later"
    );
  }
  if (preOfferAnswer === constants.preOfferAnswer.CALL_UNAVAILABLE) {
    infoDialog = elements.getInfoDialog(
      "Call is not available",
      "The call is not available at the moment. Please try again later"
    );
  }
  if (infoDialog) {
    const dialog = document.getElementById("dialog");
    dialog.appendChild(infoDialog);
    setTimeout(() => {
      removeAllDialogs();
    }, [4000]);
  }
};

export const showCallElements = (callType) => {
  if (callType === constants.callType.CHAT_PERSONAL_CODE) {
    showChatCallElements();
  }
  if (callType === constants.callType.VIDEO_PERSONAL_CODE) {
    showVideoCallElements();
  }
};

const showChatCallElements = () => {
  const finishConnectionChatButtonContainer = document.getElementById(
    "finish_chat_button_container"
  );
  showElement(finishConnectionChatButtonContainer);

  const newMessageInput = document.getElementById("new_message");
  showElement(newMessageInput);
  // block panel for the chat
  disableDashboard();
};
const showVideoCallElements = () => {
  const callButtons = document.getElementById("call_buttons");
  showElement(callButtons);
  const placeholder = document.getElementById("video_placeholder");
  hideElement(placeholder);
  const remoteVideo = document.getElementById("remote_video");
  showElement(remoteVideo);
  const newMessageInput = document.getElementById("new_message");
  showElement(newMessageInput);
  // block panel
  disableDashboard();
};

// ui helper functions
const enableDashboard = () => {
  const dashboardBlocker = document.getElementById("dashboard_blur");
  if (!dashboardBlocker.classList.contains("display_none")) {
    dashboardBlocker.classList.add("display_none");
  }
};

const disableDashboard = () => {
  const dashboardBlocker = document.getElementById("dashboard_blur");
  if (dashboardBlocker.classList.contains("display_none")) {
    dashboardBlocker.classList.remove("display_none");
  }
};
const hideElement = (element) => {
  if (!element.classList.contains("display_none")) {
    element.classList.add("display_none");
  }
};
const showElement = (element) => {
  if (element.classList.contains("display_none")) {
    element.classList.remove("display_none");
  }
};
