"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, Clock, FileText, LogOut } from 'lucide-react';

export function Sidebar() {
    return (
        <div className="w-64 bg-[#0F172A] text-white h-screen flex flex-col fixed left-0 top-0 z-50">
            <div className="p-6 border-b border-gray-800">
                <Link href="/" className="block relative w-32 h-10 mb-2">
                    <img src="/personeel/logo_white.png" alt="CarOptions Logo" className="h-8 object-contain object-left" />
                </Link>
                <p className="text-xs text-indigo-300 font-medium tracking-wide">Personeelsdashboard</p>
            </div>

            <nav className="flex-1 py-6 px-3 space-y-6">
                <div>
                    <div className="px-3 mb-2 pb-2 border-b border-gray-800">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Overzicht</p>
                    </div>
                    <div className="flex flex-col gap-1">
                        <NavLink href="/" icon={<LayoutDashboard size={20} />} label="Dashboard" exact />
                    </div>
                </div>

                <div>
                    <div className="px-3 mb-2 pb-2 border-b border-gray-800">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Beheer</p>
                    </div>
                    <div className="flex flex-col gap-1">
                        <NavLink href="/medewerkers" icon={<Users size={20} />} label="Personeel" />
                        <NavLink href="/uren" icon={<Clock size={20} />} label="Gemaakte uren" />
                        <NavLink href="/loonstroken" icon={<FileText size={20} />} label="Loonstroken" />
                    </div>
                </div>
            </nav>

            <div className="p-4 border-t border-gray-800 space-y-4">
                <a
                    href="https://dashboard.caroptions.nl"
                    className="flex items-center space-x-3 text-gray-400 hover:text-white w-full px-4 py-3 rounded-lg hover:bg-white/5 transition-colors text-left"
                >
                    <LogOut size={20} />
                    <span>Terug naar hoofdmenu</span>
                </a>
            </div>
        </div>
    );
}

function NavLink({ href, icon, label, exact = false }: { href: string; icon: React.ReactNode; label: string; exact?: boolean }) {
    const pathname = usePathname();
    const isActive = exact ? pathname === href : (pathname === href || pathname?.startsWith(href + '/'));

    return (
        <Link
            href={href}
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/50'
                : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
        >
            {icon}
            <span>{label}</span>
        </Link>
    );
}
