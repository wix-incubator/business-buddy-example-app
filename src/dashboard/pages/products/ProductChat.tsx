import { Text, Box, Card, Input, Loader } from "@wix/design-system";
import { products } from "@wix/stores";
import React, { useCallback } from "react";
import * as Icons from "@wix/wix-ui-icons-common";
import styles from "./ProductChat.module.css";
import { httpClient } from "@wix/essentials";

type Message = {
  author: "Business Buddy" | "User";
  text: string;
};

async function submitProductChatMessage(
  messages: Message[],
  product: products.Product,
) {
  const response = await httpClient.fetchWithAuth(
    `${import.meta.env.BASE_API_URL}/chat`,
    {
      method: "POST",
      body: JSON.stringify({
        messages,
        product,
      }),
    },
  );
  const message = await response.json();
  return message;
}

export function ProductChat(props: { product: products.Product }) {
  const [isWaitingForReply, setIsWaitingForReply] = React.useState(false);
  const [messageDraft, setMessageDraft] = React.useState<string | undefined>(
    undefined,
  );
  const [chatMessages, setChatMessages] = React.useState<Message[]>([]);

  const submitMessage = useCallback(async () => {
    const newMessage: Message = {
      author: "User",
      text: messageDraft ?? "",
    };
    const messages = chatMessages.concat(newMessage);
    setChatMessages((state) => state.concat(newMessage));
    setMessageDraft("");
    setIsWaitingForReply(true);
    const { message: text } = await submitProductChatMessage(
      messages,
      props.product,
    );
    setChatMessages((messages) =>
      messages.concat({
        author: "Business Buddy",
        text,
      }),
    );
    setIsWaitingForReply(false);
  }, [chatMessages, messageDraft, props.product]);

  return (
    <Card>
      <Card.Header
        title={`Ask Business Buddy about "${props.product.name}"`}
        subtitle={`SKU: ${props.product.sku}`}
      />
      <Card.Content>
        {chatMessages.map((message) => (
          <Box>
            <Text tabName="p">
              <strong>{message.author}</strong>: {message.text}
            </Text>
          </Box>
        ))}
        <Box width="100%" marginTop="SP6">
          <Input
            placeholder="Ask Business Buddy something..."
            className={styles.userInput}
            prefix={
              isWaitingForReply && (
                <Input.Affix>
                  <Loader size="tiny" />
                </Input.Affix>
              )
            }
            suffix={
              <Input.IconAffix>
                <Icons.Send onClick={submitMessage} />
              </Input.IconAffix>
            }
            disabled={isWaitingForReply}
            onChange={(e) => setMessageDraft(e.target.value)}
            value={messageDraft}
            onEnterPressed={submitMessage}
          />
        </Box>
      </Card.Content>
    </Card>
  );
}
