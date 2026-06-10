type Props = {
  topic: string;
  barcode: string;
  onQuestionClick: (question: string) => void;
};

export default function SuggestedQuestions({
  topic,
  barcode,
  onQuestionClick,
}: Props) {

  const questions: Record<string, string[]> = {

    "Movement Analytics": [
      "Show movement history",
      "Show previous location",
      "Show location changes",
      "Show idle bins",
      "Show stagnant bins",
    ],

    "Bin Information": [
      "Show current location",
      "Show current quantity",
      "Show material history",
      "Show full barcode details",
      "Show unused bins",
    ],

    "Audit History": [
      "Show audit history",
      "Show latest audit",
      "Show audit count",
      "Show audit timeline",
    ],

    "Inventory Analytics": [
      "Which material has highest quantity",
      "Show material history",
      "Show aging inventory",
      "Show inventory by location",
    ],

    "Employee Analytics": [
      "Which employee updated barcode",
      "Show employee audit count",
      "Show latest employee update",
      "Most active employee",
    ],

    "Purchase Analytics": [
      "Which year has maximum purchases",
      "Show purchase trends",
      "Show purchase count",
    ],
  };

  const barcodeQuestions = [
    "Show movement history",
    "Show previous location",
    "Show location changes",
    "Show current location",
    "Show current quantity",
    "Show material history",
    "Show full barcode details",
    "Show audit history",
    "Show latest audit",
    "Show audit count",
    "Show audit timeline",
    "Which employee updated barcode",
    "Show employee audit count",
    "Show latest employee update",
  ];

  function handleQuestionClick(question: string) {

    if (
      barcodeQuestions.includes(question) &&
      barcode.trim()
    ) {
      onQuestionClick(
        `${question} for barcode ${barcode}`
      );
    }
    else if (
      barcodeQuestions.includes(question) &&
      !barcode.trim()
    ) {
      alert("Please enter a barcode first.");
    }
    else {
      onQuestionClick(question);
    }
  }

  if (!topic) return null;

  return (
    <div
      style={{
        marginBottom: "20px",
      }}
    >
      <h3>{topic}</h3>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "10px",
        }}
      >
        {questions[topic]?.map((question) => (
          <button
            key={question}
            onClick={() =>
              handleQuestionClick(question)
            }
            style={{
              padding: "8px 12px",
              borderRadius: "8px",
              border: "1px solid #444",
              cursor: "pointer",
            }}
          >
            {question}
          </button>
        ))}
      </div>
    </div>
  );
}