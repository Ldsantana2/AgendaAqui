import { createContext, useContext } from "react";
import { message } from "antd";

type MessageContextType = {
  messageApi: ReturnType<typeof message.useMessage>[0];
};

const MessageContext = createContext<MessageContextType | null>(null);

export const useMessage = () => {
  const context = useContext(MessageContext);
  if (!context) {
    throw new Error("useMessage must be used within a MessageProvider");
  }
  return context.messageApi;
};

export const MessageProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [messageApi, contextHolder] = message.useMessage();

  return (
    <MessageContext.Provider value={{ messageApi }}>
      {contextHolder}
      {children}
    </MessageContext.Provider>
  );
};
