import * as constants from "./constant.js";
import * as store from "./store.js";
import * as ui from "./ui.js";
import * as wss from "./wss.js";
let connectedUserDetails;
let peerConnection;
const defaultConstrains = {
  audio: true,
  video: true,
};
const configuration = {
  iceServers: [
    {
      urls: "stun:stun.l.google.com:13902",
    },
  ],
};
export const getLocalPreview = () => {
  navigator.mediaDevices
    .getUserMedia(defaultConstrains)
    .then((stream) => {
      ui.updateLocalVideo(stream);
      store.setLocalStream(stream);
    })
    .catch((error) => {
      console.error("Error accessing media devices.", error);
    });
};

const createPeerConnection = () => {
  peerConnection = new RTCPeerConnection(configuration);

  peerConnection.onicecandidate = (event) => {
    console.log("getting ice candidate from stun server", event);
    if (event.candidate) {
      // send our ice candidate to the other peer
    }
  };

  peerConnection.onconnectionstatechange = (event) => {
    console.log("connection state change", event);
    if (peerConnection.connectionState === "connected") {
      console.log("peers are connected successfully");
    }
  };

  // receiving tracks
  const remoteStream = new MediaStream();
  store.setRemoteStream(remoteStream);
  ui.updateRemoteVideo(remoteStream);

  peerConnection.ontrack = (event) => {
    console.log("track received in ontrack event listner", event.track);
    remoteStream.addTrack(event.track);
  };
  //add our stream to the peer connection
  if (
    connectedUserDetails.callType === constants.callType.VIDEO_PERSONAL_CODE
  ) {
    const localStream = store.getState().localStream;
    for (const track of localStream.getTracks()) {
      peerConnection.addTrack(track, localStream);
    }
  }
};

export const sendPreOffer = (callType, calleePersonalCodeInput) => {
  connectedUserDetails = {
    callType,
    socketId: calleePersonalCodeInput,
  };
  if (
    callType === constants.callType.CHAT_PERSONAL_CODE ||
    callType === constants.callType.VIDEO_PERSONAL_CODE
  ) {
    const data = {
      callType,
      calleePersonalCodeInput,
    };
    ui.showCallinDialog(callingDialogRejectCallHandler);
    wss.sendPreOffer(data);
  }
};
export const handlePreOffer = (data) => {
  const { callType, callerSocketId } = data;
  connectedUserDetails = {
    socketId: callerSocketId,
    callType,
  };
  if (
    callType === constants.callType.CHAT_PERSONAL_CODE ||
    callType === constants.callType.VIDEO_PERSONAL_CODE
  ) {
    ui.showIncomingCallDialog(callType, acceptCallHandler, rejectCallHandler);
  }
};

const acceptCallHandler = () => {
  console.log("call accepted");
  createPeerConnection();
  const Answer = constants.preOfferAnswer.CALL_ACCEPTED;
  sendPreOfferAnswer(Answer);
  ui.showCallElements(connectedUserDetails.callType);
};
const rejectCallHandler = () => {
  console.log("call rejected");
  const Answer = constants.preOfferAnswer.CALL_REJECTED;
  sendPreOfferAnswer(Answer);
};
export const callingDialogRejectCallHandler = () => {
  console.log("reject call");
};

const sendPreOfferAnswer = (preOfferAnswer) => {
  console.log("preOfferAnswer in sendPreOfferAnswer", preOfferAnswer);
  const data = {
    callerSocketId: connectedUserDetails.socketId,
    preOfferAnswer,
  };
  ui.removeAllDialogs();
  wss.sendPreOfferAnswer(data);
  //   connectedUserDetails = null;
};

export const handlePreOfferAnswer = (data) => {
  const { preOfferAnswer } = data;
  console.log("preOfferAnswer in handlePreOfferAnswer", data);
  ui.removeAllDialogs();

  if (preOfferAnswer === constants.preOfferAnswer.CALLEE_NOT_FOUND) {
    // Show dialog that callee not found
    ui.showInfoDialog(preOfferAnswer);
  }
  if (preOfferAnswer === constants.preOfferAnswer.CALL_UNAVAILABLE) {
    // Show dialog that call is unavailable
    ui.showInfoDialog(preOfferAnswer);
  }
  if (preOfferAnswer === constants.preOfferAnswer.CALL_REJECTED) {
    // Show dialog that call is rejected
    ui.showInfoDialog(preOfferAnswer);
  }
  if (preOfferAnswer === constants.preOfferAnswer.CALL_ACCEPTED) {
    // Start webRTC connection
    console.log("call accepted im 4th if");
    ui.showCallElements(connectedUserDetails.callType);
    createPeerConnection();
    sendWebRTCOffer();
  }
};

const sendWebRTCOffer = async () => {
  const offer = await peerConnection.createOffer();
  await peerConnection.setLocalDescription(offer);
  const data = {
    connectedUserSocketId: connectedUserDetails.socketId,
    type: constants.webRTCSignaling.OFFER,
    offer,
  };
  wss.sendDataUsingWebRTCSignaling(data);
};
export const handleWebRTCOffer = async (data) => {
  console.log("webRTC offer came", data);
  await peerConnection.setRemoteDescription(data.offer);
  const answer = await peerConnection.createAnswer();
  await peerConnection.setLocalDescription(answer);
  wss.sendDataUsingWebRTCSignaling({
    connectedUserSocketId: connectedUserDetails.socketId,
    type: constants.webRTCSignaling.ANSWER,
    answer,
  });
};

export const handleWebRTCAnswer = async (data) => {
  console.log("webRTC answer came", data);
  await peerConnection.setRemoteDescription(data.answer);
};
