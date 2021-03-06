import mongoose from 'mongoose';

const Schema = mongoose.Schema;

// Tweet schema
const tweetSchema = new Schema({
	user: String,
	id_str: String,
	data: Object,
	date: Date
});

// Create index for tweet searching
tweetSchema.index({'data.text': 'text'})

const Tweet = mongoose.model('Tweets', tweetSchema);

module.exports = Tweet;

