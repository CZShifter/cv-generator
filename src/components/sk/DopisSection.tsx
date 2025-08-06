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
      setError("Vyplňte aspoň základné informácie, aby bolo možné vygenerovať text.");
      return;
    }
    setIsLoading(true);
    setError("");
    setIsResult(false);
    const zadani = text;
    setText(""); // textarea se ihned smaže
    try {
      const res = await fetch("/api/sk/generate-motivation-letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ motivation: zadani }),
      });
      if (!res.ok) throw new Error("Chyba serveru");
      const data = await res.json();
      setText(data.motivation || "Žádná odpověď od AI.");
      setIsResult(true);
    } catch (err) {
      setError(" Nepodarilo sa vygenerovať list. Skúste to znova.");
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
      <h1 className={styles.heading}>Motivačný list online
      </h1>
      <p>Vytvorte si bezplatne motivačný list, ktorým zapôsobíte na svojho budúceho zamestnávateľa</p>
      <div className={styles.dopis_wrapper}>
        <div className={styles.left_wrapper}>
          <div className={styles.dopis_form}>
            <h2>Generátor motivačného listu</h2>
            <textarea
              className={styles.dopis_textarea}
              rows={23}
              placeholder="Napíšte svoje meno, o akú pozíciu sa uchádzate, prípadne v akej spoločnosti, aké máte relevantné skúsenosti a záujmy v odbore atď..."
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
                  trackGAEvent('click', 'download', 'stazeni_motivacni_dopis_sk');
                  handleExportDocx();
                }}
                disabled={!isResult}
                type="button"
                style={{
                  opacity: !isResult ? 0.5 : 1,
                  pointerEvents: isResult ? "auto" : "none"
                }}
              >
                Stiahnuť zadarmo
              </button>
              <button
                className={styles.generate_btn}
                onClick={() => {
                  trackGAEvent('click', 'generate', 'generovani_motivacniho_dopisu_sk');
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
                {isLoading ? <>Generujem{dots}</> : "Generovať"}
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
            <h2>Ako použiť generátor</h2>
            <p>Pre maximálnu kvalitu generovaného textu napíšte o akú pozíciu sa uchádzate, ideálne v akej spoločnosti a aké máte predchádzajúce skúsenosti.</p>
            <p>Odporúčam uviesť aj svoje meno a priezvisko, prípadne relevantné záľuby a zručnosti. Môžete tiež spomenúť roky praxe, svoju motiváciu a dôvod, prečo chcete túto prácu vykonávať.</p>
            <p><strong>PRÍKLAD:</strong> "Volám sa Peter Kováč, uchádzam sa o pozíciu predajcu automobilov v spoločnosti Auto ESA. Mám 10 rokov praxe ako predajca v AAA Auto. Vo voľnom čase jazdím autokros."</p>
          </div>
        </div>
      </div>
    </section>
  );
}
