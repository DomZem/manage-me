import { test, expect, Page } from '@playwright/test';
import { TestDatabaseUtils } from './utils/database';

async function createProject(page: Page, name: string, description: string) {
	await page.goto('/projects');
	await page.getByRole('button', { name: 'Create new' }).click();

	await expect(page.getByRole('dialog')).toBeVisible();
	await expect(page.getByText('Create new project')).toBeVisible();

	// Fill the form fields
	await page.getByPlaceholder('Enter project name').fill(name);
	await page.getByPlaceholder('Describe project in few words').fill(description);

	// Submit the form
	await page.getByRole('button', { name: 'Submit' }).click();

	await expect(page.getByRole('dialog')).not.toBeVisible();

	// Wait for the project to appear in the list
	await expect(
		page.getByRole('heading', {
			name,
		})
	).toBeVisible();

	// Navigate to the project details page
	await page
		.getByRole('link', {
			name,
		})
		.click();

	await expect(page.getByRole('heading', { name: `Project - ${name}` })).toBeVisible();
}

async function createStory(page: Page, name: string, description: string, priority = 'low', status = 'todo') {
	await page.getByRole('button', { name: 'Create new' }).click();

	await expect(page.getByRole('dialog')).toBeVisible();
	await expect(page.getByText('Create new story')).toBeVisible();

	// Fill the form fields
	await page.getByLabel('Name').fill(name);
	await page.getByLabel('Description').fill(description);

	// Select priority (default is 'low', so if we need different priority, change it)
	if (priority !== 'low') {
		await page.getByLabel('Priority').click();
		await page.getByRole('option', { name: priority.charAt(0).toUpperCase() + priority.slice(1) }).click();
	}

	// Select status (default is 'todo', so if we need different status, change it)
	if (status !== 'todo') {
		await page.getByLabel('Status').click();
		await page.getByRole('option', { name: status.charAt(0).toUpperCase() + status.slice(1) }).click();
	}

	// Submit the form
	await page.getByRole('button', { name: 'Submit' }).click();

	await expect(page.getByRole('dialog')).not.toBeVisible();

	// Wait for the story to appear in the list
	const storyCard = await findStoryCard(page, name);
	await expect(storyCard).toBeVisible();
}

async function findStoryCard(page: Page, storyName: string) {
	return page.locator('.bg-sidebar').filter({ hasText: storyName }).first();
}

async function openStoryMenu(page: Page, storyName: string) {
	const storyCard = await findStoryCard(page, storyName);
	await storyCard.getByRole('button').click();

	// Wait for the dropdown menu to be visible
	await expect(page.getByRole('menu')).toBeVisible();
}

async function waitForStoryToAppear(page: Page, storyName: string, timeout = 5000) {
	const storyCard = await findStoryCard(page, storyName);
	await expect(storyCard).toBeVisible({ timeout });
}

async function waitForStoryToDisappear(page: Page, storyName: string, timeout = 5000) {
	const storyCard = await findStoryCard(page, storyName);
	await expect(storyCard).not.toBeVisible({ timeout });
}

test.describe('Stories Page', () => {
	let projectName: string;

	test.beforeEach(async ({ page }) => {
		// Clear the database before each test to ensure clean state
		await TestDatabaseUtils.clearAllTestData();

		// Create a project for testing stories
		projectName = 'Test Project for Stories';
		await createProject(page, projectName, 'A project to test stories functionality');
	});

	test('should display project stories page with correct elements', async ({ page }) => {
		await expect(page.getByRole('heading', { name: `Project - ${projectName}` })).toBeVisible();
		await expect(page.getByRole('button', { name: 'Create new' })).toBeVisible();

		// Check that all story status columns are visible
		await expect(page.getByText('Todo')).toBeVisible();
		await expect(page.getByText('Doing')).toBeVisible();
		await expect(page.getByText('Done')).toBeVisible();
	});

	test('should create a new story successfully', async ({ page }) => {
		const storyName = 'Test Story';
		const storyDescription = 'This is a test story description';

		await createStory(page, storyName, storyDescription);

		const storyCard = await findStoryCard(page, storyName);
		await expect(storyCard).toBeVisible();
		await expect(storyCard.getByText(storyName)).toBeVisible();
	});

	test('should show validation errors when creating story with invalid data', async ({ page }) => {
		await page.getByRole('button', { name: 'Create new' }).click();

		await expect(page.getByRole('dialog')).toBeVisible();

		await page.getByRole('button', { name: 'Submit' }).click();

		await expect(page.getByText('Name must be at least 2 characters')).toBeVisible();
		await expect(page.getByText('Description must be at least 2 characters')).toBeVisible();

		await page.getByLabel('Name').fill('A');
		await page.getByLabel('Description').fill('B');
		await page.getByRole('button', { name: 'Submit' }).click();

		await expect(page.getByText('Name must be at least 2 characters')).toBeVisible();
		await expect(page.getByText('Description must be at least 2 characters')).toBeVisible();
	});

	test('should create stories with different priorities', async ({ page }) => {
		const stories = [
			{ name: 'Low Priority Story', description: 'Low priority description', priority: 'low' },
			{ name: 'Medium Priority Story', description: 'Medium priority description', priority: 'medium' },
			{ name: 'High Priority Story', description: 'High priority description', priority: 'high' },
		];

		for (const story of stories) {
			await createStory(page, story.name, story.description, story.priority);
		}

		// Verify all stories are visible
		for (const story of stories) {
			const storyCard = await findStoryCard(page, story.name);
			await expect(storyCard).toBeVisible();
		}
	});

	test('should create stories with different statuses', async ({ page }) => {
		const stories = [
			{ name: 'Todo Story', description: 'Todo description', status: 'todo' },
			{ name: 'Doing Story', description: 'Doing description', status: 'doing' },
			{ name: 'Done Story', description: 'Done description', status: 'done' },
		];

		for (const story of stories) {
			await createStory(page, story.name, story.description, 'low', story.status);
		}

		// Verify stories appear in their respective columns
		// Todo column - verify the story card exists in the todo column
		const todoColumn = page.locator('li').filter({ hasText: 'Todo' });
		const todoStoryCard = todoColumn.locator('.bg-sidebar').filter({ hasText: 'Todo Story' });
		await expect(todoStoryCard).toBeVisible();

		// Doing column - verify the story card exists in the doing column
		const doingColumn = page.locator('li').filter({ hasText: 'Doing' });
		const doingStoryCard = doingColumn.locator('.bg-sidebar').filter({ hasText: 'Doing Story' });
		await expect(doingStoryCard).toBeVisible();

		// Done column - verify the story card exists in the done column
		const doneColumn = page.locator('li').filter({ hasText: 'Done' });
		const doneStoryCard = doneColumn.locator('.bg-sidebar').filter({ hasText: 'Done Story' });
		await expect(doneStoryCard).toBeVisible();
	});

	test('should update an existing story', async ({ page }) => {
		const originalName = 'Original Story';
		const originalDescription = 'Original description';

		const updatedName = 'Updated Story';
		const updatedDescription = 'Updated description';

		await createStory(page, originalName, originalDescription);

		await openStoryMenu(page, originalName);

		// Click the Update button inside the dropdown menu
		await page.getByRole('menuitem').filter({ hasText: 'Update' }).click();

		await expect(page.getByRole('dialog')).toBeVisible();
		await expect(page.getByText('Update story')).toBeVisible();

		// Update the fields
		await page.getByLabel('Name').fill(updatedName);
		await page.getByLabel('Description').fill(updatedDescription);

		// Change priority to medium
		await page.getByLabel('Priority').click();
		await page.getByRole('option', { name: 'Medium' }).click();

		// Submit the form
		await page.getByRole('button', { name: 'Submit' }).click();

		await expect(page.getByRole('dialog')).not.toBeVisible();

		// Verify the story is updated in the list
		const updatedStoryCard = await findStoryCard(page, updatedName);
		await expect(updatedStoryCard).toBeVisible();

		// Verify the old story name is no longer visible
		await expect(page.getByText(originalName, { exact: true })).not.toBeVisible();
	});

	test('should delete an existing story', async ({ page }) => {
		const storyName = 'Story to Delete';
		const storyDescription = 'This story will be deleted';

		await createStory(page, storyName, storyDescription);

		const storyCard = await findStoryCard(page, storyName);
		await expect(storyCard).toBeVisible();

		await openStoryMenu(page, storyName);

		// Click the Delete button inside the dropdown menu
		await page.getByRole('menuitem').filter({ hasText: 'Delete' }).click();

		await expect(page.getByText('Are you absolutely sure?')).toBeVisible();
		await expect(page.getByText('This action cannot be undone')).toBeVisible();

		// Confirm deletion
		await page.getByRole('button', { name: 'Delete' }).click();

		await expect(page.getByRole('dialog')).not.toBeVisible();

		// Verify the story is no longer in the list
		await waitForStoryToDisappear(page, storyName);
	});

	test('should cancel story deletion', async ({ page }) => {
		const storyName = 'Story to Keep';
		const storyDescription = 'This story will not be deleted';

		await createStory(page, storyName, storyDescription);

		await openStoryMenu(page, storyName);

		// Click the Delete button inside the dropdown menu
		await page.getByRole('menuitem').filter({ hasText: 'Delete' }).click();

		// Cancel deletion
		await page.getByRole('button', { name: 'Cancel' }).click();

		await expect(page.getByRole('dialog')).not.toBeVisible();

		// Verify the story is still in the list
		const storyCard = await findStoryCard(page, storyName);
		await expect(storyCard).toBeVisible();
	});

	test('should open story details modal when clicking on story card', async ({ page }) => {
		const storyName = 'Clickable Story';
		const storyDescription = 'This story is clickable';

		await createStory(page, storyName, storyDescription);

		const storyCard = await findStoryCard(page, storyName);
		await storyCard.click();

		// Verify details modal opens
		await expect(page.getByRole('dialog')).toBeVisible();
		await expect(page.getByText(`Details of ${storyName} story`)).toBeVisible();
		await expect(page.getByRole('dialog').getByText(storyName)).toBeVisible();
	});

	test('should handle multiple stories correctly', async ({ page }) => {
		const stories = [
			{ name: 'Story One', description: 'First story' },
			{ name: 'Story Two', description: 'Second story' },
			{ name: 'Story Three', description: 'Third story' },
		];

		// Create multiple stories
		for (const story of stories) {
			await createStory(page, story.name, story.description);
		}

		// Verify all stories are visible
		for (const story of stories) {
			const storyCard = await findStoryCard(page, story.name);
			await expect(storyCard).toBeVisible();
		}

		// Delete the middle story
		await openStoryMenu(page, 'Story Two');
		await page.getByRole('menuitem').filter({ hasText: 'Delete' }).click();
		await page.getByRole('button', { name: 'Delete' }).click();

		// Verify only the remaining stories are visible
		await waitForStoryToAppear(page, 'Story One');
		await waitForStoryToDisappear(page, 'Story Two');
		await waitForStoryToAppear(page, 'Story Three');
	});

	test('should close modal when clicking outside or pressing escape', async ({ page }) => {
		// Open create modal
		await page.getByRole('button', { name: 'Create new' }).click();
		await expect(page.getByRole('dialog')).toBeVisible();

		// Close by pressing Escape
		await page.keyboard.press('Escape');
		await expect(page.getByRole('dialog')).not.toBeVisible();

		// Open again and try to close by clicking outside (if modal has backdrop)
		await page.getByRole('button', { name: 'Create new' }).click();
		await expect(page.getByRole('dialog')).toBeVisible();

		// Click outside the modal content (on backdrop)
		await page.mouse.click(50, 50);
		await expect(page.getByRole('dialog')).not.toBeVisible();
	});

	test('should handle story with special characters in name and description', async ({ page }) => {
		const specialName = 'Test & "Story" <Special>';
		const specialDescription = 'Description with special chars: @#$%^&*()_+{}|:"<>?';

		await createStory(page, specialName, specialDescription);

		// Verify the story appears correctly
		const storyCard = await findStoryCard(page, specialName);
		await expect(storyCard).toBeVisible();
	});

	test('should handle long story names and descriptions', async ({ page }) => {
		const longName = 'A'.repeat(100); // Very long name
		const longDescription = 'B'.repeat(500); // Very long description

		await createStory(page, longName, longDescription);

		// Verify the story appears (might be truncated in UI but should be created)
		const storyCard = await findStoryCard(page, longName);
		await expect(storyCard).toBeVisible();
	});

	test('should display story ID in card', async ({ page }) => {
		const storyName = 'Story with ID';
		const storyDescription = 'This story should show an ID';

		await createStory(page, storyName, storyDescription);

		const storyCard = await findStoryCard(page, storyName);
		await expect(storyCard).toBeVisible();

		// Check that story ID is displayed (showing first 5 characters with # prefix)
		await expect(storyCard.locator('p').filter({ hasText: /^#.{5}/ })).toBeVisible();
	});

	test('should create stories with all priority combinations', async ({ page }) => {
		const priorities = ['low', 'medium', 'high'];
		const statuses = ['todo', 'doing', 'done'];

		let storyIndex = 1;
		for (const priority of priorities) {
			for (const status of statuses) {
				const storyName = `Story ${storyIndex} - ${priority} ${status}`;
				const storyDescription = `${priority} priority story in ${status} status`;

				await createStory(page, storyName, storyDescription, priority, status);
				storyIndex++;
			}
		}

		// Verify all stories are created and in correct columns
		for (const status of statuses) {
			const statusColumn = page.locator('li').filter({ hasText: status.charAt(0).toUpperCase() + status.slice(1) });

			for (const priority of priorities) {
				const expectedStoryName = `Story ${priorities.indexOf(priority) * 3 + statuses.indexOf(status) + 1} - ${priority} ${status}`;
				const storyCard = statusColumn.locator('.bg-sidebar').filter({ hasText: expectedStoryName });
				await expect(storyCard).toBeVisible();
			}
		}
	});

	test('should handle form validation when updating story', async ({ page }) => {
		const storyName = 'Story to Update';
		const storyDescription = 'Original description';

		await createStory(page, storyName, storyDescription);

		await openStoryMenu(page, storyName);
		await page.getByRole('menuitem').filter({ hasText: 'Update' }).click();

		await expect(page.getByRole('dialog')).toBeVisible();

		// Clear the name and description to trigger validation
		await page.getByLabel('Name').fill('');
		await page.getByLabel('Description').fill('');

		await page.getByRole('button', { name: 'Submit' }).click();

		// Check for validation errors
		await expect(page.getByText('Name must be at least 2 characters')).toBeVisible();
		await expect(page.getByText('Description must be at least 2 characters')).toBeVisible();

		// Fill with single characters (still invalid)
		await page.getByLabel('Name').fill('A');
		await page.getByLabel('Description').fill('B');

		await page.getByRole('button', { name: 'Submit' }).click();

		await expect(page.getByText('Name must be at least 2 characters')).toBeVisible();
		await expect(page.getByText('Description must be at least 2 characters')).toBeVisible();

		// The dialog should still be open
		await expect(page.getByRole('dialog')).toBeVisible();
	});
});
