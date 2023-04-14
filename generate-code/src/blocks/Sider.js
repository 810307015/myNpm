import { Button, Input, Space } from "antd";
function Sider() {
  const handlerTragStart = (e) => {
    e.dataTransfer.effectAllowed = "copy";
    e.dataTransfer.setData("component", e.target.dataset.component);
  };

  return (
    <div className="sider">
      <Button data-component="Button" draggable onDragStart={handlerTragStart}>
        demo
      </Button>
      <Input
        disabled
        data-component="Input"
        draggable
        onDragStart={handlerTragStart}
      />
      <Space
        style={{ border: "1px solid #eee", padding: 12 }}
        data-component="Space"
        draggable
        onDragStart={handlerTragStart}
      >
        horizontal
      </Space>
    </div>
  );
}

export default Sider;
