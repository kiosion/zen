const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
	id: {
		type: String,
		required: true,
		unique: true
	},
	name: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true
	},
});

export const User = mongoose.model('User', userSchema);
