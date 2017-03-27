'use strict'
const _ = require('lodash');

const stemmer = require('porter-stemmer').stemmer;

class BayesClassifier {

	constructor() {
		this.docs = [];
		this.lastAdded = 0;
		this.features = {};
		this.classFeatures = {};
		this.classTotals = {};
		this.totalExamples = 1;
		this.smoothing = 1;
	}

	addDocument(doc, label) {
		if (!_.size(doc)) {
			return;
		}
		if (_.isString(doc)) { 
			doc = doc.split(' ').map(function (t) { return stemmer(t); }).join(' ');
		}
		const docObj = {
			label: label,
			value: doc
		};
		this.docs.push(docObj);
		for (let i = 0; i < doc.length; i++) {
			this.features[doc[i]] = 1;
		}
	}

	addDocuments(docs, label) {
		for (let i = 0; i < docs.length; i++) {
			this.addDocument(docs[i], label);
		}
	}

	docToFeatures(doc) {
		let features = [];
		if (_.isString(doc)) {
			doc = doc.split(' ').map(function (t) { return stemmer(t); }).join(' ');
		}
		for (var feature in this.features) {
			features.push(Number(!!~doc.indexOf(feature)));
		}
		return features;
	}

	classify(doc) {
		let classifications = this.getClassifications(doc);
		if (!_.size(classifications)) {
			throw new Error('Not trained');
		}
		return classifications[0].label;
	}

	train() {
		const totalDocs = this.docs.length;
		for (let i = this.lastAdded; i < totalDocs; i++) {
			const features = this.docToFeatures(this.docs[i].value);
			this.addFeature(features, this.docs[i].label);
			this.lastAdded++;
		}
	}

	addFeature(docFeatures, label) {
		
		if (!this.classFeatures[label]) {
			this.classFeatures[label] = {};
			this.classTotals[label] = 1;
		}

		this.totalExamples++;

		if (_.isArray(docFeatures)) {
			let i = docFeatures.length;
			this.classTotals[label]++;

			while(i--) {
			  if (docFeatures[i]) {
				if (this.classFeatures[label][i]) {
				  this.classFeatures[label][i]++;
				} else {
				  this.classFeatures[label][i] = 1 + this.smoothing;
				}
			  }
			}
		} else {
			for (let key in docFeatures) {
				value = docFeatures[key];

				if (this.classFeatures[label][value]) {
					this.classFeatures[label][value]++;
				} else {
					this.classFeatures[label][value] = 1 + this.smoothing;
				}
			}
		}
	}

	probabilityOfClass(docFeatures, label) {
		
		let count = 0;
		let prob = 0;
		if (_.isArray(docFeatures)) {
			let i = docFeatures.length;

			while(i--) {
			  if (docFeatures[i]) {

				count = this.classFeatures[label][i] || this.smoothing;

				prob += Math.log(count / this.classTotals[label]);
			  }
			}
		} else {
			for (var key in docFeatures) {
				count = this.classFeatures[label][docFeatures[key]] || this.smoothing;
				prob += Math.log(count / this.classTotals[label]);
			}
		}
		const featureRatio = (this.classTotals[label] / this.totalExamples);

		prob = featureRatio * Math.exp(prob);

		return prob;
	}

	getClassifications(doc) {

		let labels = [];
		for (let className in this.classFeatures) {
			labels.push({
				label: className,
				value: this.probabilityOfClass(this.docToFeatures(doc), className)
			});
		}
		return labels.sort(function(x, y) {
			return y.value - x.value;
		});
	}

}

module.exports = BayesClassifier;