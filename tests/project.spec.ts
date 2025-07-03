import { test, expect, Page } from '@playwright/test';
import { TestDatabaseUtils } from './utils/database';

async function createProject(page: Page, name: string, description: string) {
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
}

async function findProjectCard(page: Page, projectName: string) {
	return page.getByTestId('card').filter({ hasText: projectName }).first();
}

async function openProjectMenu(page: Page, projectName: string) {
	const projectCard = await findProjectCard(page, projectName);
	await projectCard.getByRole('button').click();

	// Wait for the dropdown menu to be visible
	await expect(page.getByRole('menu')).toBeVisible();
}

async function waitForProjectToAppear(page: Page, projectName: string, timeout = 5000) {
	await expect(
		page.getByRole('heading', {
			name: projectName,
		})
	).toBeVisible({ timeout });
}

async function waitForProjectToDisappear(page: Page, projectName: string, timeout = 5000) {
	await expect(
		page.getByRole('heading', {
			name: projectName,
		})
	).not.toBeVisible({ timeout });
}

test.describe('Projects Page', () => {
	test.beforeEach(async ({ page }) => {
		// Clear the database before each test to ensure clean state
		await TestDatabaseUtils.clearAllTestData();
		await page.goto('/projects');
		await expect(page.getByRole('heading', { name: 'Projects' })).toBeVisible();
	});

	test('should display projects page with correct elements', async ({ page }) => {
		await expect(page.getByRole('heading', { name: 'Projects' })).toBeVisible();
		await expect(page.getByRole('button', { name: 'Create new' })).toBeVisible();
	});

	test('should create a new project successfully', async ({ page }) => {
		const projectName = 'Test Project';
		const projectDescription = 'This is a test project description';

		await createProject(page, projectName, projectDescription);

		const projectCard = await findProjectCard(page, projectName);
		await expect(projectCard).toBeVisible();
		await expect(projectCard.getByText(projectDescription)).toBeVisible();
	});

	test('should show validation errors when creating project with invalid data', async ({ page }) => {
		await page.getByRole('button', { name: 'Create new' }).click();

		await expect(page.getByRole('dialog')).toBeVisible();

		await page.getByRole('button', { name: 'Submit' }).click();

		await expect(page.getByText('Name must be at least 2 characters')).toBeVisible();
		await expect(page.getByText('Description must be at least 2 characters')).toBeVisible();

		await page.getByPlaceholder('Enter project name').fill('A');
		await page.getByPlaceholder('Describe project in few words').fill('B');
		await page.getByRole('button', { name: 'Submit' }).click();

		await expect(page.getByText('Name must be at least 2 characters')).toBeVisible();
		await expect(page.getByText('Description must be at least 2 characters')).toBeVisible();
	});

	test('should update an existing project', async ({ page }) => {
		const originalName = 'Original Project';
		const originalDescription = 'Original description';

		const updatedName = 'Updated Project';
		const updatedDescription = 'Updated description';

		await createProject(page, originalName, originalDescription);

		await openProjectMenu(page, originalName);

		// Click the Update button inside the dropdown menu
		await page.getByRole('menuitem').filter({ hasText: 'Update' }).click();

		await expect(page.getByRole('dialog')).toBeVisible();
		await expect(page.getByText('Update project')).toBeVisible();

		// Update the fields
		await page.getByPlaceholder('Enter project name').fill(updatedName);
		await page.getByPlaceholder('Describe project in few words').fill(updatedDescription);

		// Submit the form
		await page.getByRole('button', { name: 'Submit' }).click();

		await expect(page.getByRole('dialog')).not.toBeVisible();

		// Verify the project is updated in the list
		const updatedProjectCard = await findProjectCard(page, updatedName);
		await expect(updatedProjectCard).toBeVisible();
		await expect(updatedProjectCard.getByText(updatedDescription)).toBeVisible();

		// Verify the old project name is no longer visible
		await expect(page.getByText(originalName, { exact: true })).not.toBeVisible();
	});

	test('should delete an existing project', async ({ page }) => {
		const projectName = 'Project to Delete';
		const projectDescription = 'This project will be deleted';

		await createProject(page, projectName, projectDescription);

		const projectCard = await findProjectCard(page, projectName);
		await expect(projectCard).toBeVisible();

		await openProjectMenu(page, projectName);

		// Click the Delete button inside the dropdown menu
		await page.getByRole('menuitem').filter({ hasText: 'Delete' }).click();

		await expect(page.getByText('Are you absolutely sure?')).toBeVisible();
		await expect(page.getByText('This action cannot be undone')).toBeVisible();

		// Confirm deletion
		await page.getByRole('button', { name: 'Delete' }).click();

		await expect(page.getByRole('dialog')).not.toBeVisible();

		// Verify the project is no longer in the list
		await waitForProjectToDisappear(page, projectName);
		await expect(page.getByText(projectDescription)).not.toBeVisible();
	});

	test('should cancel project deletion', async ({ page }) => {
		const projectName = 'Project to Keep';
		const projectDescription = 'This project will not be deleted';

		await createProject(page, projectName, projectDescription);

		await openProjectMenu(page, projectName);

		// Click the Delete button inside the dropdown menu
		await page.getByRole('menuitem').filter({ hasText: 'Delete' }).click();

		// Cancel deletion
		await page.getByRole('button', { name: 'Cancel' }).click();

		await expect(page.getByRole('dialog')).not.toBeVisible();

		// Verify the project is still in the list
		const projectCard = await findProjectCard(page, projectName);
		await expect(projectCard).toBeVisible();
		await expect(projectCard.getByText(projectDescription)).toBeVisible();
	});

	test('should allow clicking on project card to navigate', async ({ page }) => {
		const projectName = 'Clickable Project';
		const projectDescription = 'This project is clickable';

		await createProject(page, projectName, projectDescription);

		await page
			.getByRole('link', {
				name: projectName,
			})
			.click();

		await expect(page.getByRole('heading', { name: `Project - ${projectName}` })).toBeVisible();
	});

	test('should handle multiple projects correctly', async ({ page }) => {
		const projects = [
			{ name: 'Project One', description: 'First project' },
			{ name: 'Project Two', description: 'Second project' },
			{ name: 'Project Three', description: 'Third project' },
		];

		// Create multiple projects
		for (const project of projects) {
			await createProject(page, project.name, project.description);
		}

		// Verify all projects are visible
		for (const project of projects) {
			const projectCard = await findProjectCard(page, project.name);
			await expect(projectCard).toBeVisible();
			await expect(projectCard.getByText(project.description)).toBeVisible();
		}

		// Delete the middle project
		await openProjectMenu(page, 'Project Two');
		await page.getByRole('menuitem').filter({ hasText: 'Delete' }).click();
		await page.getByRole('button', { name: 'Delete' }).click();

		// Verify only the remaining projects are visible
		await waitForProjectToAppear(page, 'Project One');
		await waitForProjectToDisappear(page, 'Project Two');
		await waitForProjectToAppear(page, 'Project Three');
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

	test('should handle project with special characters in name and description', async ({ page }) => {
		const specialName = 'Test & "Project" <Special>';
		const specialDescription = 'Description with special chars: @#$%^&*()_+{}|:"<>?';

		await createProject(page, specialName, specialDescription);

		// Verify the project appears correctly
		const projectCard = await findProjectCard(page, specialName);
		await expect(projectCard).toBeVisible();
		await expect(projectCard.getByText(specialDescription)).toBeVisible();
	});

	test('should handle long project names and descriptions', async ({ page }) => {
		const longName = 'A'.repeat(100); // Very long name
		const longDescription = 'B'.repeat(500); // Very long description

		await createProject(page, longName, longDescription);

		// Verify the project appears (might be truncated in UI but should be created)
		const projectCard = await findProjectCard(page, longName);
		await expect(projectCard).toBeVisible();
	});
});
