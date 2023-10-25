module.exports = {
	env: {
		browser: true,
		es2021: true,
	},
	extends: ['plugin:react/recommended', 'google'],
	overrides: [],
	parserOptions: {
		ecmaVersion: 'latest',
		sourceType: 'module',
	},
	plugins: ['react'],
	rules: {
		'react/react-in-jsx-scope': 0,
		'linebreak-style': 0,
		'object-curly-spacing': 0,
		'require-jsdoc': 0,
		'valid-jsdoc': 0,
		'indent': 0,
		'no-tabs': 0,
		'max-len': 'off',
		'no-unused-vars': 'off',
	},
};
