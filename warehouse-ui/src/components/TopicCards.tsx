type Props = {
  onSelect: (topic: string) => void;
  selectedTopic: string;
};

const topics = [
  { icon: "📦", name: "Bin Information" },
  { icon: "📜", name: "Audit History" },
  { icon: "🔄", name: "Movement Analytics" },
  { icon: "📊", name: "Inventory Analytics" },
  { icon: "👤", name: "Employee Analytics" },
  { icon: "📈", name: "Purchase Analytics" },
];

export default function TopicCards({ onSelect, selectedTopic }: Props) {
  return (
    <div style={{
      display: "flex",
      flexWrap: "wrap",
      gap: "8px",
    }}>
      {topics.map((topic) => {
        const isActive = selectedTopic === topic.name;
        return (
          <button
            key={topic.name}
            onClick={() => onSelect(topic.name)}
            style={{
              padding: "8px 14px",
              borderRadius: "20px",
              border: isActive ? "2px solid #7c3aed" : "1.5px solid #e5e7eb",
              background: isActive ? "#f3f0ff" : "white",
              color: isActive ? "#7c3aed" : "#374151",
              cursor: "pointer",
              fontSize: "13px",
              fontWeight: isActive ? "600" : "500",
              transition: "all 0.15s",
              whiteSpace: "nowrap",
            }}
          >
            {topic.icon} {topic.name}
          </button>
        );
      })}
    </div>
  );
}
