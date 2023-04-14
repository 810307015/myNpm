const SchemaItem = (props) => {
  const { onRemove, children } = props;
  return (
    <div className="schema-item">
      {children}
      <div className="remove" onClick={onRemove}>X</div>
    </div>
  );
};

export default SchemaItem;
