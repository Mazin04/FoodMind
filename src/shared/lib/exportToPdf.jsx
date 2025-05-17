import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import ReactDOM from "react-dom/client";
import RecipePDFTemplate from "@/features/recipes/components/RecipePDFTemplate";

export const exportToPdf = async (recipe) => {
  // Crea un contenedor oculto
  const container = document.createElement("div");
  container.style.position = "fixed";
  container.style.top = "-10000px";
  container.style.left = "-10000px";
  container.style.width = "595px"; // A4 width in px @ 72dpi
  container.style.background = "#fff";
  document.body.appendChild(container);

  const root = ReactDOM.createRoot(container);
  root.render(<RecipePDFTemplate recipe={recipe} />);

  // Espera a que se renderice
  await new Promise((res) => setTimeout(res, 500));

  const canvas = await html2canvas(container, { scale: 2 });
  const imgData = canvas.toDataURL("image/png");

  const pdf = new jsPDF("p", "pt", "a4");
  const imgProps = pdf.getImageProperties(imgData);
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

  pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
  pdf.save(`${recipe.name}.pdf`);

  // Limpia
  root.unmount();
  document.body.removeChild(container);
};
