const version = /\d+\.\d+\.\d+/.exec(process.version);
const node = version[0];
module.exports = {
	presets: [
		'@babel/preset-typescript',
		[
			'@babel/preset-env',
			{
				targets: {
					node,
				},
			},
		],
	],
	plugins: ['transform-class-properties'],
};
