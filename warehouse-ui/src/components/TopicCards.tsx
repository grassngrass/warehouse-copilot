type Props = {
onSelect: (topic: string) => void;
};

export default function TopicCards({ onSelect }: Props) {
const topics = [
{ icon: "📦", name: "Bin Information" },
{ icon: "📜", name: "Audit History" },
{ icon: "🔄", name: "Movement Analytics" },
{ icon: "📊", name: "Inventory Analytics" },
{ icon: "👤", name: "Employee Analytics" },
{ icon: "📈", name: "Purchase Analytics" },
];

return (
<div
style={{
display: "flex",
flexWrap: "wrap",
gap: "12px",
marginBottom: "20px",
justifyContent: "center",
}}
>
{topics.map((topic) => (
<button
key={topic.name}
onClick={() => onSelect(topic.name)}
style={{
padding: "12px 18px",
borderRadius: "10px",
border: "1px solid #444",
background: "#1f2937",
color: "white",
cursor: "pointer",
fontSize: "14px",
fontWeight: "500",
minWidth: "180px",
}}
>
{topic.icon} {topic.name} </button>
))} </div>
);
}
