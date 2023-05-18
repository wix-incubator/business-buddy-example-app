import { Text, Box, Card, Input, Loader } from "@wix/design-system";
import { products } from "@wix/stores";
import React from "react";
import * as Icons from "@wix/wix-ui-icons-common";
import styles from "./ProductChat.module.css";
import { fetchWithWixInstance } from "../../utils";

type Message = {
  author: "Business Buddy" | "User";
  text: string;
};

export function ProductChat(props: { product: products.Product }) {
  const [isWaitingForBusinessBuddy, setIsWaitingForBusinessBuddy] =
    React.useState(false);
  const [messageDraft, setMessageDraft] = React.useState<string | undefined>(
    undefined
  );
  const [chatMessages, setChatMessages] = React.useState([] as Message[]);

  async function submitMessage() {
    const newMessage: Message = {
      author: "User",
      text: messageDraft ?? "",
    };
    setChatMessages((state) => [...state, newMessage]);
    setMessageDraft("");
    setIsWaitingForBusinessBuddy(true);
    const { message } = await fetchWithWixInstance(`chat/product`, "POST", {
      messages: [...chatMessages, newMessage],
      product: JSON.stringify(props.product, null, 2),
    });
    setChatMessages((state) => [
      ...state,
      {
        author: "Business Buddy",
        text: message,
      },
    ]);
    setIsWaitingForBusinessBuddy(false);
  }

  return (
    <Card>
      <Card.Header
        title={`Ask Business Buddy about "${props.product.name}"`}
        subtitle={`SKU: ${props.product.sku}`}
      />
      <Card.Content>
        <Box width={"100%"}>
          <Input
            disabled={isWaitingForBusinessBuddy}
            className={styles.userInput}
            suffix={
              <Input.IconAffix>
                <Icons.Send onClick={submitMessage} />
              </Input.IconAffix>
            }
            placeholder="Ask Business Buddy something..."
            onChange={(e) => {
              setMessageDraft(e.target.value);
            }}
            value={messageDraft}
            onEnterPressed={submitMessage}
          />
        </Box>
        {chatMessages.map((message) => (
          <Box>
            <Text tabName="p">
              <b>{message.author}</b>: {message.text}
            </Text>
          </Box>
        ))}
        {isWaitingForBusinessBuddy && (
          <Box align="center" padding="8px 0px">
            <Loader size="small" />
          </Box>
        )}
      </Card.Content>
    </Card>
  );
}
