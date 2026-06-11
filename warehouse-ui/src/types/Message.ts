export interface Message {
  sender: "user" | "bot";
  text: string;
  type?: "text" | "topic-chips" | "suggestions" | "barcode-input" | "followup" | "date-input";
  topic?: string;
  pendingQuestion?: string;
}