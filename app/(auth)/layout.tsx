import { UserLocalStorageService } from '@/services/user';
import { ModeToggle } from '@/components/ui/mode-toggle';
import { NavUser } from '@/components/layout/nav-user';
import { Separator } from '@/components/ui/separator';
import { GalleryVerticalEnd } from 'lucide-react';
import { Menu } from '@/components/layout/menu';
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarHeader,
	SidebarInset,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarProvider,
	SidebarRail,
	SidebarTrigger,
} from '@/components/ui/sidebar';

const userService = new UserLocalStorageService();

export default async function AuthedLayout({ children }: Readonly<{ children: React.ReactNode }>) {
	const currentUser = userService.getCurrent();

	return (
		<div>
			<SidebarProvider>
				<Sidebar>
					<SidebarHeader>
						<SidebarMenu>
							<SidebarMenuItem>
								<SidebarMenuButton size='lg' className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'>
									<div className='flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground'>
										<GalleryVerticalEnd className='size-4' />
									</div>

									<span className='font-semibold'>Brand Panel Admin</span>
								</SidebarMenuButton>
							</SidebarMenuItem>
						</SidebarMenu>
					</SidebarHeader>
					<SidebarContent className='gap-0'>
						<SidebarGroup>
							<Menu />
						</SidebarGroup>
					</SidebarContent>
					<SidebarFooter>
						<NavUser user={currentUser!} />
					</SidebarFooter>
					<SidebarRail />
				</Sidebar>

				<SidebarInset className='h-screen overflow-hidden'>
					<header className='flex h-16 shrink-0 items-center justify-between gap-2 border-b bg-background px-4'>
						<div className='flex items-center gap-3'>
							<SidebarTrigger className='-ml-1' />
							<Separator orientation='vertical' className='mr-2 h-4' />
						</div>
						<ModeToggle />
					</header>
					{children}
				</SidebarInset>
			</SidebarProvider>
		</div>
	);
}
