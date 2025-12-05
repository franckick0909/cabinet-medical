"use client";

import { cn } from "@/lib/utils";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Link from "next/link";
import { useRef } from "react";

const MagneticLink = ({ href, children, className }: { href: string, children: React.ReactNode, className?: string }) => {
    const linkRef = useRef<HTMLAnchorElement>(null);
    const textRef = useRef<HTMLSpanElement>(null);

    useGSAP(() => {
        const link = linkRef.current;
        const text = textRef.current;
        if (!link || !text) return;

        const xTo = gsap.quickTo(link, "x", { duration: 1, ease: "elastic.out(1, 0.3)" });
        const yTo = gsap.quickTo(link, "y", { duration: 1, ease: "elastic.out(1, 0.3)" });
        
        const textXTo = gsap.quickTo(text, "x", { duration: 1, ease: "elastic.out(1, 0.3)" });
        const textYTo = gsap.quickTo(text, "y", { duration: 1, ease: "elastic.out(1, 0.3)" });

        const handleMouseMove = (e: MouseEvent) => {
            const { clientX, clientY } = e;
            const { left, top, width, height } = link.getBoundingClientRect();
            const x = clientX - (left + width / 2);
            const y = clientY - (top + height / 2);

            xTo(x * 0.3);
            yTo(y * 0.3);
            textXTo(x * 0.1);
            textYTo(y * 0.1);
        };

        const handleMouseLeave = () => {
            xTo(0);
            yTo(0);
            textXTo(0);
            textYTo(0);
        };

        link.addEventListener("mousemove", handleMouseMove);
        link.addEventListener("mouseleave", handleMouseLeave);

        return () => {
            link.removeEventListener("mousemove", handleMouseMove);
            link.removeEventListener("mouseleave", handleMouseLeave);
        };
    }, { scope: linkRef });

    return (
        <Link ref={linkRef} href={href} className={cn("relative inline-block p-2", className)}>
            <span ref={textRef} className="relative z-10 block">{children}</span>
        </Link>
    );
};

export default function HarmonieFooter() {
  return (
    <div 
        className="relative h-[800px]" 
        style={{ clipPath: "polygon(0% 0, 100% 0%, 100% 100%, 0 100%)" }}
    >
        <div className="fixed bottom-0 h-[800px] w-full bg-[#2D5F4F] text-[#F9F7F2] flex flex-col justify-between p-6 md:p-12 -z-10">
            
            <div className="container mx-auto flex flex-col h-full justify-between">
                
                {/* Top: Navigation */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pt-12">
                    <div className="md:col-span-4">
                        <h3 className="text-xs uppercase tracking-[0.2em] text-[#C8D96F] mb-8">Navigation</h3>
                        <div className="flex flex-col items-start gap-2">
                            <MagneticLink href="#hero" className="text-3xl md:text-4xl font-cormorant-garamond italic hover:text-[#C8D96F] transition-colors">Accueil</MagneticLink>
                            <MagneticLink href="#about" className="text-3xl md:text-4xl font-cormorant-garamond italic hover:text-[#C8D96F] transition-colors">Le Cabinet</MagneticLink>
                            <MagneticLink href="#services" className="text-3xl md:text-4xl font-cormorant-garamond italic hover:text-[#C8D96F] transition-colors">Expertises</MagneticLink>
                            <MagneticLink href="#team" className="text-3xl md:text-4xl font-cormorant-garamond italic hover:text-[#C8D96F] transition-colors">L&apos;Équipe</MagneticLink>
                        </div>
                    </div>

                    <div className="md:col-span-4">
                        <h3 className="text-xs uppercase tracking-[0.2em] text-[#C8D96F] mb-8">Contact</h3>
                        <div className="space-y-4">
                            <p className="text-xl font-light">contact@harmonie-sante.fr</p>
                            <p className="text-xl font-light">+33 1 23 45 67 89</p>
                            <p className="text-neutral-400 font-light mt-8">
                                12 Rue de la République<br/>
                                24300 Nontron
                            </p>
                        </div>
                    </div>

                    <div className="md:col-span-4 flex flex-col justify-between">
                         <h3 className="text-xs uppercase tracking-[0.2em] text-[#C8D96F] mb-8">Socials</h3>
                         <div className="flex gap-4">
                            <MagneticLink href="#" className="text-sm uppercase tracking-widest border border-white/20 rounded-full px-6 py-2 hover:bg-[#C8D96F] hover:text-[#1a1a1a] hover:border-[#C8D96F] transition-all">Instagram</MagneticLink>
                            <MagneticLink href="#" className="text-sm uppercase tracking-widest border border-white/20 rounded-full px-6 py-2 hover:bg-[#C8D96F] hover:text-[#1a1a1a] hover:border-[#C8D96F] transition-all">LinkedIn</MagneticLink>
                         </div>
                    </div>
                </div>

                {/* Bottom: Big Title */}
                <div className="border-t border-white/10 pt-12 mt-12">
                    <h1 className="text-[12vw] leading-[0.8] font-cormorant-garamond font-light text-center md:text-left tracking-tighter opacity-20 select-none">
                        Harmonie
                    </h1>
                    <div className="flex justify-between items-end mt-8 text-xs uppercase tracking-widest text-white/40">
                        <p>© {new Date().getFullYear()} Cabinet Harmonie</p>
                        <p>Designed for Excellence</p>
                    </div>
                </div>

            </div>
        </div>
    </div>
  );
}
