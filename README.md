## Synopsis

At the top of the testing using selenium framework, this tool provides:

**Complete task scripting functionality**
**Single click partial item run support**
**Automatic final xml & java file generation**

## Usage

**Scripting**
1. User select application type
2. Add task details
3. Add multiple methods and actions

**Execution**
1. Click top right settings button
2. Select method / pathway to run
3. Click on run - This will launch server page
4. Click launch

Pre-requisites:
1. Download runner server code
2. Start the server using "npm start"
3. Checkout selenium framework code from svn
4. Launch http://localhost
5. Set Path of selenium framework src folder

**Exporting xml & java files**
1. Add Pathways
	a) Select methods in each item & click "Add Pathway"
	b) You can add / delete multiple pathways using above steps
2. Create Files by clicking "Export Files" on top right corner - This will launch the server page
3. On the new page you can run complete set of pathways
4. You can download xml & Java files from this page

## Dependencies
1. Node
2. Java
3. Maven

## Major limitations of version 1.1

1. This will not work if user open this in multiple tabs / windows
2. Page refresh is not allowed for now, this will detach sync from data

## Features in queue
1. Fixes for Limitations of version 1.1
2. Support to update tasks
3. Autofill task / method / action data

## Reporting issues
Please feel free to add issues and suggestion in issues section.  
