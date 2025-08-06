import { useLayoutEffect, useRef, useState } from "react";

/**
 * Hook pro dynamické dvousloupcové stránkování podle výšky sekcí,
 * včetně margin-top a margin-bottom každé sekce, a kompenzace paddingu hlavního kontejneru.
 */
export function useDynamicTwoColumnPagination(
  leftSections: React.ReactNode[],
  rightSections: React.ReactNode[],
  pageHeight: number,
  // Změna typu ref pro kompatibilitu s useRef(null)
  resumeRef?: React.RefObject<HTMLDivElement | null>
) {
  const leftRefs = useRef<(HTMLDivElement | null)[]>([]);
  const rightRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [leftHeights, setLeftHeights] = useState<number[]>([]);
  const [rightHeights, setRightHeights] = useState<number[]>([]);
  const [ready, setReady] = useState(false);
  const [padding, setPadding] = useState(0);

  // Dynamicky měř padding top + bottom z .resume
  useLayoutEffect(() => {
    if (resumeRef?.current) {
      const style = getComputedStyle(resumeRef.current);
      const padT = parseFloat(style.paddingTop) || 0;
      const padB = parseFloat(style.paddingBottom) || 0;
      setPadding(padT + padB);
    } else {
      setPadding(0);
    }
  }, [resumeRef, leftSections, rightSections]);

  function getHeightWithMargins(el: HTMLDivElement | null): number {
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
  }, [leftSections, rightSections, pageHeight, ready]);

  useLayoutEffect(() => {
    setReady(false);
  }, [leftSections, rightSections, pageHeight]);

  function paginate(
    sections: React.ReactNode[],
    heights: number[]
  ): React.ReactNode[][] {
    const availableHeight = pageHeight - padding;
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

  const leftPages = ready ? paginate(leftSections, leftHeights) : [leftSections];
  const rightPages = ready ? paginate(rightSections, rightHeights) : [rightSections];

  return { leftPages, rightPages, leftRefs, rightRefs, ready };
}
