'use client';

import { CheckIcon, Plus } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { UserLocalStorageService } from '@/services/user';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { User } from '@/types/user';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { TaskLocalStorageService } from '@/services/task';
import { refreshTasksAtom } from '@/stores/tasks-store';
import { useSetAtom } from 'jotai';

const userService = new UserLocalStorageService();

export const AssignUserToTask = ({ taskId }: { taskId: string }) => {
	const { toast } = useToast();

	const refreshTasks = useSetAtom(refreshTasksAtom);

	const [open, setOpen] = useState(false);
	const [selectedUser, setSelectedUser] = useState<User | null>(null);

	const users = userService.getAll();

	const handleSelectUser = (userId: string) => {
		const user = users.find((u) => u.id === userId);

		if (!user) return;

		setSelectedUser(user);
		setOpen(false);

		const taskService = new TaskLocalStorageService();

		const task = taskService.assignUserToTask(taskId, user.id);

		if (!task) {
			toast({
				title: 'Error',
				description: 'Failed to assign user to the task.',
				variant: 'destructive',
			});

			return;
		}

		toast({
			title: 'User assigned',
			description: (
				<p>
					Sucessfully assigned{' '}
					<span className='font-medium'>
						{user.firstName} {user.lastName}
					</span>{' '}
					to the task
				</p>
			),
		});

		refreshTasks();
	};

	return (
		<Popover modal open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<button className='inline-flex items-center size-9 rounded-full bg-zinc-800 justify-center'>
					{selectedUser ? (
						<Avatar className='size-9'>
							<AvatarImage src={selectedUser.image ?? undefined} />
							<AvatarFallback>CN</AvatarFallback>
						</Avatar>
					) : (
						<Plus size={16} />
					)}
				</button>
			</PopoverTrigger>
			<PopoverContent className='w-[200px] p-0'>
				<Command>
					<CommandInput placeholder='Search user...' />
					<CommandList>
						<CommandEmpty>No user found.</CommandEmpty>
						<CommandGroup>
							{users.map((user) => (
								<CommandItem key={user.id} value={user.id} onSelect={handleSelectUser}>
									<CheckIcon className={cn('mr-2 h-4 w-4', selectedUser?.id === user.id ? 'opacity-100' : 'opacity-0')} />
									<Avatar className='size-5'>
										<AvatarImage src={user.image ?? undefined} />
										<AvatarFallback>CN</AvatarFallback>
									</Avatar>
									{user.firstName} {user.lastName}
								</CommandItem>
							))}
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
};
