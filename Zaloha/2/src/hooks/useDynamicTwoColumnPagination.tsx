// useDynamicTwoColumnPagination.tsx
import { useLayoutEffect, useRef, useState } from "react";

/**
 * Hook pro dynamické dvousloupcové stránkování podle výšky sekcí,
 * ODEČÍTÁ padding z .resume (celkově) a také z .left/.right podle potřeby.
 *
 * @param leftSections         Pole ReactNode pro levý sloupec
 * @param rightSections        Pole ReactNode pro pravý sloupec
 * @param pageHeight           Maximální výška stránky (bez škálování)
 * @param resumeRef            Ref na hlavní .resume container
 * @param leftColumnSafetyOffset  Bezpečnostní offset pro levý sloupec (v pixelech, výchozí 0)
 * @param rightColumnSafetyOffset Bezpečnostní offset pro pravý sloupec (v pixelech, výchozí 0)
 * @param forceRemountKey      Volitelné, pro vynucení měření (změna šablony, dat apod.)
 */
export function useDynamicTwoColumnPagination(
  leftSections: React.ReactNode[],
  rightSections: React.ReactNode[],
  pageHeight: number,
  resumeRef?: React.RefObject<HTMLDivElement | null>, // Typ RefObject s možností null
  leftColumnSafetyOffset: number = 0, // Nový parametr pro levý offset
  rightColumnSafetyOffset: number = 0, // Nový parametr pro pravý offset
  forceRemountKey: number = 0
) {
  const leftRefs = useRef<React.RefObject<HTMLDivElement>[]>([]);
  const rightRefs = useRef<React.RefObject<HTMLDivElement>[]>([]);
  const [leftHeights, setLeftHeights] = useState<number[]>([]);
  const [rightHeights, setRightHeights] = useState<number[]>([]);
  const [ready, setReady] = useState(false);

  // Dynamicky měř padding (resume, left, right)
  const [resumePadding, setResumePadding] = useState(0);
  const [leftPadding, setLeftPadding] = useState(0);
  const [rightPadding, setRightPadding] = useState(0);

  useLayoutEffect(() => {
    // Pad main resume
    if (resumeRef?.current) {
      const st = getComputedStyle(resumeRef.current);
      setResumePadding(
        (parseFloat(st.paddingTop) || 0) +
        (parseFloat(st.paddingBottom) || 0)
      );
      // Pad .left
      const left = resumeRef.current.querySelector(".left") as HTMLDivElement | null;
      if (left) {
        const stL = getComputedStyle(left);
        setLeftPadding(
          (parseFloat(stL.paddingTop) || 0) +
          (parseFloat(stL.paddingBottom) || 0)
        );
      } else setLeftPadding(0);
      // Pad .right
      const right = resumeRef.current.querySelector(".right") as HTMLDivElement | null;
      if (right) {
        const stR = getComputedStyle(right);
        setRightPadding(
          (parseFloat(stR.paddingTop) || 0) +
          (parseFloat(stR.paddingBottom) || 0)
        );
      } else setRightPadding(0);
    } else {
      setResumePadding(0); setLeftPadding(0); setRightPadding(0);
    }
  }, [resumeRef?.current, forceRemountKey]);

  function getHeightWithMargins(ref: React.RefObject<HTMLDivElement>): number {
  const el = ref.current;
  if (!el) return 0;
  const st = getComputedStyle(el);
  const mt = parseFloat(st.marginTop) || 0;
  const mb = parseFloat(st.marginBottom) || 0;
  return el.offsetHeight + mt + mb;
}

useLayoutEffect(() => {
  if (!ready) {
    requestAnimationFrame(() => {
      setLeftHeights(leftRefs.current.map(getHeightWithMargins));
      setRightHeights(rightRefs.current.map(getHeightWithMargins));
      setReady(true);
    });
  }
}, [leftSections, rightSections, pageHeight, ready, forceRemountKey]);

  useLayoutEffect(() => {
    setReady(false);
  }, [leftSections, rightSections, pageHeight, forceRemountKey]);

  function paginate(
    sections: React.ReactNode[],
    heights: number[],
    totalPadding: number,
    columnSafetyOffset: number // Přijímá specifický offset pro sloupec
  ): React.ReactNode[][] {
    // Aplikujeme specifický safety offset pro tento sloupec
    const availableHeight = pageHeight - totalPadding - columnSafetyOffset;

    const pages: React.ReactNode[][] = [];
    let currentPage: React.ReactNode[] = [];
    let used = 0;

    for (let i = 0; i < sections.length; i++) {
      const h = heights[i] || 0;
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

  // Volání paginate pro každý sloupec s příslušným offsetem
  const leftPages = ready
    ? paginate(leftSections, leftHeights, resumePadding + leftPadding, leftColumnSafetyOffset)
    : [leftSections];
  const rightPages = ready
    ? paginate(rightSections, rightHeights, resumePadding + rightPadding, rightColumnSafetyOffset)
    : [rightSections];

  return { leftPages, rightPages, leftRefs, rightRefs, ready };
}