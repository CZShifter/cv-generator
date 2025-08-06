import { useLayoutEffect, useState } from "react";

/**
 * Hook pro dvousloupcové stránkování podle přesné výšky sekcí.
 * Měří podle refů, které předáváš z off-screen wrapperu.
 *
 * @param leftRefs - pole refů na sekce vlevo
 * @param rightRefs - pole refů na sekce vpravo
 * @param leftSections - pole sekcí vlevo
 * @param rightSections - pole sekcí vpravo
 * @param pageHeight - maximální výška stránky (v px)
 * @param resumePadding - celkový padding .resume (px, odečte se jednou)
 * @param leftPadding - padding .left (stejný pro všechny strany, odečte se 2x)
 * @param rightPadding - padding .right (stejný pro všechny strany, odečte se 2x)
 * @param forceRemountKey - trigger na přeměření
 */
export function useDynamicTwoColumnPagination(
  leftRefs: React.RefObject<HTMLDivElement>[],
  rightRefs: React.RefObject<HTMLDivElement>[],
  leftSections: React.ReactNode[],
  rightSections: React.ReactNode[],
  pageHeight: number,
  resumePadding: number,
  leftPadding: number,
  rightPadding: number,
  forceRemountKey: number = 0
) {
  const [leftPages, setLeftPages] = useState<React.ReactNode[][]>([leftSections]);
  const [rightPages, setRightPages] = useState<React.ReactNode[][]>([rightSections]);
  const [ready, setReady] = useState(false);

  // Vrací výšku sekce včetně marginů
  function getHeightWithMargins(ref: React.RefObject<HTMLDivElement>): number {
    const el = ref.current;
    if (!el) return 0;
    const st = getComputedStyle(el);
    const mt = parseFloat(st.marginTop) || 0;
    const mb = parseFloat(st.marginBottom) || 0;
    return el.offsetHeight + mt + mb;
  }

  // Paginuje podle výšek sekcí, sekce nikdy nedělí
  function paginate(
    sections: React.ReactNode[],
    refs: React.RefObject<HTMLDivElement>[],
    availableHeight: number
  ) {
    const pages: React.ReactNode[][] = [];
    let currentPage: React.ReactNode[] = [];
    let used = 0;
    for (let i = 0; i < sections.length; i++) {
      const h = getHeightWithMargins(refs[i]);
      if (currentPage.length > 0 && used + h > availableHeight) {
        pages.push(currentPage);
        currentPage = [];
        used = 0;
      }
      currentPage.push(sections[i]);
      used += h;
    }
    if (currentPage.length) pages.push(currentPage);
    return pages;
  }

  useLayoutEffect(() => {
    // Vždy odečte resumePadding (pokud je 0, nic se neděje)
    // a 2x left/right padding (nahoře i dole)
    const availLeft = pageHeight - resumePadding - 1 * leftPadding;
    const availRight = pageHeight - resumePadding - 1 * rightPadding;
    setLeftPages(paginate(leftSections, leftRefs, availLeft));
    setRightPages(paginate(rightSections, rightRefs, availRight));
    setReady(true);
    // eslint-disable-next-line
  }, [
    leftSections, rightSections, pageHeight, resumePadding,
    leftPadding, rightPadding, forceRemountKey
  ]);

  return { leftPages, rightPages, ready };
}
