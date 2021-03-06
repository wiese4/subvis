SubVis.StatisticHelper = (function () {
	var that = {},

		init = function() {
			return that;
		},

		/**
		 *
		 */
		getSentenceStatistics = function(seqs) {
			var stats = {};
			stats.wordCount = 0;
			stats.normCount = 0;
			stats.sents = 0;
			var low = 0;
			var high = 0;
			stats.min = [];
			stats.max = [];
			stats.duration = 0;
			for (var i = 0; i < seqs.length; i++) {
				var seq = seqs[i];
				stats.sents += seq.sentences.length;
				stats.duration += Number(seq.duration);
				for (var j = 0; j < seq.sentences.length; j++) {
					var words = seq.sentences[j].tokens.length;
					stats.wordCount += words;
					// add sequence array attriutes stemmedTokens form server data package if needed
					//stats.normCount += seq.sentences[j].stemmedTokens.length;
					if (low == 0) {
						low = words;
						stats.min.push(seq.sentences[j]);
					}
					if (words > high) {
						high = words;
						stats.max = [];
						stats.max.push(seq.sentences[j]);
					}
					else if (words == high) {
						stats.max.push(seq.sentences[j]);
					}
					if (words < low) {
						low = words;
						stats.min = [];
						stats.min.push(seq.sentences[j]);
					}
					else if (words == low) {
						stats.min.push(seq.sentences[j]);
					}
				}
			}
			stats.avgWordsInSent = stats.wordCount / stats.sents;
			stats.wordsPerMinute = stats.wordCount / (stats.duration / 6e4);
			stats.sentsPerMinute = stats.sents / (stats.duration / 6e4);
			return stats;
		},

		/**
		 *
		 */
		getWordFreqLists = function(seqs) {
			var lists = {};
			lists.wordList = [];
			lists.normList = [];
			lists.verbList = [];
			lists.adjectiveList = [];
			lists.adverbList = [];
			lists.nounList = [];
			lists.valueList = [];
			lists.entityList = [];

			var index = 0;

			for (var i = 0; i < seqs.length; i++) {
				for (var j = 0; j < seqs[i].sentences.length; j++) {
					// make wordList
/*					for (var s = 0; s < seqs[i].sentences[j].tokens.length; s++) {
						// add index to tokens
						seqs[i].sentences[j].tokens[s].seqIndex = index;
						index++;
					}
*/					// add token to list
					lists.wordList = lists.wordList.concat(seqs[i].sentences[j].tokens);

					// make normList
					// add stemmedTokens attribute to sequence array to use normList
					/*
					var normKeys = seqs[i].sentences[j].stemmedTokens;
					for (var r = 0; r < normKeys.length; r++) {
						lists.normList.push(normKeys[r]);
					}
					*/
					// make verbList
					lists.verbList = lists.verbList.concat(seqs[i].sentences[j].verbs());
					// make adjectiveList
					lists.adjectiveList = lists.adjectiveList.concat(seqs[i].sentences[j].adjectives());
					// make adverbList
					lists.adverbList = lists.adverbList.concat(seqs[i].sentences[j].adverbs());
					// make nounList
					lists.nounList = lists.nounList.concat(seqs[i].sentences[j].nouns());
					// make valueList
//					lists.valueList = lists.valueList.concat(seqs[i].sentences[j].values());
					// make entityList
					lists.entityList = lists.entityList.concat(seqs[i].sentences[j].entities());
				}
			}

			// create sorted lists
			lists.wordList = createSortedList(lists.wordList);
			//lists.normList = createSortedList(lists.normList);
			lists.verbList = createSortedList(lists.verbList);
			lists.adjectiveList = createSortedList(lists.adjectiveList);
			lists.adverbList = createSortedList(lists.adverbList);
			lists.nounList = createSortedList(lists.nounList);
//			lists.valueList = createSortedList(lists.valueList);
			lists.entityList = createSortedList(lists.entityList);

			return lists;
		},

		createSortedList = function(origin) {
			// sort list alphabetical
			origin.sort(function(a, b) {
				var keyA = a.normalised; //.toString().toLowerCase();
				var keyB = b.normalised; //.toString().toLowerCase();
				return (keyA < keyB) ? -1 : (keyA > keyB) ? 1 : 0;
			});
			//origin.sort(function(a,b){return (a.normalised) - (b.normalised)});
			var oldPos = -1;
			var oldKey;
			var tmp = [];
			for (var k = 0; k < origin.length; k++) {
				var key = origin[k].normalised;

				if(!key) {
					continue;
				}
				if (tmp.length == 0 || key != oldKey) {

					var entry = {};
					entry.key = key;
					entry.tokens = [];
					entry.tokens.push(origin[k]);
					entry.amount = 1;

					tmp.push(entry);
					oldKey = key;
					oldPos++;
				}
				else if (key == oldKey) {
					tmp[oldPos].tokens.push(origin[k]);
					tmp[oldPos].amount++;
				}
			}
			// sort by amount
			tmp.sort(function(a, b) {
				return (b.amount) - (a.amount)
			});
			return tmp;
		},
		
		sortList = function(origin) {
			// sort list alphabetical
			origin.sort(function(a, b) {
				return (a < b) ? -1 : (a > b) ? 1 : 0;
			});
			var oldPos = -1;
			var oldKey;
			var tmp = [];
			for (var k = 0; k < origin.length; k++) {
				var key = origin[k];

				if (tmp.length == 0 || key != oldKey) {

					var entry = {};
					entry.key = key;
					entry.amount = 1;

					tmp.push(entry);
					oldKey = key;
					oldPos++;
				}
				else if (key == oldKey) {
					tmp[oldPos].amount++;
				}
			}
			// sort by amount
			tmp.sort(function(a, b) {
				return (b.amount) - (a.amount)
			});
			return tmp;
		},


		/**
		 *
		 */
		getItemsPerMinute = function(items) {
			var dur = 0;
			for (var i = 0; i < items.length; i++) {
				dur += items[i].duration;
			}
			return dur / 6e4;
		},

		/**
		 *
		 */
		getTotalSentimentScore = function(seqs) {
			var score = 0;
			var arr = [];
			var total = seqs.length;
			var po = [];
			var ne = [];
			for (var i = 0; i < total; i++) {
				score += seqs[i].sentiment.score;
				var po = po.concat(seqs[i].sentiment.positive);
				var ne = ne.concat(seqs[i].sentiment.negative);
				//arr.push(seqs[i].sentiment)
			}
			score = score / total;
			po = sortList(po);
			ne = sortList(ne);
			return {
				score: score,
				//sentiments: arr,
				positiveList: po,
				negativeList: ne
			};
		};

	that.init = init;
	that.getSentenceStatistics = getSentenceStatistics;
	that.getWordFreqLists = getWordFreqLists;
	that.getItemsPerMinute = getItemsPerMinute;
	that.getTotalSentimentScore = getTotalSentimentScore;
	that.sortList = sortList;
	return that;
})();