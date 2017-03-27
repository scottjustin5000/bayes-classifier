# Bayes Classifier

simple bayes classifier

### Example Usage

```js
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

classifier.classify('trip this weekend'); //ham
classifier.classify('girls for you tonight'); //spam
classifier.classify('Breaking! Trump exposed'); //spam

```

## Testing

``
npm test
``