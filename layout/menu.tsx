'use client';

import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { usePathname } from 'next/navigation';
import { Home } from 'lucide-react';
import Link from 'next/link';

const items: {
	title: string;
	url: string;
	icon: React.ComponentType;
	isActive: (pathname: string) => boolean;
}[] = [
	{
		title: 'Projects',
		url: '/projects',
		icon: Home,
		isActive: (pathname: string) => pathname === '/projects',
	},
];

export const Menu = () => {
	const pathname = usePathname();

	return (
		<SidebarMenu>
			{items.map((item) => (
				<SidebarMenuItem key={item.title}>
					<SidebarMenuButton isActive={item.isActive(pathname)} asChild>
						<Link href={item.url}>
							<item.icon />
							<span>{item.title}</span>
						</Link>
					</SidebarMenuButton>
				</SidebarMenuItem>
			))}
		</SidebarMenu>
	);
};
