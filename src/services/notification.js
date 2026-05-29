import NotificationCollection from "../models/notifications.js";

export const sendNotification = async ({
  user,
  title,
  message,
  type = "info",
  metadata = {},
}) => {
  return await NotificationCollection.create({
    user,
    title,
    message,
    type,
    metadata,
  });
};
