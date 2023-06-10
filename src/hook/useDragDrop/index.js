import { useRef, useState, useEffect } from 'react';

import { moveItem, getClosestScrollParent, disabledDrag } from './utils'

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
        draggingRef.current.getAttribute('drag-drop-index'),
        10
      );
      const draggingTagName = draggingRef.current.tagName.toLowerCase();
      const targetNode = targetFromPoint.closest(
        `${draggingTagName}[drag-drop-index]`
      );
      if (targetNode) {
        const toIdx = parseInt(targetNode.getAttribute('drag-drop-index'), 10);

        if (typeof toIdx === 'number' && itemIdx !== toIdx) {
          draggingRef.current.setAttribute('drag-drop-index', toIdx);
          setDragDropData((preValues) => moveItem(preValues, itemIdx, toIdx));
        }
      }
    }
  };

  const move = (event) => {
    event.preventDefault();
    if (draggingRef.current) {
      event.preventDefault();
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
    event.preventDefault();
    if (draggingRef.current) {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('touchmove', move, { passive: true });

      targetRef.current.style.opacity = '';
      targetRef.current = null;

      draggingRef.current.removeEventListener('mouseup', drop);
      draggingRef.current.removeEventListener('touchend', drop, { passive: false });
      const draggingTagName = draggingRef.current.tagName.toLowerCase();
      document.body
        .querySelector(`${draggingTagName}[drop-pre-container="true"]`)
        .remove();
      draggingRef.current = null;
      startMousePositionRef.current = { x: 0, y: 0 };
      setScrollerSpeed(0);
    }
  };

  const drag = (event) => {
    if (event.clientX) {
      event.preventDefault();
    }
    const targetNode = event.target.closest('[drag-drop-index]');

    const draggingNode = targetNode.cloneNode(true);
    window.addEventListener('mousemove', move);
    window.addEventListener('touchmove', move, { passive: false });
    draggingNode.addEventListener('mouseup', drop);
    draggingNode.addEventListener('touchend', drop, { passive: false });
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

  useEffect(() => {
    const draggableNodes = document.querySelectorAll('[drag-drop-draggable="false"]')
    draggableNodes.forEach((draggableNode) => {
      draggableNode.addEventListener('mousedown', disabledDrag);
      draggableNode.addEventListener('touchstart', disabledDrag);
    })

    return () => {
      draggableNodes.forEach((draggableNode) => {
        draggableNode.removeEventListener('mousedown', disabledDrag);
        draggableNode.removeEventListener('touchstart', disabledDrag);
      })
    }
  }, [])


  return {
    drag,
    drop,
    dragDropData,
  };
};
