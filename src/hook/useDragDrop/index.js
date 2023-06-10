import { useRef, useState, useEffect } from 'react';

import { moveItem, getClosestScrollParent } from './utils';

const TARGET_INDEX_ATTRIBUTE = 'data-drag-drop-index';
const TARGET_DRAGGABLE_ATTRIBUTE = 'data-drag-drop-draggable';

export const useDragDrop = ({ data }) => {
  const [dragDropData, setDragDropData] = useState(data);
  const [scrollerSpeed, setScrollerSpeed] = useState(0);

  const startMousePositionRef = useRef({ x: 0, y: 0 });
  const targetRef = useRef(null);
  const draggingRef = useRef(null);

  const getScrollerSpeed = () => {
    const targetParentElement = getClosestScrollParent(targetRef.current);
    if (!targetParentElement) return 0;

    const targetParentElementRect = targetParentElement.getBoundingClientRect();
    const draggingElementRect = draggingRef.current.getBoundingClientRect();
    if (targetParentElementRect.bottom <= draggingElementRect.bottom) {
      return +2;
    } else if (targetParentElementRect.top >= draggingElementRect.top) {
      return -2;
    } else {
      return 0;
    }
  };

  const swapItem = (event) => {
    draggingRef.current.style.zIndex = '-10';
    let targetFromPoint = null;
    if (event.clientX) {
      // mouse
      targetFromPoint = document.elementFromPoint(event.clientX, event.clientY);
    } else {
      // touch
      targetFromPoint = document.elementFromPoint(
        event.changedTouches[0].clientX,
        event.changedTouches[0].clientY
      );
    }
    draggingRef.current.style.zIndex = '';

    if (targetFromPoint) {
      const itemIdx = parseInt(
        draggingRef.current.getAttribute(TARGET_INDEX_ATTRIBUTE),
        10
      );
      const draggingTagName = draggingRef.current.tagName.toLowerCase();
      const targetNode = targetFromPoint.closest(
        `${draggingTagName}[${TARGET_INDEX_ATTRIBUTE}]`
      );
      if (targetNode) {
        const toIdx = parseInt(
          targetNode.getAttribute(TARGET_INDEX_ATTRIBUTE),
          10
        );

        if (typeof toIdx === 'number' && itemIdx !== toIdx) {
          draggingRef.current.setAttribute(TARGET_INDEX_ATTRIBUTE, toIdx);
          setDragDropData((preValues) => moveItem(preValues, itemIdx, toIdx));
        }
      }
    }
  };

  const move = (event) => {
    if (draggingRef.current) {
      if (event.cancelable) {
        event.preventDefault();
      }
      if (event.clientX) {
        // mouse
        draggingRef.current.style.transform = `translateX(${
          event.clientX - startMousePositionRef.current.x
        }px)`;
        draggingRef.current.style.top = `${
          event.clientY - draggingRef.current.clientHeight / 2
        }px`;
      } else {
        // touch
        draggingRef.current.style.transform = `translateX(${
          event.changedTouches[0].clientX - startMousePositionRef.current.x
        }px)`;
        draggingRef.current.style.top = `${
          event.changedTouches[0].clientY - draggingRef.current.clientHeight / 2
        }px`;
      }
      swapItem(event);
      setScrollerSpeed(getScrollerSpeed());
    }
  };

  const drop = (event) => {
    if (draggingRef.current) {
      if (event.cancelable) {
        event.preventDefault();
      }
      targetRef.current.style.opacity = '';
      targetRef.current = null;
      const draggingTagName = draggingRef.current.tagName.toLowerCase();
      document.body
        .querySelector(`${draggingTagName}[drop-pre-container="true"]`)
        .remove();
      draggingRef.current = null;
      startMousePositionRef.current = { x: 0, y: 0 };
      setScrollerSpeed(0);
      document.removeEventListener('mousemove', move);
      document.removeEventListener('touchmove', move, { passive: true });
      document.removeEventListener('mouseup', drop);
      document.removeEventListener('touchend', drop, { passive: true });
    }
  };

  const drag = (event) => {
    if (event.target.getAttribute(TARGET_DRAGGABLE_ATTRIBUTE) === 'false') {
      return;
    }

    if (event.clientX) {
      event.preventDefault();
    }
    const targetNode = event.target.closest(`[${TARGET_INDEX_ATTRIBUTE}]`);

    const draggingNode = targetNode.cloneNode(true);
    document.addEventListener('mousemove', move);
    document.addEventListener('touchmove', move, { passive: false });
    document.addEventListener('mouseup', drop);
    document.addEventListener('touchend', drop, { passive: false });
    draggingNode.setAttribute('drop-pre-container', true);
    if (targetNode.tagName.toLowerCase() === 'tr') {
      draggingNode.querySelectorAll('td').forEach((tdNode, index) => {
        tdNode.style.minWidth = `${targetNode.childNodes[index].offsetWidth}px`;
      });
    }
    draggingNode.style.width = `${targetNode.offsetWidth}px`;
    draggingNode.style.position = 'fixed';
    draggingNode.style.touchAction = 'none';
    const targetRect = targetNode.getBoundingClientRect();
    if (event.clientX) {
      // mouse
      draggingNode.style.left = `${
        event.clientX - (event.clientX - targetRect.left)
      }px`;
      draggingNode.style.top = `${
        event.clientY - targetNode.clientHeight / 2
      }px`;
    } else {
      // touch
      draggingNode.style.left = `${
        event.changedTouches[0].clientX -
        (event.changedTouches[0].clientX - targetRect.left)
      }px`;
      draggingNode.style.top = `${
        event.changedTouches[0].clientY - targetNode.clientHeight / 2
      }px`;
    }
    document.body.appendChild(draggingNode);
    draggingRef.current = draggingNode;
    if (event.clientX) {
      // mouse
      startMousePositionRef.current = {
        x: event.clientX,
        y: event.clientY,
      };
    } else {
      // touch
      startMousePositionRef.current = {
        x: event.changedTouches[0].clientX,
        y: event.changedTouches[0].clientY,
      };
    }

    targetNode.style.opacity = '25%';
    targetRef.current = targetNode;
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setDragDropData(data);
    }, 100);

    return () => clearTimeout(delayDebounceFn);
  }, [data]);

  useEffect(() => {
    let scroller;
    const targetParentElement = getClosestScrollParent(targetRef.current);
    if (scrollerSpeed !== 0 && targetParentElement) {
      scroller = setInterval(() => {
        targetParentElement.scrollTop += scrollerSpeed;
      }, 0);
    }

    return () => clearInterval(scroller);
  }, [scrollerSpeed]);

  return {
    drag,
    dragDropData,
  };
};
