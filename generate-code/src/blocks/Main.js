import { useState } from "react";
import { Button, Input, Space } from "antd";
import SchemaItem from "../componens/SchemaItem";

function Main() {
  const [schema, setSchema] = useState([]);
  const handlerDrop = (e) => {

    const component = e.dataTransfer.getData("component");
    if (e.target.dataset?.component === "Space") {
      const index = e.target.dataset.index;
      const list = index.split('-');
      let root = schema[list[0]];
      for(let i = 1;i < list.length;i++) {
        root = root.children[list[i]];
      }
      if (!root.children) {
        root.children = [
          {
            name: component,
            props: {},
          },
        ];
      } else {
        root.children.push({
          name: component,
          props: {},
        });
      }
    } else {
      schema.push({
        name: component,
        props: {},
      });
    }
    setSchema([...schema]);
    console.log(schema);
  };
  const handlerTragOver = (e) => {
    e.preventDefault();
  };

  const remove = (index) => {
    const list = index.toString().split('-');
    if (list.length === 1) {
        schema.splice(list[0], 1);
    } else {
        let root = schema[list[0]];
        for (let i = 1;i < list.length - 1;i++) {
            root = root.children[list[i]];
        }
        root.children.splice(list[list.length - 1], 1);
    }
    
    setSchema([...schema]);
  };

  const renderComponent = (schemaItem, index) => {
    switch (schemaItem.name) {
      case "Button":
        return (
          <SchemaItem onRemove={() => remove(index)}>
            <Button key={index} {...schemaItem.props}>
              demo
            </Button>
          </SchemaItem>
        );
      case "Input":
        return (
          <SchemaItem onRemove={() => remove(index)}>
            <Input key={index} {...schemaItem.props} />
          </SchemaItem>
        );
      case "Space":
        return (
          <SchemaItem onRemove={() => remove(index)}>
            <Space
              data-index={index}
              data-component={schemaItem.name}
              direction="horizontal"
              style={{ border: "1px solid #eee", padding: 12, width: "100%" }}
              {...schemaItem.props}
            >
              {schemaItem.children
                ? schemaItem.children.map((item, i) =>
                    renderComponent(item, `${index}-${i}`)
                  )
                : "demo"}
            </Space>
          </SchemaItem>
        );
      default:
        return <></>;
    }
  };
  return (
    <div className="main" onDrop={handlerDrop} onDragOver={handlerTragOver}>
      {schema.map((item, index) => (
        <div key={index}>{renderComponent(item, index)}</div>
      ))}
    </div>
  );
}

export default Main;
