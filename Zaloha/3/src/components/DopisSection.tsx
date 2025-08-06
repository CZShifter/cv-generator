import React, { useState, useEffect } from "react";
import styles from "@/scss/DopisSection.module.scss";
import { saveAs } from "file-saver";
import { Document, Packer, Paragraph, TextRun } from "docx";

export default function DopisSection() {
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [dotCount, setDotCount] = useState(0);
  const [isResult, setIsResult] = useState(false); // stav, zda v textarea je AI výsledek

  // Animace teček pro tlačítko
  useEffect(() => {
    if (!isLoading) {
      setDotCount(0);
      return;
    }
    const interval = setInterval(() => {
      setDotCount((d) => (d + 1) % 4);
    }, 350);
    return () => clearInterval(interval);
  }, [isLoading]);
  const dots = ".".repeat(dotCount);

  // Odeslání požadavku na API
  const handleGenerate = async () => {
    // 1. Validace prázdné textarea
    if (!text.trim()) {
      setError("Vyplňte alespoň základní informace, aby bylo možné generovat text");
      return;
    }
    setIsLoading(true);
    setError("");
    setIsResult(false);
    const zadani = text;
    setText(""); // textarea se ihned smaže
    try {
      const res = await fetch("/api/generate-motivation-letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ motivation: zadani }),
      });
      if (!res.ok) throw new Error("Chyba serveru");
      const data = await res.json();
      setText(data.motivation || "Žádná odpověď od AI.");
      setIsResult(true);
    } catch (err) {
      setError("Nepodařilo se vygenerovat dopis. Zkuste to znovu.");
      setText(zadani); // vrátí původní zadání pokud je error
      setIsResult(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Export do DOCX
  const handleExportDocx = async () => {
    if (!text || !isResult) return;
    const paragraphs = text
      .split(/\n{2,}/g)
      .map(par => par.trim())
      .filter(par => par.length > 0);

    const doc = new Document({
      sections: [
        {
          properties: {},
          children: paragraphs.map(par =>
            new Paragraph({
              children: [new TextRun(par)],
              spacing: { after: 200 }
            })
          ),
        },
      ],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, "Motivacni_dopis.docx");
  };

  return (
    <section className={styles.dopis}>
      <h1 className={styles.heading}>Motivační dopis online
      </h1>
      <p>Vytvořte zdarma motivační dopis, kterým uděláte dojem na Vašeho budoucího zaměstnavatele</p>
      <div className={styles.dopis_wrapper}>
        <div className={styles.left_wrapper}>
          <div className={styles.dopis_form}>
            <h2>Generátor motivačního dopisu</h2>
            <textarea
              className={styles.dopis_textarea}
              rows={23}
              placeholder="Napište Vaše jméno, o jakou pozici se ucházíte, popřípadě u jaké společnosti, jaké maté relevantní zkušenosti, jaké jsou Vaše zájmy v oboru atd..."
              value={text}
              onChange={e => {
                setText(e.target.value);
                setError("");
                setIsResult(false); // jakmile někdo začne psát, ztratí se stav "je to AI výsledek"
              }}
              disabled={isLoading}
            />
            <div className={styles.dopis_actions}>
              <button
                className={`${styles.generate_btn} ${!isResult ? styles.disabled : ""}`}
                onClick={handleExportDocx}
                disabled={!isResult}
                type="button"
                style={{
                  opacity: !isResult ? 0.5 : 1,
                  pointerEvents: isResult ? "auto" : "none"
                }}
              >
                Stáhnout zdarma
              </button>
              <button
                className={styles.generate_btn}
                onClick={handleGenerate}
                style={{
                  marginLeft: 0,
                  minWidth: 123,
                  opacity: isLoading ? 0.7 : 1,
                  pointerEvents: "auto",
                }}
                type="button"
                // Tlačítko je aktivní, ale v handleGenerate je validace
              >
                {isLoading ? <>Generuji{dots}</> : "Generovat"}
              </button>
            </div>
            {error && (
              <div className={styles.errorPopup}>
                {error}
                <button
                  type="button"
                  className={styles.errorClose}
                  onClick={() => setError("")}
                  aria-label="Zavřít chybové okno"
                >×</button>
              </div>
            )}
          </div>
        </div>
        <div className={styles.right_wrapper}>
          <div className={styles.dopis_navod}>
            <h2>Jak použít generátor</h2>
            <p>Pro maximální kvalitu generovaného textu napište o jakou pozici se ucházíte, ideálně v jaké společnosti a jaké jsou Vaše předešlé zkušenosti.</p>
            <p>Také doporučuji napsat své jméno a příjmení, popřípadě Vaše relevantní záliby a dovednosti. Dále můžete zmínit roky své praxe, Vaší motivaci, proč tuto práci chcete dělat atd...</p>
            <p><strong>PŘÍKLAD:</strong> "Jmenuji se Jan Novák, ucházím se o pozici prodejce automobilů ve společnosti Auto ESA. Mám 10 let praxe jako prodejce v AAA auto. Ve volném čase jezdím autocross."</p>
          </div>
        </div>
      </div>
    </section>
  );
}
