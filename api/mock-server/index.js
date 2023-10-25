/* eslint-disable space-before-function-paren */
const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');

const contentType = 'application/json';

app.use(function (req, res, next) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
	res.setHeader('Access-Control-Allow-Credentials', true);
	next();
});

app.get('/api/dashboardProjects', (req, res) => {
	sendData('projects.json', 200, res, contentType);
});

app.get('/api/projects/:idProject', (req, res) => {
	const { idProject } = req.params;
	if (!idProject || idProject === 'error') {
		res.status(500).json({});
	} else {
		const mockPath = path.join(__dirname, 'mock-files', 'projects.json');
		fs.readFile(mockPath, 'utf8', function (err, projects) {
			projects = JSON.parse(projects);
			const filteredProject = projects.filter(
				(projects) => projects.id == idProject,
			);
			res.header('Content-Type', 'application/json');
			res.status(200);
			res.send(filteredProject);
		});
	}
});

app.post('/api/projects', (req, res) => {
	sendData('projects.json', 200, res, contentType);
});

app.get('/api/users/search/:param', (req, res) => {
	const { param } = req.params;
	if (!param || param === 'error') {
		res.status(500).json({});
	} else {
		const mockPath = path.join(__dirname, 'mock-files', 'users.json');
		fs.readFile(mockPath, 'utf8', function (err, users) {
			users = JSON.parse(users);
			const filteredUsers = users.filter((user) =>
				user.name.toLowerCase().includes(param.trim().toLowerCase()),
			);
			res.header('Content-Type', 'application/json');
			res.status(200);
			res.send(filteredUsers);
		});
	}
});

function sendData(filePath, statusCode, res, contentType, attr) {
	const encoding = 'utf8';
	const mockPath = path.join(__dirname, 'mock-files', filePath);
	fs.readFile(mockPath, encoding, function (err, data) {
		if (attr) {
			const object = JSON.parse(data);
			data = object[attr] ? JSON.stringify(object[attr]) : data;
		}
		res.header('Content-Type', contentType);
		res.status(statusCode);
		res.send(data);
	});
}

app.listen(5000, () => console.log('Example app listening on port 5000!'));
