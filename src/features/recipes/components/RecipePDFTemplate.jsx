// TODO: Add translation support
const RecipePDFTemplate = ({ recipe }) => {
  const { name, description, ingredients = [], steps = [] } = recipe;

  return (
    <div
      id="pdf-content"
      style={{
        width: "595px",
        minHeight: "842px",
        padding: "40px",
        backgroundColor: "#fdfdfd",
        color: "#333",
        fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
        boxSizing: "border-box",
      }}
    >
        
      {/* Título */}
      <h1 style={{ fontSize: "26px", fontWeight: "bold", marginBottom: "12px" }}>
        {name.charAt(0).toUpperCase() + name.slice(1)}
      </h1>

      {/* Descripción */}
      <p style={{ fontSize: "14px", lineHeight: "1.6", marginBottom: "24px" }}>
        {description}
      </p>

      {/* Ingredientes */}
      <h2 style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "8px" }}>Ingredientes</h2>
      <ul style={{ paddingLeft: "16px", marginBottom: "24px" }}>
        {ingredients.map((ing, i) => (
          <li key={i} style={{ fontSize: "13px", marginBottom: "4px" }}>
            <strong>{ing.name.charAt(0).toUpperCase() + ing.name.slice(1)}</strong>:{" "}
            {ing.unit === "taste"
              ? "A gusto"
              : `${parseFloat(ing.quantity) % 1 === 0 ? parseInt(ing.quantity) : parseFloat(ing.quantity).toFixed(2)} ${ing.unit}`}
          </li>
        ))}
      </ul>

      {/* Pasos */}
      <h2 style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "8px" }}>Pasos</h2>
      <ol style={{ paddingLeft: "16px" }}>
        {steps.map((step, i) => (
          <li key={i} style={{ fontSize: "13px", marginBottom: "8px", lineHeight: "1.5" }}>
            <strong>Paso {i + 1}:</strong> {step}
          </li>
        ))}
      </ol>
    </div>
  );
};

export default RecipePDFTemplate;
