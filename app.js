// Following External Modules are required - use 'npm install' in terminal
const inquirer = require('inquirer')
const path = require('path')
const fs = require('fs')

// Importing modules from lib folder
const Manager = require('./lib/Manager')
const Engineer = require('./lib/Engineer')
const Intern = require('./lib/Intern')
const render = require('./lib/htmlRenderer')

// Output Path
const OUTPUT_DIR = path.resolve(__dirname, 'output')
const outputPath = path.join(OUTPUT_DIR, 'team.html')

// Validating user inputs - string, email, number
const validString = async input => (input !== '' ? true : 'Invalid input')
const validNumber = async input => (input !== '' && !isNaN(input) ? true : 'Invalid input')
const validEmail = input => (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input) ? true : 'Invalid input')

// Employee Questions prompted by the terminal
const employeeQuestions = [
	{
		type: 'employeeInfo',
		name: 'name',
		message: 'Name:',
		validate: validString
	},
	{
		type: 'employeeInfo',
		name: 'id',
		message: 'ID:',
		validate: validNumber
	},
	{
		type: 'employeeInfo',
		name: 'email',
		message: 'Email:',
		validate: validEmail
	}
]

// Manager Questions prompted by the terminal
const managerQuestions = [
	{
		type: 'employeeInfo',
		name: 'officeNumber',
		message: 'Office number:',
		validate: validNumber
	}
]

// Engineer Questions prompted by the terminal
const engineerQuestions = [
	{
		type: 'employeeInfo',
		name: 'github',
		message: 'GitHub username:',
		validate: validString
	}
]

// Intern Questions prompted by the terminal
const internQuestions = [
	{
		type: 'employeeInfo',
		name: 'school',
		message: 'School attending:',
		validate: validString
	}
]

// Criteria for adding team members
const nextTeamMember = [
	{
		type: 'list',
		message: 'Which member would you like to add next to your team?',
		name: 'next',
		choices: ['Engineer', 'Intern', 'All Done'] //Manager is not included as every team is assumed to have only one manager
	}
]

// Creating async function for awaiting prompts
async function createTeam() {

	// Initialising team
	const team = []

	// Beginning with Manager
	let role = 'Manager'

	// Adding team members until user prompts 'All Done'
	while (role != 'All Done') {

		// Getting info about employee
		const employeeInfo = await inquirer.prompt(employeeQuestions);

		// Adding role specific information and creating team member
		let specialInfo
		let newTeamMember

		switch (role) {

			case 'Manager':
				specialInfo = await inquirer.prompt(managerQuestions)
				newTeamMember = new Manager(employeeInfo.name, employeeInfo.id, employeeInfo.email, specialInfo.officeNumber)
				break

			case 'Engineer':
				specialInfo = await inquirer.prompt(engineerQuestions)
				newTeamMember = new Engineer(employeeInfo.name, employeeInfo.id, employeeInfo.email, specialInfo.github)
				break

			case 'Intern':
				specialInfo = await inquirer.prompt(internQuestions)
				newTeamMember = new Intern(employeeInfo.name, employeeInfo.id, employeeInfo.email, specialInfo.school)
				break

			default:
				console.log('Error')
		}

		// Adding next team member 
		team.push(newTeamMember)

		// Setting role of next member
		const nextMember = await inquirer.prompt(nextTeamMember)
		role = nextMember.next
	}

	// HTML rendering: team.html
	const html = render(team)

	// Creating HTML file
	fs.writeFile(outputPath, html, err => {
		if (err) throw err;
		console.log(`File ${path.basename(outputPath)} is saved.`)
	})
}

// Calling async function
createTeam();
