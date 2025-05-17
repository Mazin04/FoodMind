// scrollHorizontal.js
import { useRef, useEffect } from "react";

export default function useScrollHorizontal() {
    const ref = useRef(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        let isDown = false;
        let startX;
        let scrollLeft;

        const onMouseDown = (e) => {
            isDown = true;
            el.classList.add("cursor-grabbing");
            startX = e.pageX - el.offsetLeft;
            scrollLeft = el.scrollLeft;
        };

        const onMouseLeave = () => {
            isDown = false;
            el.classList.remove("cursor-grabbing");
        };

        const onMouseUp = () => {
            isDown = false;
            el.classList.remove("cursor-grabbing");
        };

        const onMouseMove = (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - el.offsetLeft;
            const walk = (x - startX) * 1.5; // velocidad
            el.scrollLeft = scrollLeft - walk;
        };

        el.addEventListener("mousedown", onMouseDown);
        el.addEventListener("mouseleave", onMouseLeave);
        el.addEventListener("mouseup", onMouseUp);
        el.addEventListener("mousemove", onMouseMove);

        return () => {
            el.removeEventListener("mousedown", onMouseDown);
            el.removeEventListener("mouseleave", onMouseLeave);
            el.removeEventListener("mouseup", onMouseUp);
            el.removeEventListener("mousemove", onMouseMove);
        };
    }, []);

    return ref;
}
