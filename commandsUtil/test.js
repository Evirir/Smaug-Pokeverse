const Discord = require('discord.js');
const mongoose = require('mongoose');
const cytoscape = require('cytoscape');

module.exports = {
	name: `test`,
	description: `Test new features.`,
	dev: true,

	async execute(message, args){
		let graph = cytoscape({

		  elements: [ // list of graph elements to start with
		    { // node a
		      data: { id: 'a' }
		    },
		    { // node b
		      data: { id: 'b' }
		    },
		    { // edge ab
		      data: { id: 'ab', source: 'a', target: 'b' }
		    }
		  ],

		  style: [ // the stylesheet for the graph
		    {
		      selector: 'node',
		      style: {
		        'background-color': '#666',
		        'label': 'data(id)'
		      }
		    },

		    {
		      selector: 'edge',
		      style: {
		        'width': 3,
		        'line-color': '#ccc',
		        'target-arrow-color': '#ccc',
		        'target-arrow-shape': 'triangle'
		      }
		    }
		  ],

		  layout: {
		    name: 'grid',
		    rows: 1
		  }

		});

		message.channel.send("Test", {
			files: [graph.png()]
		});
	}
}
