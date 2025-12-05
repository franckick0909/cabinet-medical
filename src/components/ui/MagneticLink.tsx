"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Link from "next/link";
import { useRef } from "react";

interface MagneticLinkProps {
    href: string;
    children: React.ReactNode;
    className?: string;
}

export default function MagneticLink({ href, children, className }: MagneticLinkProps) {
    const linkRef = useRef<HTMLAnchorElement>(null);
    const textRef = useRef<HTMLSpanElement>(null);
    const dotRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        const link = linkRef.current;
        const text = textRef.current;
        const dot = dotRef.current;
        if (!link || !text || !dot) return;

        const xTo = gsap.quickTo(link, "x", { duration: 1, ease: "elastic.out(1, 0.3)" });
        const yTo = gsap.quickTo(link, "y", { duration: 1, ease: "elastic.out(1, 0.3)" });
        
        const textXTo = gsap.quickTo(text, "x", { duration: 1, ease: "elastic.out(1, 0.3)" });
        const textYTo = gsap.quickTo(text, "y", { duration: 1, ease: "elastic.out(1, 0.3)" });

        const dotXTo = gsap.quickTo(dot, "x", { duration: 0.5, ease: "power2.out" });
        const dotYTo = gsap.quickTo(dot, "y", { duration: 0.5, ease: "power2.out" });

        const handleMouseMove = (e: MouseEvent) => {
            const { clientX, clientY } = e;
            const { left, top, width, height } = link.getBoundingClientRect();
            const x = clientX - (left + width / 2);
            const y = clientY - (top + height / 2);

            xTo(x * 0.3);
            yTo(y * 0.3);
            textXTo(x * 0.1);
            textYTo(y * 0.1);
            
            // Dot follows cursor more closely
            dotXTo(x);
            dotYTo(y);
        };

        const handleMouseEnter = () => {
            gsap.to(dot, { scale: 1, opacity: 1, duration: 0.3 });
        };

        const handleMouseLeave = () => {
            xTo(0);
            yTo(0);
            textXTo(0);
            textYTo(0);
            dotXTo(0);
            dotYTo(0);
            gsap.to(dot, { scale: 0, opacity: 0, duration: 0.3 });
        };

        link.addEventListener("mousemove", handleMouseMove);
        link.addEventListener("mouseenter", handleMouseEnter);
        link.addEventListener("mouseleave", handleMouseLeave);

        return () => {
            link.removeEventListener("mousemove", handleMouseMove);
            link.removeEventListener("mouseenter", handleMouseEnter);
            link.removeEventListener("mouseleave", handleMouseLeave);
        };
    }, { scope: linkRef });

    return (
        <Link ref={linkRef} href={href} className={`relative inline-flex items-center justify-center px-4 py-2 ${className}`}>
            <span ref={textRef} className="relative z-10 block">{children}</span>
            <div 
                ref={dotRef} 
                className="absolute w-1.5 h-1.5 bg-teal-500 rounded-full pointer-events-none opacity-0 scale-0 z-20"
                style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
            />
        </Link>
    );
}
