export const getIncomingCallDialog = (
  callTypeInfo,
  acceptCallHandler,
  rejectCallHandler
) => {
  console.log("getIncomingCallDialog");
  const dialog = document.createElement("div");
  dialog.classList.add("dialog_wrapper");
  const dialogContent = document.createElement("div");
  dialogContent.classList.add("dialog_content");
  dialog.appendChild(dialogContent);
  const title = document.createElement("p");
  title.classList.add("dialog_title");
  title.innerHTML = `Incoming ${callTypeInfo} call`;

  const imageContainer = document.createElement("div");
  imageContainer.classList.add("dialog_image_container");
  const personImage = document.createElement("img");
  personImage.src =
    "com/photo-1704319180538-f57994377412?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

  imageContainer.appendChild(personImage);

  const buttonsContainer = document.createElement("div");
  buttonsContainer.classList.add("dialog_buttons_container");
  const acceptButton = document.createElement("button");
  acceptButton.classList.add("dialog_accept_call_button");
  acceptButton.innerHTML = "Accept";
  acceptButton.addEventListener("click", () => {
    console.log("acceptButton clicked");
    acceptCallHandler();
  });
  const rejectButton = document.createElement("button");
  rejectButton.classList.add("dialog_reject_call_button");
  rejectButton.innerHTML = "Reject";
  rejectButton.addEventListener("click", () => {
    console.log("rejectButton clicked");
    rejectCallHandler();
  });

  dialogContent.appendChild(title);
  dialogContent.appendChild(imageContainer);
  dialogContent.appendChild(buttonsContainer);
  buttonsContainer.appendChild(acceptButton);
  buttonsContainer.appendChild(rejectButton);

  return dialog;
};
export const getCallingDialog = (rejectCallHandler) => {
  const dialog = document.createElement("div");
  dialog.classList.add("dialog_wrapper");
  const dialogContent = document.createElement("div");
  dialogContent.classList.add("dialog_content");
  dialog.appendChild(dialogContent);
  const title = document.createElement("p");
  title.classList.add("dialog_title");
  title.innerHTML = `Calling...`;

  const imageContainer = document.createElement("div");
  imageContainer.classList.add("dialog_image_container");
  const personImage = document.createElement("img");
  personImage.src =
    "com/photo-1704319180538-f57994377412?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
  imageContainer.appendChild(personImage);

  const buttonsContainer = document.createElement("div");
  buttonsContainer.classList.add("dialog_button_container");

  const cancelButton = document.createElement("button");
  cancelButton.classList.add("dialog_reject_call_button");
  cancelButton.innerHTML = "Cancel";
  buttonsContainer.appendChild(cancelButton);

  dialogContent.appendChild(title);
  dialogContent.appendChild(imageContainer);
  dialogContent.appendChild(buttonsContainer);
  return dialog;
};

export const getInfoDialog = (title, description) => {
  const dialog = document.createElement("div");
  dialog.classList.add("dialog_wrapper");
  const dialogContent = document.createElement("div");
  dialogContent.classList.add("dialog_content");
  dialog.appendChild(dialogContent);
  const titleElement = document.createElement("p");
  titleElement.classList.add("dialog_title");
  titleElement.innerHTML = title;

  const descriptionElement = document.createElement("p");
  descriptionElement.classList.add("dialog_description");
  descriptionElement.innerHTML = description;

  dialogContent.appendChild(titleElement);
  dialogContent.appendChild(descriptionElement);
  return dialog;
};
