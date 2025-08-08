import { useEffect, useState } from "react";

export default function PoPlatbe() {
  const [msg, setMsg] = useState("Ověřujeme platbu…");

  useEffect(() => {
    const stored = localStorage.getItem("cv_payment");
    if (!stored) { setMsg("Chybí data platby. Vraťte se k objednávce."); return; }
    const { data, templateId, transId, refId, paymentToken } = JSON.parse(stored);

    let cancelled = false;
    const tick = async () => {
      const r = await fetch("/api/cs/verify-and-finalize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transId, refId, data, templateId, paymentToken }),
      });
      const j = await r.json();

      if (j.status === "PENDING") {
        if (!cancelled) setTimeout(tick, 1500);
        return;
      }
      if (j.status === "CANCELLED") { setMsg("Platba byla zrušena. Můžete ji zopakovat."); return; }

      if (j.previewUrl) {
        try { localStorage.removeItem("cv_draft"); localStorage.removeItem("cv_payment"); } catch {}
        window.location.href = j.previewUrl;
      } else {
        setMsg(j.error || "Platba ověřena, ale dokončení selhalo.");
      }
    };

    tick();
    return () => { cancelled = true; };
  }, []);

  return (
    <main style={{maxWidth:640,margin:"80px auto",textAlign:"center"}}>
      <h1>Platební brána</h1>
      <p>{msg}</p>
      {msg.includes("zrušena") && (
        <button style={{marginTop:16}} onClick={() => (window.location.href = "/cs/preview")}>
          Zkusit zaplatit znovu
        </button>
      )}
    </main>
  );
}
