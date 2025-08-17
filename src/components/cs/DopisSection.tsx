import React, { useState, useEffect } from "react";
import styles from "@/scss/DopisSection.module.scss";
import { saveAs } from "file-saver";
import { Document, Packer, Paragraph, TextRun } from "docx";
import { trackGAEvent } from "@/utils/analytics";

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
      const res = await fetch("/api/cs/generate-motivation-letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ motivation: zadani }),
      });
      if (!res.ok) throw new Error("Chyba serveru");
      const data = await res.json();
      setText(data.motivation || "Žádná odpověď od AI.");
      setIsResult(true);
    } catch {
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
      <div className={styles.dopis_wrapper}>
        <div className={styles.right_wrapper}>
          <div className={styles.dopis_navod}>
            <h2>Jak použít generátor</h2>
            <p>Abyste dosáhli nejlepšího výsledku, napište o jakou pozici se ucházíte, v jaké společnosti a jaké jsou vaše předešlé zkušenosti.</p>
            <p>Doporučujeme také napsat své jméno a příjmení, relevantní záliby, dovednosti, délku praxe, či motivaci, proč tuto práci chcete dělat.</p>
            <p>Čím více informací o sobě do pole pro generování motivačního dopisu uvedete, tím přesněji bude text odrážet Vaši osobnost, zkušenosti i cíle. Aplikace tak vytvoří dopis, který bude jedinečný a přesvědčivý. Vaše slova jsou klíčem k tomu, aby výsledek zaujal už na první pohled.</p>
            <p>&quot;Jmenuji se Jan Novák, ucházím se o pozici prodejce automobilů ve společnosti Auto X. Mám 10 let praxe jako prodejce v Auto Y. Ve volném čase jezdím autocross.&quot;</p>
          </div>
        </div>
        <div className={styles.left_wrapper}>
          <div className={styles.dopis_form}>
            <textarea
              className={styles.dopis_textarea}
              rows={23}
              placeholder="Napište vaše jméno, o jakou pozici se ucházíte, popřípadě u jaké společnosti, jaké máte relevantní zkušenosti, jaké jsou vaše zájmy v oboru…"
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
                onClick={() => {
                  trackGAEvent('click', 'download', 'stazeni_motivacni_dopis');
                  handleExportDocx();
                }}
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
                onClick={() => {
                  trackGAEvent('click', 'generate', 'generovani_motivacniho_dopisu');
                  handleGenerate();
                }}
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
      </div>
    </section>
  );
}
