export interface Message {
  sender: "user" | "bot";
  text: string;
  type?: "text" | "topic-chips" | "suggestions" | "barcode-input";
  topic?: string;
}