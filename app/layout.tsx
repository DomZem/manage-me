import { DeleteProjectModal } from '@/components/features/project/delete-project-modal';
import { ThemeProvider } from '@/providers/theme-provider';
import { Geist, Geist_Mono } from 'next/font/google';
import { Toaster } from '@/components/ui/toaster';
import type { Metadata } from 'next';
import './globals.css';

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin'],
});

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin'],
});

export const metadata: Metadata = {
	title: 'Create Next App',
	description: 'Generated by create next app',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='en' suppressHydrationWarning>
			<body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
				<ThemeProvider attribute='class' defaultTheme='system' enableSystem disableTransitionOnChange>
					{children}
					<Toaster />
					<DeleteProjectModal />
				</ThemeProvider>
			</body>
		</html>
	);
}
