module.exports = function ({ types }, options) {
	return {
		visitor: {
			CallExpression(path) {
				let calleeObjectCode = path.get("callee").toString();
				if (types.isMemberExpression(path.node.callee) && calleeObjectCode === options.calleeSourceCode) {
					const newNode = types.identifier(options.calleeTargetCode);
					path.get("callee").get("object").replaceWith(newNode);
				}
			},
		},
	};
};
