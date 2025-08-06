import { useLayoutEffect, useRef, useState } from "react";


export function useDynamicTwoColumnPagination(
  leftSections: React.ReactNode[],
  rightSections: React.ReactNode[],
  pageHeight: number,
  resumeRef?: React.RefObject<HTMLDivElement | null>,
  forceRemountKey: number = 0   // ← nový argument!
) {
  const leftRefs = useRef<(HTMLDivElement | null)[]>([]);
  const rightRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [leftHeights, setLeftHeights] = useState<number[]>([]);
  const [rightHeights, setRightHeights] = useState<number[]>([]);
  const [ready, setReady] = useState(false);
  const [padding, setPadding] = useState(0);
  const [retry, setRetry] = useState(0);

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
  }, [resumeRef, leftSections, rightSections, forceRemountKey]);

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
        if (
          leftRefs.current.length === 0 ||
          rightRefs.current.length === 0 ||
          leftRefs.current.every(el => el === null) ||
          rightRefs.current.every(el => el === null)
        ) {
          if (retry < 7) {
            setRetry(r => r + 1);
            return;
          }
        }
        setLeftHeights(leftRefs.current.map(getHeightWithMargins));
        setRightHeights(rightRefs.current.map(getHeightWithMargins));
        setReady(true);
      });
    }
    // forceRemountKey v závislostech!
  }, [leftSections, rightSections, pageHeight, ready, retry, forceRemountKey]);

  useLayoutEffect(() => {
    setReady(false);
    setRetry(0);
  }, [leftSections, rightSections, pageHeight, forceRemountKey]);

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
