import { jsPDF } from "jspdf";

export function exportAsPdf(results, code) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 20;

  const addText = (text, size = 10, bold = false, color = [50, 50, 50]) => {
    doc.setFontSize(size);
    doc.setTextColor(...color);
    if (bold) doc.setFont(undefined, "bold");
    else doc.setFont(undefined, "normal");

    const lines = doc.splitTextToSize(text, pageWidth - 40);
    lines.forEach((line) => {
      if (y > 270) { doc.addPage(); y = 20; }
      doc.text(line, 20, y);
      y += size * 0.5 + 2;
    });
    y += 4;
  };

  // Header
  doc.setFillColor(13, 13, 13);
  doc.rect(0, 0, pageWidth, 50, "F");
  doc.setFontSize(22);
  doc.setTextColor(212, 175, 55);
  doc.setFont(undefined, "bold");
  doc.text("CodeReview AI Report", 20, 30);
  doc.setFontSize(10);
  doc.setTextColor(160, 160, 160);
  doc.text(new Date().toLocaleDateString("en-US", { dateStyle: "long" }), 20, 42);
  y = 65;

  // Score
  addText(`Code Quality Score: ${results.score}/100`, 16, true, [212, 175, 55]);
  addText(`Complexity: ${results.complexity}`, 12, false);
  y += 6;

  // Bugs
  if (results.bugs?.length > 0) {
    addText("🐞 Bugs", 14, true, [255, 77, 77]);
    results.bugs.forEach((bug, i) => {
      addText(`${i + 1}. ${bug}`, 10);
    });
    y += 4;
  }

  // Suggestions
  if (results.suggestions?.length > 0) {
    addText("💡 Suggestions", 14, true, [255, 184, 0]);
    results.suggestions.forEach((s, i) => {
      addText(`${i + 1}. ${s}`, 10);
    });
    y += 4;
  }

  // Security
  if (results.security?.length > 0) {
    addText("🔒 Security Issues", 14, true, [168, 85, 247]);
    results.security.forEach((s, i) => {
      addText(`${i + 1}. ${s}`, 10);
    });
    y += 4;
  }

  // Insights
  if (results.insights) {
    addText("🧠 AI Insights", 14, true, [77, 154, 255]);
    addText(results.insights, 10);
    y += 4;
  }

  // Documentation
  if (results.documentation) {
    addText("📘 Documentation", 14, true, [0, 214, 143]);
    addText(results.documentation, 10);
    y += 4;
  }

  // Refactored Code
  if (results.refactoredCode) {
    addText("🔁 Refactored Code", 14, true, [212, 175, 55]);
    addText(results.refactoredCode, 9);
  }

  doc.save("code-review-report.pdf");
}

export function exportAsMarkdown(results, code) {
  let md = `# CodeReview AI Report\n\n`;
  md += `**Date:** ${new Date().toLocaleDateString("en-US", { dateStyle: "long" })}\n\n`;
  md += `---\n\n`;
  md += `## 📊 Code Quality Score: ${results.score}/100\n\n`;
  md += `**Complexity:** ${results.complexity}\n\n`;

  if (results.bugs?.length > 0) {
    md += `## 🐞 Bugs (${results.bugs.length})\n\n`;
    results.bugs.forEach((b, i) => { md += `${i + 1}. ${b}\n`; });
    md += "\n";
  }

  if (results.suggestions?.length > 0) {
    md += `## 💡 Suggestions (${results.suggestions.length})\n\n`;
    results.suggestions.forEach((s, i) => { md += `${i + 1}. ${s}\n`; });
    md += "\n";
  }

  if (results.security?.length > 0) {
    md += `## 🔒 Security Issues (${results.security.length})\n\n`;
    results.security.forEach((s, i) => { md += `${i + 1}. ${s}\n`; });
    md += "\n";
  }

  if (results.insights) {
    md += `## 🧠 AI Insights\n\n${results.insights}\n\n`;
  }

  if (results.documentation) {
    md += `## 📘 Documentation\n\n${results.documentation}\n\n`;
  }

  if (results.refactoredCode) {
    md += `## 🔁 Refactored Code\n\n\`\`\`\n${results.refactoredCode}\n\`\`\`\n`;
  }

  // Download
  const blob = new Blob([md], { type: "text/markdown" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "code-review-report.md";
  a.click();
  URL.revokeObjectURL(url);
}
