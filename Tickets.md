# Tickets Breakdown
We are a staffing company whose primary purpose is to book Agents at Shifts posted by Facilities on our platform. We're working on a new feature which will generate reports for our client Facilities containing info on how many hours each Agent worked in a given quarter by summing up every Shift they worked. Currently, this is how the process works:
- Data is saved in the database in the `Facilities`, `Agents`, and `Shifts` tables
- A function `getShiftsByFacility` is called with the Facility's id, returning all Shifts worked that quarter, including some metadata about the Agent assigned to each
- A function `generateReport` is then called with the list of Shifts. It converts them into a PDF which can be submitted by the Facility for compliance.


## Problem Statement
__Potential Security Flaw:__ the id of each Agent on the reports we generate is their internal database id. This is a security flaw that may provide hackers an insight into the type of database used and how the IDs are generated. By itself, this information is not a problem but if a hacker gains elevated access to the API, he may query information about the facility and its agents by predicting the IDs of the agent.


## Solution
We should add the ability for Facilities to save their own custom ids for each Agent they work with and use that id when generating reports for them. For security purposes, the custom IDs should not be serialized and they should be as random as possible to avoid predictability.


## Technical Specification
There are 3 database tables holding data:
- `Facilities`
- `Agents`
- `Shifts`

These tables have a relationship as follows:
- `Facilities` -> `Shifts`: one-to-many where a foreign key on the `Shifts` table references the ID of the owner record on the `Facilities` table.
- `Shifts` -> `Agents`: many-to-many where a list of foreign key on the `Agents` table references the ID of the owner record on the `Shifts` table.

There are 2 functions as follow:
- __getShiftsByFacility__ 
```js
function getShiftsByFacility(id: string): Shift[]
```

- __generateReport__ 
```js
function generateReport(shifts: Shift[]): string
```

## Tickets
1. Restructure database table structure for `Agents`
	- Tasks
		- Add a new column to the table named: `reportId`
		- The column should accept a data type of `string`/`varchar`/`text` of character length 255 and it must have a `UNIQUE` constraint
		- Write a query for every row in the table and populate the `reportId` columns with random unique string values as a placeholder till a function is created to update the column.
	- Definition of "Done"
		- A new column is created on the `Agents` table
		- Every existing row should have a random `reportId` value
	- Time estimates
		- 1 day
	- Points
		- 3
	- Blocked by
		- Nil
	- Relationship to other tasks
		- Nil
2. Create function `updateAgentCustomId`
	- Tasks
		- Create a new function that can update the `reportId` column of an existing row in the `Agents` table.
		- The function should take the following inputs
			- `id`: this is the `Agent` id
			- `reportId`: this is the cudtom id value that will update the `reportId` column of the row.
		- The function should return the following outputs
			- `error`: an error object thrown during the database operation (especially if the `reportId` is not unique)
			- `agent`: an object of the updated `agent` record showing the updated `reportId` column if the operation was successful.
		- Unit tests for the function operation
	- Definition of "Done"
		- The function must return an error object if the operation fails
		- The function must return the updated agent object if the operation is successful
		- The unit test must test for the failure and success path
	- Time estimates
		- 2 days
	- Points
		- 6
	- Blocked by
		- Restructure database table structure for `Agents`
	- Relationship to other tasks
		- Siblings
			- Refactor `getShiftsByFacility` function
3. Refactor `getShiftsByFacility` function
	- Tasks
		- The function should return a list of `Shifts` without the internal ID of the `Agents` of the shift in the metadata
		- The function should return a list of `Shifts` with the `reportId` of the `Agents` of the shift in the metadata
		- Unit tests to check that the internal ID is not returned
		- Unit tests to check that the `reportId` is returned
	- Definition of "Done"
		- The `Agents` objects in the `Shifts` list must not return their internal ID
		- The `Agents` objects in the `Shifts` list must return a `reportId`
		- The unit test must test for the failure and success path
	- Time estimates
		- 2 days
	- Points
		- 6
	- Blocked by
		- Restructure database table structure for `Agents`
	- Relationship to other tasks
		- Siblings
			- Create function `updateAgentCustomId`
4. Refactor `generateReport` function
	- Tasks
		- The function should replace the values of the internal ID column on the PDF with the `reportId` values of the same row
		- There should be a sample PDF generated before shipping the function
	- Definition of "Done"
		- The generated sample PDF should not display the internal ID
		- The generated sample PDF should display the `reportId` in place of the internal ID
	- Time estimates
		- 1 day
	- Points
		- 3
	- Blocked by
		- Refactor `getShiftsByFacility` function
	- Relationship to other tasks
		- Nil