import { useRef, useState, useEffect } from "react";

const moveItem = (arr, itemIdx, toIdx) => {
  if (Array.isArray(arr) === false) return arr;
  if (Number.isInteger(itemIdx) === false) return arr;
  if (Number.isInteger(toIdx) === false) return arr;

  const startIdx = 0;
  const endIdx = arr.length - 1;
  const data = [...arr];
  const moveItem = data.splice(itemIdx, 1)[0];

  if (itemIdx === 0 && itemIdx > toIdx) {
    data.splice(endIdx, 0, moveItem);
    return data;
  } else if (itemIdx === endIdx && itemIdx < toIdx) {
    data.splice(startIdx, 0, moveItem);
    return data;
  } else {
    data.splice(toIdx, 0, moveItem);
    return data;
  }
};

export const useDragDrop = ({ data }) => {
  const [dragDropData, setDragDropData] = useState(data);
  const [scrollerSpeed, setScrollerSpeed] = useState(0);

  const startMousePositionRef = useRef({ x: 0, y: 0 });
  const targetRef = useRef(null);
  const draggingRef = useRef(null);

  const getScrollParent = (node) => {
    if (node == null) {
      return null;
    }

    if (node.scrollHeight > node.clientHeight) {
      return node;
    } else {
      return getScrollParent(node.parentNode);
    }
  };

  const getScrollerSpeed = () => {
    const targetParentElement = getScrollParent(targetRef.current);
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
    draggingRef.current.style.zIndex = "-10";
    let target;
    if (event.clientX) {
      // mouse
      target = document.elementFromPoint(event.clientX, event.clientY);
    } else {
      // touch
      target = document.elementFromPoint(
        event.changedTouches[0].clientX,
        event.changedTouches[0].clientY
      );
    }
    draggingRef.current.style.zIndex = "";

    const itemIdx = +draggingRef.current.getAttribute("drag-drop-index");
    const draggingTagName = draggingRef.current.tagName.toLowerCase();
    const targetNode = target.closest(`${draggingTagName}[drag-drop-index]`);
    if (targetNode) {
      const toIdx = parseInt(targetNode.getAttribute("drag-drop-index"), 10);

      if (typeof toIdx === "number" && itemIdx !== toIdx) {
        draggingRef.current.setAttribute("drag-drop-index", toIdx);
        targetNode.style.opacity = "25%";
        targetRef.current.style.opacity = "";
        targetRef.current = targetNode;
        setDragDropData((preValues) => moveItem(preValues, itemIdx, toIdx));
      }
    }
  };

  const move = (event) => {
    if (draggingRef.current) {
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

  const drop = () => {
    if (draggingRef.current) {
      targetRef.current.style.opacity = "";
      targetRef.current = null;

      const draggingTagName = draggingRef.current.tagName.toLowerCase();
      document.body
        .querySelector(`${draggingTagName}[drop-pre-container="true"]`)
        .remove();
      draggingRef.current = null;
    }
  };

  const drag = (event) => {
    const targetNode = event.target.closest("[drag-drop-index]");

    const draggingNode = targetNode.cloneNode(true);
    draggingNode.addEventListener("mousemove", move);
    draggingNode.addEventListener("touchmove", move, { passive: false });
    draggingNode.addEventListener("mouseup", drop);
    draggingNode.addEventListener("touchend", drop, { passive: false });
    draggingNode.setAttribute("drop-pre-container", true);
    if (targetNode.tagName.toLowerCase() === "tr") {
      draggingNode.querySelectorAll("td").forEach((tdNode, index) => {
        tdNode.style.minWidth = `${targetNode.childNodes[index].offsetWidth}px`;
      });
    }
    draggingNode.style.width = `${targetNode.offsetWidth}px`;
    draggingNode.style.position = "fixed";
    draggingNode.style.touchAction = "none";
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

    targetNode.style.opacity = "25%";
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
    if (scrollerSpeed !== 0) {
      scroller = setInterval(() => {
        const targetParentElement = getScrollParent(targetRef.current);
        targetParentElement.scrollTop += scrollerSpeed;
      }, 0);
    }

    return () => clearInterval(scroller);
  }, [scrollerSpeed]);

  return {
    drag,
    drop,
    move,
    dragDropData,
  };
};
