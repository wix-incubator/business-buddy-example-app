import React, { useCallback, useState, type FC } from "react";
import { products } from "@wix/stores";
import { httpClient } from "@wix/essentials";
import { Text, Box, Card, Input, Loader } from "@wix/design-system";
import * as Icons from "@wix/wix-ui-icons-common";
import type { ChatMessage } from '../../../types';
import styles from "./ProductChat.module.css";

async function submitProductChatMessage(
  messages: ChatMessage[],
  product: products.Product,
) {
  const response = await httpClient.fetchWithAuth(`${import.meta.env.BASE_API_URL}/chat`, {
    method: "POST",
    body: JSON.stringify({
      messages,
      product,
    }),
  });
  const message = await response.json();

  return message;
}

export const ProductChat: FC<{ product: products.Product }> = ({ product }) => {
  const [isWaitingForReply, setIsWaitingForReply] = useState<boolean>(false);
  const [messageDraft, setMessageDraft] = useState<string>();
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

  const submitMessage = useCallback(async () => {
    const newMessage: ChatMessage = {
      text: messageDraft ?? "",
      author: "User",
    };
    const messages = chatMessages.concat(newMessage);

    setChatMessages((state) => state.concat(newMessage));
    setMessageDraft("");
    setIsWaitingForReply(true);

    const { message: text } = await submitProductChatMessage(
      messages,
      product,
    );

    setChatMessages((messages) =>
      messages.concat({
        author: "Business Buddy",
        text,
      }),
    );
    setIsWaitingForReply(false);
  }, [chatMessages, messageDraft, product]);

  return (
    <Card>
      <Card.Header
        title={`Ask Business Buddy about "${product.name}"`}
        subtitle={`SKU: ${product.sku}`}
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
            className={styles.userInput}
            onChange={(e) => setMessageDraft(e.target.value)}
            onEnterPressed={submitMessage}
            disabled={isWaitingForReply}
            value={messageDraft}
            placeholder="Ask Business Buddy something..."
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
          />
        </Box>
      </Card.Content>
    </Card>
  );
}
