import type { Metadata } from 'next';
import './style.css';
export const metadata: Metadata = { title: 'پیدا | خرید و فروش آسان', description: 'بازار آنلاین آگهی پیدا' };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="fa" dir="rtl"><body>{children}</body></html>; }
