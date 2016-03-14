## Synopsis<br />

At the top of the testing using selenium framework, this tool provides:<br />

**1. Complete task scripting functionality**<br />
**2. Single click partial item run support**<br />
**3. Automatic final xml & java file generation**<br />

## Usage<br />

**Scripting**<br />
1. Launch URL: http://abhishekcompro.github.io<br />
2. User select application type<br />
3. Add task details<br />
4. Add multiple methods and actions<br />

**Execution**<br />
1. Click top right settings button<br />
2. Select method / pathway to run<br />
3. Click on run - This will launch server page<br />
4. Click launch<br />

Pre-requisites:<br />
1. Download runner server (https://goo.gl/wlEiHH)<br />
2. Extract the files & Start the server using "RunnerLauncher.exe"<br />
3. Checkout selenium framework code from svn<br />
4. Launch http://localhost<br />
5. Set Path of selenium framework src folder<br />

**Exporting xml & java files**<br />
1. Add Pathways<br />
	a) Select methods in each item & click "Add Pathway"<br />
	b) You can add / delete multiple pathways using above steps<br />
2. Create Files by clicking "Export Files" on top right corner - This will launch the server page<br />
3. On the new page you can run complete set of pathways<br />
4. You can download xml & Java files from this page<br />

## Dependencies<br />
1. Node<br />
2. Java<br />
3. Maven<br />

## Limitations of version 1.1<br />

1. This will not work if user open app in multiple tabs / windows<br />
2. Page refresh is not allowed for now, this will detach sync from data<br />

## Features in queue<br />
1. Add support for known Limitations of version 1.1 <br />
2. Support to update tasks<br />
3. Autofill task / method / action data<br />

## Contributing & Reporting issues
Please feel free to contribute code; report issues and add suggestions on github.
GitHub Repo: https://github.com/AbhishekCompro/abhishekcompro.github.io
