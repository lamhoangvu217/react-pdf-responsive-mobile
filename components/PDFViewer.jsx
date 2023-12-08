import { useEffect, useRef, useState } from "react";
function PDFViewer() {
  let url =
    "https://uat02.dsc.com.vn/notify/file?filepath=files/ca/20231206/0001006740/M2UzMzdkZDAtYTFhNS00MDZjLWE0NjMtNDk3NjQwMmYwOTg3/EKYCCUSTSIGN.20231206.7192.PDF";
  const canvasRef = useRef(null);
  const [pageState, setPageState] = useState(1);
  useEffect(() => {
    async function renderPage() {
      // We import this here so that it's only loaded during client-side rendering.
      const pdfJS = await import("pdfjs-dist/build/pdf");
      pdfJS.GlobalWorkerOptions.workerSrc =
        window.location.origin + "/pdf.worker.min.mjs";
      const pdf = await pdfJS.getDocument(url).promise;
      const page = await pdf.getPage(pageState);
      const viewport = page.getViewport({ scale: 1.5 });

      // Prepare canvas using PDF page dimensions.
      const canvas = canvasRef.current;
      const canvasContext = canvas.getContext("2d");
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      // Render PDF page into canvas context.
      const renderContext = { canvasContext, viewport };
      page.render(renderContext);
    }
    renderPage();
  }, [pageState]);

  return (
    <div>
      <div>
        <button onClick={() => setPageState((cur) => cur - 1)}>Previous</button>
        <div></div>
        <button onClick={() => setPageState((cur) => cur + 1)}>Next</button>
      </div>
      <canvas ref={canvasRef} style={{ width: "100%", height: "auto" }} />
    </div>
  );
}

export default PDFViewer;
