'use strict'

const BayesClassifier = require('./');
let classifier = new BayesClassifier();

describe('Test bayes classifier', function() {

	it('should classify', function(done) {

		const hamDocuments = [
			'this',
			'trip to Tahoe',
			'(no subject)',
			'weekend trip'
			];

		const spamDocuments = [
			'Breaking News',
			'Nice to meet you',
			'Regarding your documents',
			'Hot girls ready'
			];

		classifier.addDocuments(hamDocuments, 'ham');
		classifier.addDocuments(spamDocuments, 'spam');
		classifier.train();
		
		classifier.classify('trip this weekend').should.equal('ham');
		classifier.classify('girls for you tonight').should.equal('spam');
		classifier.classify('Breaking! Trump exposed').should.equal('spam');
		done();
	});

});